/* ============================================================================
   Gallery content. This is the ONLY file to edit when adding photos or videos.

   One entry per revision (or milestone), in any order - the page sorts them
   newest first by `date`. Every text field can be a plain string or an object
   per language; a missing language falls back to English, then Slovene.

   {
     date:   "2026-09",                     // "YYYY-MM" or "YYYY-MM-DD"
     tag:    "PCB",                         // short chip: PCB, Ohišje, Test ...
     title:  { sl: "Revizija 3", en: "Revision 3" },
     text:   { sl: "Kaj je novega ...", en: "What changed ..." },
     photos: [
       { src: "img/rev3/pcb-top.jpg", cap: { sl: "Zgornja stran", en: "Top side" } },
       { src: "img/rev3/pcb-bottom.jpg" }   // cap is optional
     ],
     videos: [
       { yt: "VIDEO_ID", cap: { sl: "Test motorja", en: "Motor test" } }
     ]
   }

   Photos: put them in galerija/img/<folder>/ and reference them relative to
   this folder, as above. JPG around 1600 px on the long side keeps the page
   fast; the page lazy-loads them as they scroll into view.
   Videos: `yt` is the ID from the YouTube link - the part after "v=" in
   youtube.com/watch?v=ID, or after the slash in youtu.be/ID. Nothing is loaded
   from YouTube until the visitor presses play.
   ========================================================================== */
window.HF_GALLERY = [
];
