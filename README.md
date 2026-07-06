# HuntersFeeder — website + chatbot + manual

This is your website plus a Gemini-powered chatbot and a manual page.

---

## Folder structure

```
huntersfeeder/                 <- this whole folder = your website (the GitHub repo)
├── index.html                 <- your landing page (you edit it — see "Step 2")
├── manual.html                <- the manual page (ready; add step images later)
├── README.md                  <- this file
│
├── css/
│   └── chat.css               <- chatbot styles (used by both pages)
├── js/
│   └── chat.js                <- chatbot logic (you paste your Worker URL here)
├── data/
│   └── knowledge.md           <- the chatbot's brain (edit this to change what it knows)
│
├── Slike/                     <- your images (you already have most of these)
│   ├── Ozadje.jpeg
│   ├── Slika1.jpeg ... Slika4.jpeg
│   ├── QR.png
│   └── manual/                <- NEW: put step-01.webp, step-02.webp ... here later
│
└── worker/
    └── worker.js              <- NOT part of the website. Deployed to Cloudflare (Step 3).
```

Note: `worker/worker.js` sits in the repo just for safekeeping. It is deployed to
Cloudflare separately and contains NO secret key, so it's safe to keep public.

---

## The 3 phases to go live

### Step 1 — Put the files on GitHub (easiest: the website, no coding)

You already host the site on GitHub, so you're adding files to your existing repo.

Using the GitHub website (no Git install needed):
1. Open your repo on github.com.
2. Click **Add file → Upload files**. Drag in the new files/folders:
   `css/`, `js/`, `data/`, and `manual.html`.
   - To create a folder in GitHub's web editor, use **Add file → Create new file**
     and type the path, e.g. `js/chat.js` — typing the `/` makes the folder.
3. Scroll down, click **Commit changes**.
4. Wait ~1 minute, then refresh your site. `manual.html` is now at
   `https://YOURNAME.github.io/huntersfeeder/manual.html`.

### Step 2 — Add 3 small lines to your existing index.html

Open `index.html` on GitHub (pencil icon to edit) and make these 3 additions:

**(a)** In the `<head>`, near your other `<link>` tags, add:
```html
<link rel="stylesheet" href="css/chat.css" />
```

**(b)** Just before the closing `</body>` tag, after your existing `<script>` block, add:
```html
<script src="js/chat.js"></script>
```

**(c)** (Optional but recommended) Add a link to the manual. For example, inside your
footer, next to the contact info, add:
```html
<a href="manual.html" class="text-[#EBC57E] hover:underline">Priročnik / Manual</a>
```

Commit. The chat button now appears on your home page too.

### Step 3 — Set up the Cloudflare Worker (this is what makes the bot actually answer)

The Worker holds your Gemini key so it never appears in your website.

1. **Get a Gemini API key** (free): go to https://aistudio.google.com → **Get API key**.
   Copy it somewhere safe for a moment. Do NOT paste it into any website file.

2. **Create the Worker:** sign up at https://cloudflare.com (free) →
   dashboard → **Workers & Pages** → **Create** → **Create Worker** →
   give it a name like `huntersfeeder-bot` → **Deploy**.

3. **Paste the code:** click **Edit code**, delete the sample, paste in everything from
   `worker/worker.js`. At the top, edit:
   - `KNOWLEDGE_URL`  → `https://YOURNAME.github.io/huntersfeeder/data/knowledge.md`
   - `ALLOWED_ORIGIN` → `https://YOURNAME.github.io`
   Click **Deploy**.

4. **Add the secret key:** Worker → **Settings** → **Variables and Secrets** →
   **Add** → type name `GEMINI_API_KEY`, paste your key as the value, choose
   **Secret (encrypt)** → Save.

5. **Copy the Worker's address**, e.g. `https://huntersfeeder-bot.yourname.workers.dev`.

6. **Connect the website to it:** edit `js/chat.js`, put that address inside the quotes:
   ```js
   const CONFIG = { WORKER_URL: "https://huntersfeeder-bot.yourname.workers.dev" };
   ```
   Commit. Done — the bot is live.

---

## How to change things later

- **Change what the bot knows:** edit `data/knowledge.md`, commit. (Updates within ~5 min.)
- **Add manual steps:** put `step-06.webp` etc. in `Slike/manual/`, then add a matching
  entry to the `steps` array in `manual.html`, and to Section 6 of `knowledge.md`.
- **Turn the bot off on one page:** remove the `<script src="js/chat.js">` line from that page.

---

## Good to know

- **Free-tier data:** on Gemini's free tier, prompts may be used by Google to improve
  their models. Fine for a public product FAQ; don't send private data through it.
- **EU/EEA terms:** Google's terms say API clients offered to users in the EEA/UK/
  Switzerland should use the paid tier. Paid Flash is extremely cheap (fractions of a
  cent per chat). Worth checking before a full commercial launch.
- **Costs:** GitHub Pages free (site under 1 GB, 100 GB/month traffic), Cloudflare
  Workers free (100,000 requests/day), Gemini free tier (~1,500 chats/day). Plenty
  for a product landing page.
