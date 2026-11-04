/* ============================================================================
   HuntersFeeder — shared top bar for every page.

   Put it as the FIRST element inside <body>; it inserts the bar right where
   the script tag is, synchronously, so the bar never pops in late:

     <script src="js/topbar.js" data-home="1" data-fixed="1"></script>     (index)
     <script src="../js/topbar.js" data-base="../" data-page="gallery"
             data-select="#lang"></script>                                 (sub-pages)

   data-base    path back to the site root ("" or "../")
   data-home    "1" on the main page: logo instead of the back button
   data-fixed   "1": position:fixed (the main page's hero sits under it);
                otherwise sticky, so sub-page layouts flow below it
   data-page    gallery | app | manual — marks the current menu item
   data-select  the page's own language <select>. It stays the source of truth
                (hidden); picking a flag sets it and fires its "change", so the
                page's existing language code keeps doing all the work.
   data-extra   selector of a link to copy into the top of the menu (the app
                page's "Celozaslonsko"), read fresh each time the menu opens

   On the main page, window.hfSetLang (index.html's applyLang) is called
   instead of a <select>. Either way the flag follows <html lang>.
   ========================================================================= */
(function () {
  var me = document.currentScript;
  var base = me.getAttribute('data-base') || '';
  var home = me.getAttribute('data-home') === '1';
  var page = me.getAttribute('data-page') || (home ? 'home' : '');
  var selSel = me.getAttribute('data-select');
  var extraSel = me.getAttribute('data-extra');
  var LANGS = ['sl', 'en', 'hr', 'it', 'de'];

  var L = {
    sl: { f:'Prednosti', h:'Delovanje', p:'Cena', q:'Vprašanja', c:'Kontakt', g:'Galerija', a:'Aplikacija', m:'Navodila', cta:'Rezerviraj', menu:'Meni', back:'Nazaj na HuntersFeeder', lang:'Jezik' },
    en: { f:'Features', h:'How it works', p:'Price', q:'FAQ', c:'Contact', g:'Gallery', a:'App', m:'Manual', cta:'Reserve', menu:'Menu', back:'Back to HuntersFeeder', lang:'Language' },
    hr: { f:'Prednosti', h:'Kako radi', p:'Cijena', q:'Pitanja', c:'Kontakt', g:'Galerija', a:'Aplikacija', m:'Upute', cta:'Rezerviraj', menu:'Izbornik', back:'Natrag na HuntersFeeder', lang:'Jezik' },
    it: { f:'Vantaggi', h:'Come funziona', p:'Prezzo', q:'Domande', c:'Contatto', g:'Galleria', a:'App', m:'Istruzioni', cta:'Prenota', menu:'Menu', back:'Torna a HuntersFeeder', lang:'Lingua' },
    de: { f:'Vorteile', h:'Funktionsweise', p:'Preis', q:'Fragen', c:'Kontakt', g:'Galerie', a:'App', m:'Anleitung', cta:'Reservieren', menu:'Menü', back:'Zurück zu HuntersFeeder', lang:'Sprache' }
  };

  /* Inline SVG flags, not emoji: Windows has no flag emoji and shows "SI". */
  var FLAGS = {
    sl: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#0057B8"/><rect y="13.33" width="30" height="6.67" fill="#ED1C24"/><path d="M6.6 3.4h6.2v4.8c0 2.2-1.5 3.5-3.1 4.3-1.6-.8-3.1-2.1-3.1-4.3z" fill="#0057B8" stroke="#ED1C24" stroke-width=".7"/><path d="M7.3 9.2l1.3-1.8.8 1 .8-1.7.8 1.7.8-1 1.3 1.8" fill="none" stroke="#fff" stroke-width=".6"/><path d="M8.6 4.9h.01M10.9 4.9h.01M9.7 5.6h.01" stroke="#FFD200" stroke-width=".9" stroke-linecap="round"/></svg>',
    en: '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="7"/></svg>',
    hr: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#FF0000"/><rect y="13.33" width="30" height="6.67" fill="#171796"/><path d="M12.4 5.2h5.2v5.4c0 1.9-1.2 3-2.6 3.6-1.4-.6-2.6-1.7-2.6-3.6z" fill="#fff" stroke="#FF0000" stroke-width=".5"/><path d="M12.4 5.2h1.3v1.3h-1.3zM15 5.2h1.3v1.3H15zM13.7 6.5H15v1.3h-1.3zM16.3 6.5h1.3v1.3h-1.3zM12.4 7.8h1.3v1.3h-1.3zM15 7.8h1.3v1.3H15zM13.7 9.1H15v1.3h-1.3zM16.3 9.1h1.3v1.3h-1.3zM12.4 10.4h1.3v1.3h-1.3zM15 10.4h1.3v1.3H15zM13.7 11.7H15v1.3h-1.3zM16.3 11.7h1.3v1.1l-.6.7h-.7z" fill="#FF0000"/></svg>',
    it: '<svg viewBox="0 0 30 20"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/></svg>',
    de: '<svg viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCE00"/></svg>'
  };
  var NAMES = { sl:'Slovenščina', en:'English', hr:'Hrvatski', it:'Italiano', de:'Deutsch' };

  function ico(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var I = {
    f: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    h: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    p: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
    q: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.3-2.6 3.9M12 17.2h.01"/>',
    c: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    g: '<rect x="3" y="4" width="18" height="16" rx="2.4"/><circle cx="8.6" cy="9.4" r="1.7"/><path d="M3.6 17.6l5.2-5.2 3.4 3.4 2.6-2.6 5.6 5.6"/>',
    a: '<rect x="6" y="2.5" width="12" height="19" rx="2.6"/><path d="M10.4 5.4h3.2M10.9 18.5h2.2"/>',
    m: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v16H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M4 20.5A1.5 1.5 0 0 0 5.5 22H20v-3M8 7h8M8 11h6"/>',
    x: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };
  var home_ = home ? '' : base + 'index.html';
  var ITEMS = [
    ['f', home_ + '#prednosti'], ['h', home_ + '#delovanje'], ['p', home_ + '#cena'],
    ['q', home_ + '#faq'], ['c', home_ + '#kontakt'], null,
    ['g', base + 'galerija/index.html', 'gallery'], ['a', base + 'app/index.html', 'app'],
    ['m', base + 'manual.html', 'manual']
  ];

  /* ---------- markup ---------- */
  var left = home
    ? '<a href="#vrh" class="tb-brand" aria-label="HuntersFeeder"><img src="' + base + 'Slike/logo/hf-wordmark-glow.svg" alt="HuntersFeeder" width="260" height="56"></a>'
    : '<a href="' + base + 'index.html" class="tb-back" data-tb="back">' +
        '<svg class="tb-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>' +
        '<img src="' + base + 'Slike/logo/hf-mark-glow.svg" alt="" width="27" height="34"><span>HuntersFeeder</span></a>';

  var bar = document.createElement('header');
  bar.className = 'tb' + (me.getAttribute('data-fixed') === '1' ? ' tb-fixed' : '');
  bar.id = 'tb';
  bar.innerHTML =
    '<div class="tb-in">' + left +
      '<div class="tb-lang" id="tbLang"><button type="button" id="tbLangBtn" aria-haspopup="listbox" aria-expanded="false" aria-controls="tbList">' +
        '<span class="tb-flag" id="tbFlag"></span>' +
        '<svg class="tb-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button></div>' +
      '<a class="tb-cta" data-tb="cta" href="' + home_ + '#kontakt">Rezerviraj</a>' +
      '<button type="button" class="tb-burger" id="tbBurger" aria-expanded="false" aria-controls="tbMenu"><i></i></button>' +
    '</div>';

  var list = document.createElement('ul');
  list.className = 'tb-list'; list.id = 'tbList'; list.setAttribute('role', 'listbox');
  list.innerHTML = LANGS.map(function (c) {
    return '<li><button type="button" role="option" data-l="' + c + '" title="' + NAMES[c] + '"><span class="tb-flag">' +
      FLAGS[c] + '</span><span>' + c.toUpperCase() + '</span></button></li>';
  }).join('');

  var menu = document.createElement('nav');
  menu.className = 'tb-menu'; menu.id = 'tbMenu';
  menu.innerHTML = (extraSel ? '<a href="#" data-tb="extra">' + ico(I.x) + '<span></span></a><hr>' : '') +
    ITEMS.map(function (it) {
      if (!it) return '<hr>';
      return '<a href="' + it[1] + '"' + (it[2] && it[2] === page ? ' aria-current="page"' : '') + '>' +
        ico(I[it[0]]) + '<span data-tbk="' + it[0] + '"></span></a>';
    }).join('');

  me.parentNode.insertBefore(bar, me);
  document.body.appendChild(list);
  document.body.appendChild(menu);

  var $ = function (id) { return document.getElementById(id); };
  var langBtn = $('tbLangBtn'), burger = $('tbBurger'), inner = bar.firstChild;

  /* ---------- language ---------- */
  function cur() {
    var l = document.documentElement.lang;
    if (LANGS.indexOf(l) === -1) { try { l = localStorage.getItem('hf_lang'); } catch (e) {} }
    return LANGS.indexOf(l) === -1 ? 'sl' : l;
  }
  function paint() {
    var l = cur(), t = L[l];
    $('tbFlag').innerHTML = FLAGS[l];
    langBtn.setAttribute('aria-label', t.lang + ': ' + NAMES[l]);
    list.setAttribute('aria-label', t.lang);
    burger.setAttribute('aria-label', t.menu);
    bar.querySelector('[data-tb="cta"]').textContent = t.cta;
    var b = bar.querySelector('[data-tb="back"]');
    if (b) { b.setAttribute('aria-label', t.back); b.title = t.back; }
    menu.querySelectorAll('[data-tbk]').forEach(function (s) { s.textContent = t[s.getAttribute('data-tbk')]; });
    list.querySelectorAll('button').forEach(function (x) {
      x.setAttribute('aria-selected', x.getAttribute('data-l') === l ? 'true' : 'false');
    });
    fit();
  }
  function choose(l) {
    if (typeof window.hfSetLang === 'function') { window.hfSetLang(l); }
    else {
      var s = selSel && document.querySelector(selSel);
      if (s) { s.value = l; s.dispatchEvent(new Event('change', { bubbles: true })); }
      try { localStorage.setItem('hf_lang', l); } catch (e) {}
    }
    paint();
  }
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  document.addEventListener('hf-lang-change', paint);

  function placeList() {
    var r = langBtn.getBoundingClientRect();
    list.style.top = (r.bottom + 8) + 'px';
    list.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
  }
  function openList(o) {
    if (o) { closeMenu(); placeList(); }
    list.classList.toggle('tb-open', o);
    $('tbLang').classList.toggle('tb-open', o);
    langBtn.setAttribute('aria-expanded', o ? 'true' : 'false');
    if (o) (list.querySelector('[aria-selected="true"]') || list.querySelector('button')).focus();
  }
  langBtn.addEventListener('click', function (e) { e.stopPropagation(); openList(!list.classList.contains('tb-open')); });
  list.addEventListener('click', function (e) {
    var o = e.target.closest('button[data-l]');
    if (!o) return;
    choose(o.getAttribute('data-l'));
    openList(false); langBtn.focus();
  });
  list.addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(list.querySelectorAll('button'));
    var i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  });

  /* ---------- menu ---------- */
  function openMenu(o) {
    if (o) {
      openList(false);
      var ex = menu.querySelector('[data-tb="extra"]'), src = extraSel && document.querySelector(extraSel);
      if (ex && src) { ex.href = src.getAttribute('href'); ex.querySelector('span').textContent = src.textContent.trim(); }
    }
    menu.classList.toggle('tb-open', o);
    burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    if (o) { var a = menu.querySelector('a'); if (a) a.focus({ preventScroll: true }); }
  }
  function closeMenu() { if (menu.classList.contains('tb-open')) openMenu(false); }
  burger.addEventListener('click', function (e) { e.stopPropagation(); openMenu(!menu.classList.contains('tb-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) openMenu(false); });

  document.addEventListener('click', function (e) {
    if (list.classList.contains('tb-open') && !list.contains(e.target)) openList(false);
    if (menu.classList.contains('tb-open') && !menu.contains(e.target)) openMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (list.classList.contains('tb-open')) { openList(false); langBtn.focus(); }
    else if (menu.classList.contains('tb-open')) { openMenu(false); burger.focus(); }
  });
  window.addEventListener('resize', function () { openList(false); fit(); });

  /* ---------- back button: full, or just the logo when it would collide ---------- */
  function fit() {
    if (home) return;
    bar.classList.remove('tb-compact');
    if (inner.scrollWidth > inner.clientWidth + 1) bar.classList.add('tb-compact');
  }

  /* page language select stays, but hidden: the flags drive it */
  function hideSelect() {
    var s = selSel && document.querySelector(selSel);
    if (s) { s.style.display = 'none'; s.setAttribute('aria-hidden', 'true'); s.tabIndex = -1; }
  }

  paint();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { hideSelect(); paint(); });
  else hideSelect();
  window.addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
