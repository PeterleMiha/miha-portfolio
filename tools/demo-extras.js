/* ============================================================================
   demo-extras.js - injected into app/demo-*.html by tools/update-app-demo.sh,
   after the V3 bundle. Website only; nothing here reaches the firmware.

   The V3 demo backend (80-mock.js) keeps a fixed countdown and a fixed 20:30
   dusk, and the drawn status bar always says 9:41. On the website the visitor
   should see the app as it would look on their phone right now, so:

     - the status bar shows the real local time, and the device clock in
       Feeding is the real time too (or what the visitor set it to),
     - dusk is today's real civil dusk at the demo position (Ljubljana),
     - "next feeding" is computed from the schedule the visitor has set
       (fixed time or dusk + offset), exactly as the device would,
     - the one hard-coded English demo toast is translated.

   It wraps HF.mock.handle() rather than editing the mock, so a V3 rebuild
   never needs this file changed unless those key names change.
   ========================================================================== */
(function (HF) {
  "use strict";
  if (!HF || !HF.mock || !HF.mock.handle) return;

  var LAT = 46.056946, LON = 14.505751;          /* the demo's GNSS position */
  var RAD = Math.PI / 180;

  /* Civil dusk (sun 6 deg below the horizon, evening) for the UTC calendar day
     containing `ms`. Standard sunrise equation; within a minute or two of the
     almanac, which is all a demo needs. */
  function civilDusk(ms) {
    var jd = Math.floor(ms / 86400000) + 0.5 + 2440587.5;     /* that day, 12:00 UTC */
    var n = Math.ceil(jd - 2451545.0 + 0.0008);
    var js = n - LON / 360;
    var M = (357.5291 + 0.98560028 * js) % 360;
    var C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
    var L = (M + C + 180 + 102.9372) % 360;
    var jt = 2451545.0 + js + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
    var dec = Math.asin(Math.sin(L * RAD) * Math.sin(23.4397 * RAD));
    var cw = (Math.sin(-6 * RAD) - Math.sin(LAT * RAD) * Math.sin(dec)) /
             (Math.cos(LAT * RAD) * Math.cos(dec));
    var w = Math.acos(Math.max(-1, Math.min(1, cw))) / RAD;
    return Math.round((jt + w / 360 - 2440587.5) * 86400);    /* Unix seconds */
  }

  /* The next dusk (+offset) that is still ahead of `now`. */
  function nextDusk(now, offsetMin) {
    for (var d = -1; d <= 2; d++) {
      var t = civilDusk((now + d * 86400) * 1000) + offsetMin * 60;
      if (t > now) return t;
    }
    return now + 86400;
  }

  /* sched.times is "HH:MM[,HH:MM...]" in UTC; the next of them still ahead. */
  function nextFixed(now, times) {
    var best = null;
    String(times || "").split(",").forEach(function (hm) {
      var p = hm.trim().split(":");
      if (p.length < 2) return;
      var day = Math.floor(now / 86400) * 86400;
      var t = day + (+p[0]) * 3600 + (+p[1]) * 60;
      if (t <= now) t += 86400;
      if (best === null || t < best) best = t;
    });
    return best;
  }

  /* Device clock = the visitor's real clock, plus whatever they set by hand in
     Feeding > Device time, so practising that edit works and then keeps
     ticking from the new value. The app's own boot-time set-time call sends
     the phone clock, which leaves the offset at ~0. */
  var offset = 0;

  var orig = HF.mock.handle;
  HF.mock.handle = function (method, path, body) {
    if (method === "POST" && path === "/api/set-time" && body && body.epoch)
      offset = body.epoch - Math.floor(Date.now() / 1000);
    var p = orig.apply(this, arguments);
    if (method !== "GET" || path !== "/api/state") return p;
    return p.then(function (s) {
      if (!s) return s;
      var now = Math.floor(Date.now() / 1000);
      s["time.now"] = now + offset;
      s["dusk.base_at"] = nextDusk(now, 0);
      var at = null;
      if (s["sched.enabled"]) {
        at = s["sched.mode"] === "dusk"
          ? nextDusk(now, s["sched.dusk_offset_min"] || 0)
          : nextFixed(now, s["sched.times"]);
      }
      if (at) {
        s["next.at"] = at;
        s["next.in_s"] = at - now;
        s["next.interval_s"] = 86400;
        s["next.mode"] = s["sched.mode"] === "dusk" ? "dusk" : "fixed";
      } else {
        /* Auto-feed off: the device sends no next.* at all, and the UI shows "-". */
        delete s["next.at"]; delete s["next.in_s"]; delete s["next.interval_s"]; delete s["next.mode"];
      }
      return s;
    });
  };

  /* ---- live status-bar clock ----------------------------------------------- */
  function clock() {
    var el = document.querySelector("#app .statusbar > span:first-child");
    if (!el) return;
    var d = new Date();
    el.textContent = d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  clock();
  setInterval(clock, 1000);

  /* ---- the mock's one hard-coded English string ------------------------------ */
  var DEMO = { sl: "Demo način · brez naprave", en: "Demo mode · no device",
               hr: "Demo način · bez uređaja", it: "Modalità demo · nessun dispositivo",
               de: "Demomodus · kein Gerät" };
  if (HF.util && HF.util.toast) {
    var toast = HF.util.toast;
    HF.util.toast = function (msg) {
      var args = Array.prototype.slice.call(arguments);
      if (msg === "Demo mode · no device" && HF.i18n) args[0] = DEMO[HF.i18n.current()] || msg;
      return toast.apply(this, args);
    };
  }
})(window.HF);
