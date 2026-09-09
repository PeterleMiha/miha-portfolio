/* ============================================================================
   HuntersFeeder template — theming + live-state engine.

   This file drives the dock only. The screens are static HTML: no templating,
   no data binding, no framework. That is deliberate — a design template has to
   survive being pulled apart in a visual editor, and JS-generated markup does
   not (it gets overwritten on the next render).

   What it does:
     1. writes --c1/--c2/--c3 (UI) and --feed (material) onto :root
     2. computes readable text colors for each (--on-cN) from WCAG luminance
     3. drives --level-feed / --level-batt and the state attributes that go
        with them, so the barrel and battery demo their full range
     4. flips light/dark
     5. exports the palette as CSS you can paste into styles.css
   ========================================================================== */

var root = document.documentElement;

/* ---- Preset palettes -------------------------------------------------------
   [primary, secondary, accent, feed]. The first mirrors the firmware default
   in web_assets.h so the template reproduces what the device already ships. */
var PRESETS = [
  { name: "Rust (firmware default)", c: ["#D95F27", "#4E8B3D", "#B58A12", "#8A5A2B"] },
  { name: "Forest",                  c: ["#4E8B3D", "#8A6240", "#B58A12", "#7B5326"] },
  { name: "Bark",                    c: ["#8A6240", "#4E8B3D", "#D95F27", "#6E4A24"] },
  { name: "Amber",                   c: ["#B58A12", "#4E8B3D", "#D95F27", "#8A5A2B"] },
  { name: "Dusk blue",               c: ["#2E6F8E", "#4E8B3D", "#D9A227", "#8A5A2B"] },
  { name: "Blaze",                   c: ["#C8341F", "#3F7D52", "#E0A83A", "#7E4F26"] }
];

/* ---- Thresholds ------------------------------------------------------------
   One place to change what "low" and "empty" mean. The CSS reacts to the
   data-feed / data-batt attributes, so the rules live here, not in the sheet. */
var FEED_LOW = 25, FEED_EMPTY = 8;
var BATT_LOW = 40, BATT_CRIT = 20;

/* ---- Contrast --------------------------------------------------------------
   WCAG relative luminance. Anything lighter than ~0.42 gets dark text on top.
   Without this, a light preset (Amber) puts white text on a pale button and the
   label disappears — the standard failure of any "pick any color" system. */
function luminance(hex) {
  var m = hex.replace("#", "");
  if (m.length === 3) m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2];
  var ch = [0, 2, 4].map(function (i) {
    var v = parseInt(m.substr(i, 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function onColor(hex) { return luminance(hex) > 0.42 ? "#191C13" : "#FFFFFF"; }

/* ---- Color ---------------------------------------------------------------- */
var VARS = ["--c1", "--c2", "--c3", "--feed"];

function setColor(n, hex) {
  root.style.setProperty(VARS[n - 1], hex);
  if (n <= 3) root.style.setProperty("--on-c" + n, onColor(hex));
  var input = document.getElementById("i" + n);
  var label = document.getElementById("v" + n);
  if (input) input.value = hex;
  if (label) label.textContent = hex.toUpperCase();
}

function setPalette(quad) { quad.forEach(function (hex, i) { setColor(i + 1, hex); }); }

/* ---- Live state ----------------------------------------------------------- */
function setFeed(pct) {
  var target = document.getElementById("pOverview");
  root.style.setProperty("--level-feed", (pct / 100).toFixed(3));
  var readout = document.getElementById("vFeed");
  if (readout) readout.textContent = pct + "%";

  var state = pct <= FEED_EMPTY ? "empty" : (pct <= FEED_LOW ? "low" : "ok");
  if (target) target.setAttribute("data-feed", state);

  var pctEl = document.getElementById("feedPct");
  var tagEl = document.getElementById("feedTag");
  var subEl = document.getElementById("feedSub");
  if (pctEl) pctEl.innerHTML = pct + '<span class="u">%</span>';
  if (pctEl) pctEl.style.color = state === "empty" ? "var(--crit)" : "";
  if (subEl) subEl.textContent = "approx. " + Math.round(pct * 0.25) + " more feeds";
  if (tagEl) {
    tagEl.textContent = state === "empty" ? "Empty" : (state === "low" ? "Running low" : "Hopper OK");
    tagEl.className = "tag " + (state === "empty" ? "crit" : (state === "low" ? "warn" : "on"));
  }
}

function setBatt(pct) {
  var target = document.getElementById("pOverview");
  root.style.setProperty("--level-batt", (pct / 100).toFixed(3));
  var readout = document.getElementById("vBatt");
  if (readout) readout.textContent = pct + "%";

  var state = pct <= BATT_CRIT ? "crit" : (pct <= BATT_LOW ? "low" : "ok");
  if (target) target.setAttribute("data-batt", state);

  var pctEl = document.getElementById("battPct");
  var dotEl = document.getElementById("battDot");
  if (pctEl) pctEl.innerHTML = pct + '<span class="u" style="font-size:13px;color:var(--ink-3)">%</span>';
  if (dotEl) dotEl.className = "dot" + (state === "crit" ? " crit" : (state === "low" ? " warn" : ""));
}

/* ---- Theme ---------------------------------------------------------------- */
function setTheme(mode) {
  root.setAttribute("data-theme", mode);
  var lightBtn = document.getElementById("tLight");
  var darkBtn = document.getElementById("tDark");
  if (lightBtn) lightBtn.classList.toggle("on", mode === "light");
  if (darkBtn) darkBtn.classList.toggle("on", mode === "dark");
  /* The developer screens are pinned dark as a spec example — re-assert them. */
  document.querySelectorAll('.phone[data-theme="dark"]').forEach(function (p) {
    p.setAttribute("data-theme", "dark");
  });
}

/* ---- Export --------------------------------------------------------------- */
function paletteCSS() {
  var cs = getComputedStyle(root);
  var g = function (v) { return cs.getPropertyValue(v).trim(); };
  return ":root{\n" +
    "  --c1:" + g("--c1") + ";     /* primary   */\n" +
    "  --c2:" + g("--c2") + ";     /* secondary */\n" +
    "  --c3:" + g("--c3") + ";     /* accent    */\n" +
    "  --feed:" + g("--feed") + ";   /* material  */\n" +
    "  --on-c1:" + onColor(g("--c1")) + "; --on-c2:" + onColor(g("--c2")) +
    "; --on-c3:" + onColor(g("--c3")) + ";\n}";
}

/* ---- Wire up ---------------------------------------------------------------
   Every control is optional. The public build of the page drops the four color
   inputs and the "Copy CSS" export, and a bare getElementById(...).addEventListener
   on a missing id throws — which would take the sliders and the theme switch
   down with it. on() makes an absent control a no-op instead. */
function on(id, ev, fn) {
  var el = document.getElementById(id);
  if (el) el.addEventListener(ev, fn);
  return el;
}

[1, 2, 3, 4].forEach(function (n) {
  on("i" + n, "input", function (e) { setColor(n, e.target.value); });
});

var presetBox = document.getElementById("presets");
if (presetBox) PRESETS.forEach(function (p) {
  var b = document.createElement("button");
  b.className = "preset";
  b.title = p.name;
  b.style.background = "linear-gradient(135deg," + p.c[0] + " 0 34%," + p.c[1] +
    " 34% 58%," + p.c[2] + " 58% 80%," + p.c[3] + " 80% 100%)";
  b.addEventListener("click", function () { setPalette(p.c); });
  presetBox.appendChild(b);
});

on("rFeed", "input", function (e) { setFeed(+e.target.value); });
on("rBatt", "input", function (e) { setBatt(+e.target.value); });
on("tLight", "click", function () { setTheme("light"); });
on("tDark", "click", function () { setTheme("dark"); });

on("copy", "click", function () {
  var btn = this;
  navigator.clipboard.writeText(paletteCSS()).then(function () {
    var was = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(function () { btn.textContent = was; }, 1200);
  });
});

/* ---- Boot ----------------------------------------------------------------- */
setPalette(PRESETS[0].c);
setFeed(72);
setBatt(82);
setTheme("light");
