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

---

## App preview (`app/`)

The phone icon (bottom-left of the main page) opens `app/index.html`, which frames
the **real HuntersFeeder V3 web app** running on built-in demo data:

- `app/demo-{sl,en,hr,it,de}.html` — generated, never edit by hand. Slovene and
  English come from V3; Croatian, Italian and German from `tools/lang/*.json`
  (English shows for any string V3 adds until it is translated there)
- `tools/demo-extras.js` — added to every build: real clock, today's real dusk,
  real "next feeding" from the schedule
- `app/SOURCE.txt` — which V3 commit they were built from
- `app/index.html` — the frame around them (bezel on desktop, full screen on phones)

To refresh it after the app changes in V3 (builds from V3's last commit):

```
sh tools/update-app-demo.sh ~/HuntersFeeder-V3
```

---

## Development gallery (`galerija/`)

Reached from the "Galerija" nav link, the footer, and the picture (gallery) button above the
phone icon. All content is in **`galerija/data.js`** — one entry per revision with
photos (`galerija/img/<folder>/...`) and YouTube video IDs. The format is
described at the top of that file; the page itself never needs editing.

---

## Bambi (chatbot) and the "Popravi z AI" button — Worker update

`worker/worker.js` now has two modes:

- chat (as before) — the assistant now introduces itself as **Bambi**;
- `mode: "fix"` — used by the contact form's **Popravi z AI** button: fixes the
  capitalisation of the name and polishes the message, returns JSON.

### Worker: automatic deploy

`.github/workflows/deploy-worker.yml` deploys `worker/` to Cloudflare on every push to
`main` that changes it (config: `worker/wrangler.toml`), then sends one test request to
check that it answers. Your `GEMINI_API_KEY` secret in Cloudflare is kept.

One-time setup (two GitHub secrets):
1. Cloudflare → My Profile → API Tokens → Create Token → template
   **Edit Cloudflare Workers** → Account Resources: your account; Zone Resources:
   All zones → Continue → Create Token → copy it (shown once).
2. Cloudflare → Workers & Pages → right column **Account ID** → copy.
3. GitHub repo → Settings → Secrets and variables → Actions → New repository secret:
   `CLOUDFLARE_API_TOKEN` = the token, then `CLOUDFLARE_ACCOUNT_ID` = the ID.
4. GitHub repo → Actions → **Deploy Bambi worker** → Run workflow (green check = live).

Until then the chat keeps working with the old Worker; the form button falls back to
checking the fields only (it says AI help is unavailable).

**Conversation log:** `js/chat.js` mails each Bambi conversation to the Formspree form
in `CONFIG.LOG_URL` (one email per conversation, after 2 minutes of silence or when the
visitor leaves the page). Subject: `Bambi pogovor XXXXXX`. Formspree's free plan allows
50 submissions a month for the form, shared with the contact form; for a separate
inbox/quota create a second Formspree form and put its URL in `CONFIG.LOG_URL`.

### Email notifications (contact form + Bambi chats) via Resend

Both the contact form and every Bambi conversation are sent by the Worker
through [Resend](https://resend.com) — free: 3,000 emails a month, max 100 a day
(Formspree free: 50 a month). If the Worker cannot send (no key, daily cap,
error), the browser falls back to Formspree automatically, so nothing is lost.

One-time setup:
1. Sign up at resend.com **with mihapeterlea@gmail.com** — without your own
   domain, Resend may only send to the address of its own account.
2. Resend → API Keys → Create API Key (permission "Sending access") → copy it.
3. Cloudflare → Workers & Pages → huntersfeeder → Settings → Variables and
   Secrets → Add → Type **Secret**, name `RESEND_API_KEY`, value = the key → Deploy.
4. Optional: plain variable `NOTIFY_TO` if the Resend account uses another address.

Bambi's answers can end with tags such as `[[go:manual]]`; js/chat.js turns them
into buttons that open the burger menu, highlight the item and follow it.

## Domain huntersfeeder.com

Registered at Cloudflare; the site is still served by GitHub Pages.
- `CNAME` (repo root) tells GitHub Pages to serve the site at huntersfeeder.com;
  peterlemiha.github.io/miha-portfolio/… then redirects there (old links and QR codes keep working).
- DNS at Cloudflare, all **DNS only** (grey cloud): apex A 185.199.108–111.153,
  AAAA 2606:50c0:8000–8003::153, `www` CNAME peterlemiha.github.io.
- After the certificate is issued: GitHub → Settings → Pages → tick "Enforce HTTPS".
- Worker accepts calls from huntersfeeder.com, www.huntersfeeder.com and the old github.io
  address (SITE_ORIGINS) and reads knowledge.md from the new domain, with the old one as fallback.
- QR codes for https://huntersfeeder.com: `Slike/qr/` (QR 4-H, 33×33, logo zone 11×13 modules).
