/* =========================================================
   HUNTERSFEEDER — CLOUDFLARE WORKER
   ---------------------------------------------------------
   This runs on Cloudflare, NOT on your website. It holds your
   Gemini API key as a secret (never sent to browsers), reads
   your product knowledge from your site, and talks to Gemini.

   >>> THREE THINGS TO EDIT <<<
   1. KNOWLEDGE_URL  -> the address of your knowledge.md on your site
   2. ALLOWED_ORIGIN -> your website address (locks the Worker to your site)
   3. In the Cloudflare dashboard, add a SECRET named GEMINI_API_KEY
      (Settings -> Variables and Secrets). Never put the key in this file.
========================================================= */

const KNOWLEDGE_URL  = "https://peterlemiha.github.io/huntersfeeder/data/knowledge.md";
const ALLOWED_ORIGIN = "https://peterlemiha.github.io"; // or "*" while testing
const MODEL          = "gemini-2.5-flash";           // free-tier eligible

/* small in-memory cache so we don't re-fetch knowledge on every message */
let cachedKnowledge = null;
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000; // 5 minutes

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    if (request.method !== "POST")    return cors(json({ error: "POST only" }, 405));

    let body;
    try { body = await request.json(); }
    catch { return cors(json({ error: "invalid JSON" }, 400)); }

    const history = Array.isArray(body.history) ? body.history : [];
    const lang = body.lang || "sl";
    if (history.length === 0) return cors(json({ error: "empty history" }, 400));

    const knowledge = await getKnowledge();
    const systemPrompt = buildSystemPrompt(knowledge, lang);
    const contents = buildContents(history);
    if (contents.length === 0) return cors(json({ error: "no user message" }, 400));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;
    let geminiRes;
    try {
      geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
        })
      });
    } catch (e) {
      return cors(json({ error: "could not reach Gemini" }, 502));
    }

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      return cors(json({ error: "Gemini error", status: geminiRes.status, detail }, 502));
    }

    const data = await geminiRes.json();
    const reply = (data.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || "").join("").trim() || "…";

    return cors(json({ reply }));
  }
};

/* ---------- helpers ---------- */

async function getKnowledge() {
  const now = Date.now();
  if (cachedKnowledge && now - cachedAt < CACHE_MS) return cachedKnowledge;
  try {
    const res = await fetch(KNOWLEDGE_URL, { cf: { cacheTtl: 300 } });
    if (res.ok) {
      cachedKnowledge = await res.text();
      cachedAt = now;
    }
  } catch (e) { /* keep old cache if fetch fails */ }
  return cachedKnowledge || "HuntersFeeder is a smart wildlife feeder for hunters. For details, contact mihapeterlea@gmail.com.";
}

function buildSystemPrompt(knowledge, lang) {
  const names = { sl: "Slovenian", en: "English", hr: "Croatian", it: "Italian", de: "German" };
  const name = names[lang] || "the user's language";
  return `You are the friendly assistant for HuntersFeeder, a smart wildlife feeder for hunters.
Rules:
- Answer ONLY using the product information below. Do not invent specs or features.
- If something isn't covered, say you don't have that detail and suggest emailing mihapeterlea@gmail.com.
- Keep answers short, simple, and warm — the audience is hunters, not engineers.
- Reply in ${name} by default, but if the user clearly writes in another language, match theirs.

=== PRODUCT INFORMATION ===
${knowledge}
=== END PRODUCT INFORMATION ===`;
}

function buildContents(history) {
  // keep only user/bot turns, map to Gemini roles, and make sure it starts with a user turn
  const turns = history.filter(m => m.role === "user" || m.role === "bot");
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: String(m.text || "") }]
  }));
}

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
