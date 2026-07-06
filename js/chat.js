/* =========================================================
   HUNTERSFEEDER CHATBOT WIDGET
   ---------------------------------------------------------
   Handles the button + window UI, memory, and talking to
   your Cloudflare Worker (which safely holds the Gemini key).

   >>> THE ONE THING YOU MUST EDIT <<<
   After you deploy your Cloudflare Worker, paste its URL into
   CONFIG.WORKER_URL below. Until then the bot shows a friendly
   "not connected yet" message instead of erroring.
========================================================= */

const CONFIG = {
  // e.g. "https://huntersfeeder-bot.yourname.workers.dev"
  WORKER_URL: ""
};

(function () {

  /* ---------- Text shown in the chat window, per language ---------- */
  const chatText = {
    sl: {
      title: "HuntersFeeder pomočnik",
      placeholder: "Vprašaj me karkoli o napravi...",
      greeting: "Pozdravljeni! Sem pomočnik HuntersFeeder. Vprašajte me o napravi, nastavitvi ali naročilu.",
      send: "Pošlji",
      typing: "Razmišljam...",
      notConnected: "Klepetalnik še ni povezan. Prosim, kontaktirajte mihapeterlea@gmail.com.",
      error: "Oprostite, prišlo je do napake. Poskusite znova ali pišite na mihapeterlea@gmail.com."
    },
    en: {
      title: "HuntersFeeder assistant",
      placeholder: "Ask me anything about the device...",
      greeting: "Hi! I'm the HuntersFeeder assistant. Ask me about the device, setup, or ordering.",
      send: "Send",
      typing: "Thinking...",
      notConnected: "The chatbot isn't connected yet. Please contact mihapeterlea@gmail.com.",
      error: "Sorry, something went wrong. Please try again or email mihapeterlea@gmail.com."
    },
    hr: {
      title: "HuntersFeeder pomoćnik",
      placeholder: "Pitajte me bilo što o uređaju...",
      greeting: "Pozdrav! Ja sam HuntersFeeder pomoćnik. Pitajte me o uređaju, postavljanju ili narudžbi.",
      send: "Pošalji",
      typing: "Razmišljam...",
      notConnected: "Chatbot još nije povezan. Kontaktirajte mihapeterlea@gmail.com.",
      error: "Nažalost, došlo je do pogreške. Pokušajte ponovno ili pišite na mihapeterlea@gmail.com."
    },
    it: {
      title: "Assistente HuntersFeeder",
      placeholder: "Chiedimi qualsiasi cosa sul dispositivo...",
      greeting: "Ciao! Sono l'assistente HuntersFeeder. Chiedimi del dispositivo, della configurazione o dell'ordine.",
      send: "Invia",
      typing: "Sto pensando...",
      notConnected: "Il chatbot non è ancora collegato. Contatta mihapeterlea@gmail.com.",
      error: "Spiacente, qualcosa è andato storto. Riprova o scrivi a mihapeterlea@gmail.com."
    },
    de: {
      title: "HuntersFeeder-Assistent",
      placeholder: "Frag mich alles über das Gerät...",
      greeting: "Hallo! Ich bin der HuntersFeeder-Assistent. Frag mich zum Gerät, zur Einrichtung oder zur Bestellung.",
      send: "Senden",
      typing: "Ich denke nach...",
      notConnected: "Der Chatbot ist noch nicht verbunden. Bitte kontaktiere mihapeterlea@gmail.com.",
      error: "Entschuldigung, etwas ist schiefgelaufen. Bitte versuche es erneut oder schreibe an mihapeterlea@gmail.com."
    }
  };

  /* Read the site language the page already stored in localStorage. */
  function currentLang() {
    try {
      const stored = localStorage.getItem('hf_lang');
      if (stored && chatText[stored]) return stored;
    } catch (e) {}
    return 'sl';
  }

  /* ---------- Build button + window, inject into page ---------- */
  function buildWidget() {
    const wrap = document.createElement('div');
    wrap.id = 'hfChatWidget';
    wrap.innerHTML = `
      <button id="hfChatToggle" aria-label="Open chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </button>
      <div id="hfChatWindow" class="hidden">
        <div id="hfChatHeader">
          <span id="hfChatTitle">HuntersFeeder</span>
          <button id="hfChatClose" aria-label="Close chat">&times;</button>
        </div>
        <div id="hfChatMessages"></div>
        <form id="hfChatForm">
          <input id="hfChatInput" type="text" autocomplete="off" />
          <button type="submit" id="hfChatSend">Send</button>
        </form>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  function applyWidgetLanguage() {
    const t = chatText[currentLang()];
    document.getElementById('hfChatTitle').textContent = t.title;
    document.getElementById('hfChatInput').placeholder = t.placeholder;
    document.getElementById('hfChatSend').textContent = t.send;
  }

  function addMessage(text, who, extraClass) {
    const box = document.getElementById('hfChatMessages');
    const bubble = document.createElement('div');
    bubble.className = 'hfMsg hf' + who + (extraClass ? ' ' + extraClass : '');
    bubble.textContent = text;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
    return bubble;
  }

  /* ---------- Memory: save/load history in localStorage ---------- */
  function saveHistory(h) {
    try { localStorage.setItem('hf_chat_history', JSON.stringify(h)); } catch (e) {}
  }
  function loadHistory() {
    try {
      const raw = localStorage.getItem('hf_chat_history');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  let history = [];

  /* ---------- Talk to the Cloudflare Worker (which calls Gemini) ---------- */
  async function sendToBot() {
    const t = chatText[currentLang()];

    if (!CONFIG.WORKER_URL) {
      return t.notConnected;
    }
    try {
      const res = await fetch(CONFIG.WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: history.slice(-20).map(m => ({ role: m.role, text: m.text })),
          lang: currentLang()
        })
      });
      if (!res.ok) throw new Error('status ' + res.status);
      const data = await res.json();
      return (data && data.reply) ? data.reply : t.error;
    } catch (e) {
      return t.error;
    }
  }

  /* ---------- Wire everything up ---------- */
  function initWidget() {
    buildWidget();
    applyWidgetLanguage();

    const toggle = document.getElementById('hfChatToggle');
    const win = document.getElementById('hfChatWindow');
    const closeBtn = document.getElementById('hfChatClose');
    const form = document.getElementById('hfChatForm');
    const input = document.getElementById('hfChatInput');

    history = loadHistory();
    if (history.length === 0) {
      const greeting = chatText[currentLang()].greeting;
      addMessage(greeting, 'bot');
      history.push({ role: 'bot', text: greeting });
    } else {
      history.forEach(m => addMessage(m.text, m.role));
    }

    toggle.addEventListener('click', () => {
      win.classList.toggle('hidden');
      toggle.classList.toggle('hfActive');
      if (!win.classList.contains('hidden')) input.focus();
    });
    closeBtn.addEventListener('click', () => {
      win.classList.add('hidden');
      toggle.classList.remove('hfActive');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      addMessage(text, 'user');
      history.push({ role: 'user', text });
      saveHistory(history);

      const typingBubble = addMessage(chatText[currentLang()].typing, 'bot', 'hfTyping');
      const reply = await sendToBot();
      typingBubble.remove();

      addMessage(reply, 'bot');
      history.push({ role: 'bot', text: reply });
      saveHistory(history);
    });

    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.addEventListener('change', applyWidgetLanguage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
