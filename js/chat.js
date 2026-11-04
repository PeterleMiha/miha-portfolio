/* =========================================================
   HUNTERSFEEDER CHATBOT WIDGET — "Bambi"
   ---------------------------------------------------------
   Handles the button + window UI, memory, and talking to
   your Cloudflare Worker (which safely holds the Gemini key).

   >>> THE ONE THING YOU MUST EDIT <<<
   After you deploy your Cloudflare Worker, paste its URL into
   CONFIG.WORKER_URL below. Until then the bot shows a friendly
   "not connected yet" message instead of erroring.
========================================================= */

const CONFIG = {
  WORKER_URL: "https://huntersfeeder.miha-peterlea.workers.dev",
  /* Every chat with Bambi is mailed to you: one email per conversation, sent
     after IDLE_MS without a new message or when the visitor leaves / switches
     away. First through the Worker (Resend, 100 a day free); if the Worker
     can't send (no RESEND_API_KEY yet, daily cap reached), through Formspree. */
  LOG_URL: "https://formspree.io/f/xyznjgvd",
  IDLE_MS: 2 * 60 * 1000
};

(function () {

  /* ---------- Text shown in the chat window, per language ---------- */
  const chatText = {
    sl: {
      unclear: 'Ne razumem popolnoma, mogoče misliš', topics: [['Delovanje', 'Kako deluje HuntersFeeder?'], ['Cena', 'Koliko stane HuntersFeeder?'], ['Nastavitev', 'Kako nastavim napravo?']],
      title: "Bambi",
      sub: "virtualni pomočnik HuntersFeeder",
      note: "Pogovori se shranjujejo za izboljšanje odgovorov.",
      placeholder: "Vprašaj me karkoli o napravi...",
      greeting: "Zdravo, sem virtualni pomočnik Bambi! Kaj te zanima?",
      send: "Pošlji",
      typing: "Razmišljam...",
      notConnected: "Klepetalnik še ni povezan. Prosim, kontaktirajte mihapeterlea@gmail.com.",
      error: "Oprostite, prišlo je do napake. Poskusite znova ali pišite na mihapeterlea@gmail.com."
    },
    en: {
      unclear: 'I don\'t quite understand — maybe you mean', topics: [['How it works', 'How does HuntersFeeder work?'], ['Price', 'How much does HuntersFeeder cost?'], ['Setup', 'How do I set up the device?']],
      title: "Bambi",
      sub: "HuntersFeeder virtual assistant",
      note: "Chats are saved to improve the answers.",
      placeholder: "Ask me anything about the device...",
      greeting: "Hi, I'm Bambi, your virtual assistant! What would you like to know?",
      send: "Send",
      typing: "Thinking...",
      notConnected: "The chatbot isn't connected yet. Please contact mihapeterlea@gmail.com.",
      error: "Sorry, something went wrong. Please try again or email mihapeterlea@gmail.com."
    },
    hr: {
      unclear: 'Ne razumijem sasvim, možda misliš', topics: [['Kako radi', 'Kako radi HuntersFeeder?'], ['Cijena', 'Koliko košta HuntersFeeder?'], ['Postavljanje', 'Kako postaviti uređaj?']],
      title: "Bambi",
      sub: "virtualni pomoćnik HuntersFeeder",
      note: "Razgovori se spremaju radi poboljšanja odgovora.",
      placeholder: "Pitajte me bilo što o uređaju...",
      greeting: "Bok, ja sam virtualni pomoćnik Bambi! Što te zanima?",
      send: "Pošalji",
      typing: "Razmišljam...",
      notConnected: "Chatbot još nije povezan. Kontaktirajte mihapeterlea@gmail.com.",
      error: "Nažalost, došlo je do pogreške. Pokušajte ponovno ili pišite na mihapeterlea@gmail.com."
    },
    it: {
      unclear: 'Non ho capito bene, forse intendi', topics: [['Funzionamento', 'Come funziona HuntersFeeder?'], ['Prezzo', 'Quanto costa HuntersFeeder?'], ['Configurazione', 'Come configuro il dispositivo?']],
      title: "Bambi",
      sub: "assistente virtuale HuntersFeeder",
      note: "Le conversazioni vengono salvate per migliorare le risposte.",
      placeholder: "Chiedimi qualsiasi cosa sul dispositivo...",
      greeting: "Ciao, sono Bambi, il tuo assistente virtuale! Cosa ti interessa?",
      send: "Invia",
      typing: "Sto pensando...",
      notConnected: "Il chatbot non è ancora collegato. Contatta mihapeterlea@gmail.com.",
      error: "Spiacente, qualcosa è andato storto. Riprova o scrivi a mihapeterlea@gmail.com."
    },
    de: {
      unclear: 'Ich verstehe das nicht ganz – meinst du vielleicht', topics: [['Funktion', 'Wie funktioniert HuntersFeeder?'], ['Preis', 'Was kostet HuntersFeeder?'], ['Einrichtung', 'Wie richte ich das Gerät ein?']],
      title: "Bambi",
      sub: "virtueller Assistent von HuntersFeeder",
      note: "Gespräche werden gespeichert, um die Antworten zu verbessern.",
      placeholder: "Frag mich alles über das Gerät...",
      greeting: "Hallo, ich bin Bambi, dein virtueller Assistent! Was möchtest du wissen?",
      send: "Senden",
      typing: "Ich denke nach...",
      notConnected: "Der Chatbot ist noch nicht verbunden. Bitte kontaktiere mihapeterlea@gmail.com.",
      error: "Entschuldigung, etwas ist schiefgelaufen. Bitte versuche es erneut oder schreibe an mihapeterlea@gmail.com."
    }
  };

  /* ---------- "Show me" buttons under Bambi's answers ----------
     Bambi ends an answer with tags like [[go:manual]]; they are cut from the
     text and become buttons. A keyword check on the visitor's question adds
     the same buttons when the model forgets (or the Worker is older). The
     button opens the burger menu, pulses the right item, then follows it
     (top bar's window.hfMenuShow), so the visitor also learns where it is. */
  const GO = { features: 'f', how: 'h', price: 'p', pricing: 'p', faq: 'q', contact: 'c',
               gallery: 'g', app: 'a', manual: 'm' };
  const GO_HREF = { f: '#prednosti', h: '#delovanje', p: '#cena', q: '#faq', c: '#kontakt',
                    g: 'galerija/index.html', a: 'app/index.html', m: 'manual.html' };
  const GO_WORDS = [
    ['m', /navodil|priro[čc]nik|manual|anleitung|handbuch|istruzion|upute|uputstv|kako (jo |ga )?(nastavim|za[žz]enem|pove[žz]em|vklopim)|v delovanje|setup|einricht/],
    ['p', /cen[aeiou]?|cenik|koliko stane|price|preis|kostet|prezz|costa|cijen/],
    ['g', /galerij|slik[eo]|fotk|fotografij|gallery|galerie|galleri|photo|bilder|foto/],
    ['a', /aplikacij|app|demo/],
    ['c', /naro[čc]|rezerv|kupi|kupim|order|buy|bestell|kaufen|ordin|acquist|narud/]
  ];
  function parseGo(text) {
    const keys = [];
    const clean = text.replace(/\[\[\s*go\s*:\s*([a-z]+)\s*\]\]/gi, (m, k) => {
      const c = GO[k.toLowerCase()]; if (c && !keys.includes(c)) keys.push(c); return '';
    }).replace(/[ \t]+\n/g, '\n').trim();
    return { clean, keys };
  }
  function guessGo(question) {
    const q = question.toLowerCase();
    return GO_WORDS.filter(([, re]) => re.test(q)).map(([k]) => k);
  }
  function addGoButtons(bubble, keys) {
    if (!keys.length) return;
    const row = document.createElement('div');
    row.className = 'hfGo';
    keys.slice(0, 3).forEach(k => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.k = k;
      b.textContent = (window.hfMenuLabel && window.hfMenuLabel(k)) || k;
      b.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
      b.addEventListener('click', () => {
        flushLog();
        document.dispatchEvent(new CustomEvent('hf-chat-close'));
        if (!(window.hfMenuShow && window.hfMenuShow(k))) {
          const h = GO_HREF[k], onHome = !/\/(galerija|app)\/|manual\.html/.test(location.pathname);
          location.href = (h[0] === '#' && !onHome) ? 'index.html' + h : h;
        }
      });
      row.appendChild(b);
    });
    bubble.appendChild(row);
    const box = document.getElementById('hfChatMessages');
    box.scrollTop = box.scrollHeight;
  }

  /* "[[unclear]]" from the Worker (or an input with no letters at all): Bambi
     echoes the message and offers three topics as buttons; a button sends its
     question as if the visitor had typed it. */
  function unclearBubble(question) {
    const t = chatText[currentLang()];
    const short = question.length > 40 ? question.slice(0, 40) + '…' : question;
    const text = '"' + short + '"? ' + t.unclear + ' ' +
      t.topics.map(x => x[0].toLowerCase()).join(', ') + '?';
    const bubble = addMessage(text, 'bot');
    const row = document.createElement('div');
    row.className = 'hfGo';
    t.topics.forEach(([label, q]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = label;
      b.addEventListener('click', () => {
        row.querySelectorAll('button').forEach(x => { x.disabled = true; });
        window.hfBambiSend && window.hfBambiSend(q);
      });
      row.appendChild(b);
    });
    bubble.appendChild(row);
    document.getElementById('hfChatMessages').scrollTop = 1e9;
    return text;
  }

  /* Read the site language the page already stored in localStorage. */
  function currentLang() {
    const pageLang = document.documentElement.lang;
    if (chatText[pageLang]) return pageLang;
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
          <span class="hfTitleWrap"><span id="hfChatTitle">Bambi</span><span id="hfChatSub"></span></span>
          <button id="hfChatClose" aria-label="Close chat">&times;</button>
        </div>
        <div id="hfChatNote"></div>
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
    document.getElementById('hfChatSub').textContent = t.sub;
    document.getElementById('hfChatNote').textContent = t.note;
    document.getElementById('hfChatToggle').setAttribute('aria-label', t.title + ' — ' + t.sub);
    document.getElementById('hfChatInput').placeholder = t.placeholder;
    document.getElementById('hfChatSend').textContent = t.send;
  }

  function addMessage(text, who, extraClass) {
    const box = document.getElementById('hfChatMessages');
    const bubble = document.createElement('div');
    bubble.className = 'hfMsg hfMsg' + who + (extraClass ? ' ' + extraClass : '');
    bubble.textContent = text;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
    return bubble;
  }

  /* ---------- Memory: this tab's RAM only, on purpose ----------
     No localStorage/sessionStorage: `history` is just a variable in this
     closure, so it lives exactly as long as the page does and is gone on
     the next reload. Nothing about a chat with a device assistant needs to
     outlive the visit. */
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

  /* ---------- Conversation log -> your email (Formspree) ----------
     Only the visitor's questions and Bambi's answers since the last send,
     plus language, page and time. No IP or device data is added here.
     fetch(keepalive) instead of sendBeacon: it can send the
     "Accept: application/json" header, which is what makes Formspree treat
     this as an AJAX submission (no reCAPTCHA page, nothing to click). */
  const convId = Math.random().toString(36).slice(2, 8).toUpperCase();
  let loggedUpTo = 0;      // history index already sent
  let logPart = 0;
  let idleTimer = null;

  function flushLog() {
    clearTimeout(idleTimer);
    const slice = history.slice(loggedUpTo);
    if (!CONFIG.LOG_URL || !slice.some(m => m.role === 'user')) return;
    loggedUpTo = history.length;
    logPart += 1;
    const transcript = slice.map(m =>
      (m.role === 'user' ? 'Obiskovalec: ' : 'Bambi: ') + m.text).join('\n\n');
    const subject = 'Bambi pogovor ' + convId + (logPart > 1 ? ' (nadaljevanje ' + logPart + ')' : '');
    const meta = { jezik: currentLang(), stran: location.pathname,
                   cas: new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' }),
                   vprasanj: String(slice.filter(m => m.role === 'user').length) };
    const viaFormspree = () => {
    const fd = new FormData();
    fd.append('_subject', 'Bambi pogovor ' + convId + (logPart > 1 ? ' (nadaljevanje ' + logPart + ')' : ''));
    fd.append('vrsta', 'Bambi pogovor');
    fd.append('pogovor', transcript);
    fd.append('vprasanj', String(slice.filter(m => m.role === 'user').length));
    fd.append('jezik', currentLang());
    fd.append('stran', location.pathname);
    fd.append('cas', new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' }));
    try {
      fetch(CONFIG.LOG_URL, { method: 'POST', body: fd, keepalive: true,
                              headers: { 'Accept': 'application/json' } }).catch(() => {});
    } catch (e) {}
    };
    if (!CONFIG.WORKER_URL) return viaFormspree();
    try {
      /* text/plain keeps this a "simple" CORS request (no preflight), which
         keepalive needs to survive the page closing; the Worker parses JSON anyway. */
      fetch(CONFIG.WORKER_URL, { method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ mode: 'notify', kind: 'bambi', subject, text: transcript, meta })
      }).then(r => r.ok ? r.json() : null).then(d => { if (!d || !d.ok) viaFormspree(); })
        .catch(viaFormspree);
    } catch (e) { viaFormspree(); }
  }
  function scheduleLog() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(flushLog, CONFIG.IDLE_MS);
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushLog(); });
  window.addEventListener('pagehide', flushLog);

  /* ---------- Wire everything up ---------- */
  function initWidget() {
    buildWidget();
    applyWidgetLanguage();

    const toggle = document.getElementById('hfChatToggle');
    const win = document.getElementById('hfChatWindow');
    const closeBtn = document.getElementById('hfChatClose');
    const form = document.getElementById('hfChatForm');
    const input = document.getElementById('hfChatInput');

    const greeting = chatText[currentLang()].greeting;
    const greetBubble = addMessage(greeting, 'bot');
    history.push({ role: 'bot', text: greeting });
    loggedUpTo = history.length;   // the greeting itself is not worth an email

    // Tells index.html's floating "Zanima me" CTA to get out of the way
    // while the chat is open, instead of the two overlapping.
    function setOpen(isOpen) {
      win.classList.toggle('hidden', !isOpen);
      toggle.classList.toggle('hfActive', isOpen);
      document.body.classList.toggle('hf-chat-open', isOpen);
      document.dispatchEvent(new CustomEvent('hf-chat-toggle', { detail: isOpen }));
      // Focus on open, but not on touch devices: there, focusing an input
      // pops the keyboard immediately, which is an unrequested extra
      // motion on top of the window appearing. Desktop keeps the
      // convenience since there's no keyboard animation to fight.
      if (isOpen && !('ontouchstart' in window)) input.focus();
    }

    toggle.addEventListener('click', () => setOpen(win.classList.contains('hidden')));
    closeBtn.addEventListener('click', () => setOpen(false));
    document.addEventListener('hf-chat-close', () => setOpen(false));

    async function ask(text) {
      addMessage(text, 'user');
      history.push({ role: 'user', text });

      // nothing to read at all (no letters or digits): no need to ask the model
      let reply = /[\p{L}\p{N}]/u.test(text) ? null : '[[unclear]]';
      if (!reply) {
        const typingBubble = addMessage(chatText[currentLang()].typing, 'bot', 'hfTyping');
        reply = await sendToBot();
        typingBubble.remove();
      }

      if (/\[\[\s*unclear\s*\]\]/i.test(reply)) {
        history.push({ role: 'bot', text: unclearBubble(text) });
      } else {
        const go = parseGo(reply);
        const keys = go.keys.length ? go.keys : guessGo(text);
        const bubble = addMessage(go.clean || reply, 'bot');
        addGoButtons(bubble, keys);
        history.push({ role: 'bot', text: go.clean || reply });
      }
      scheduleLog();
    }
    window.hfBambiSend = ask;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      ask(text);
    });

    /* Contact form hand-off (index.html): the visitor's form message was only a
       general question, so Bambi answers it here. `actions` are buttons under
       the answer, e.g. "That answers it" / "Send anyway"; each runs once and
       then the row is disabled. The exchange is logged like any chat. */
    window.hfBambiAnswer = function (question, answer, actions) {
      setOpen(true);
      addMessage(question, 'user');
      history.push({ role: 'user', text: question });
      const go = parseGo(answer);
      const bubble = addMessage(go.clean || answer, 'bot');
      addGoButtons(bubble, go.keys);
      history.push({ role: 'bot', text: go.clean || answer });
      if (actions && actions.length) {
        const row = document.createElement('div');
        row.className = 'hfAct';
        actions.forEach((a, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = a.label;
          if (i === 0) b.className = 'hfActMain';
          b.addEventListener('click', () => {
            row.querySelectorAll('button').forEach(x => { x.disabled = true; });
            b.classList.add('hfActChosen');
            history.push({ role: 'user', text: '[' + a.label + ']' });
            if (a.reply) { addMessage(a.reply, 'bot'); history.push({ role: 'bot', text: a.reply }); }
            if (a.onClick) a.onClick();
            scheduleLog();
          });
          row.appendChild(b);
        });
        document.getElementById('hfChatMessages').appendChild(row);
      }
      const box = document.getElementById('hfChatMessages');
      box.scrollTop = box.scrollHeight;
      scheduleLog();
    };

    /* index.html fires this on every language change. Until the visitor
       has written anything, the greeting follows the language too. */
    document.addEventListener('hf-lang-change', () => {
      applyWidgetLanguage();
      if (history.length === 1) {
        const g = chatText[currentLang()].greeting;
        greetBubble.textContent = g;
        history[0].text = g;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
