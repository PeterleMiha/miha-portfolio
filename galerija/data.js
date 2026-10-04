/* ============================================================================
   Gallery content. This is the ONLY file to edit when adding photos or videos.

   One entry per revision (or milestone), in any order - the page sorts them
   newest first by `date`. Every text field can be a plain string or an object
   per language; a missing language falls back to English, then Slovene.

   {
     date:   "2026-09",                     // "YYYY-MM" or "YYYY-MM-DD"
     tag:    "PCB",                         // short chip: PCB, Rev 3, Test ...
     title:  { sl: "Revizija 3", en: "Revision 3" },
     text:   { sl: "Kaj je novega ...", en: "What changed ..." },
     photos: [
       { src: "img/pcb-top.jpg", cap: { sl: "Zgornja stran", en: "Top side" } },
       { src: "img/render.jpg", fit: "contain" }   // cap optional; contain = never cropped
     ],
     videos: [
       { yt: "VIDEO_ID", cap: { sl: "Test motorja", en: "Motor test" } }
     ]
   }

   Photos: run
       powershell -ExecutionPolicy Bypass -File tools\gallery-images.ps1 <folder>
   It writes a 1800 px copy to galerija/img/<name>.jpg (opened in the
   lightbox) and a 640 px one to galerija/img/thumbs/<name>.jpg (shown in the
   grid). Reference the big one as "img/<name>.jpg"; the thumbnail is found by
   itself. Add  fit: "contain"  to a photo that must not be cropped in the
   grid, such as a wide CAD render.
   Videos: `yt` is the ID from the YouTube link - the part after "v=" in
   youtube.com/watch?v=ID, or after the slash in youtu.be/ID. Nothing is loaded
   from YouTube until the visitor presses play.
   ========================================================================== */
window.HF_GALLERY = [

  {
    date: "2025-08",
    tag: "Rev 1",
    title: { sl: "Prva generacija", en: "First generation", hr: "Prva generacija",
             it: "Prima generazione", de: "Erste Generation" },
    text: {
      sl: "Prva serija tiskanin: krmiljenje motorja, priključek za baterijo in modul SIM800L za SMS. Baterija je bila razdeljena na dva ločena paketa v 3D-tiskanih ohišjih.",
      en: "The first batch of boards: motor control, a battery connector and a SIM800L module for SMS. The battery was split into two separate packs in 3D-printed housings.",
      hr: "Prva serija pločica: upravljanje motorom, priključak za bateriju i modul SIM800L za SMS. Baterija je bila podijeljena u dva odvojena paketa u 3D-ispisanim kućištima.",
      it: "Il primo lotto di schede: controllo del motore, connettore batteria e modulo SIM800L per gli SMS. La batteria era divisa in due pacchi separati in custodie stampate in 3D.",
      de: "Die erste Serie von Platinen: Motorsteuerung, Akkuanschluss und ein SIM800L-Modul für SMS. Der Akku war auf zwei getrennte Packs in 3D-gedruckten Gehäusen aufgeteilt."
    },
    photos: [
      { src: "img/StaraTiskaninaSIM800L.jpg",
        cap: { sl: "Prve tiskanine z modulom SIM800L", en: "The first boards with the SIM800L module",
               hr: "Prve pločice s modulom SIM800L", it: "Le prime schede con il modulo SIM800L",
               de: "Die ersten Platinen mit dem SIM800L-Modul" } },
      { src: "img/StaraDvaBaterijaksPaketa.jpg",
        cap: { sl: "Stara baterija: dva paketa v 3D-tiskanih ohišjih", en: "The old battery: two packs in 3D-printed housings",
               hr: "Stara baterija: dva paketa u 3D-ispisanim kućištima", it: "La vecchia batteria: due pacchi in custodie stampate in 3D",
               de: "Der alte Akku: zwei Packs in 3D-gedruckten Gehäusen" } }
    ]
  },

  {
    date: "2026-03",
    tag: "Rev 2",
    title: { sl: "Vmesna enota z modemom SIM7070G", en: "Interim unit with the SIM7070G modem",
             hr: "Međujedinica s modemom SIM7070G", it: "Unità intermedia con il modem SIM7070G",
             de: "Zwischenstufe mit dem SIM7070G-Modem" },
    text: {
      sl: "Prehod na modem SIM7070G (LTE-M / NB-IoT in GPS), sprva na zamenljivi kartici mPCIe ob mikrokrmilniku ESP32. Tu so nastali prvi testi lokacije: položaji, ki jih je sporočil modem, preverjeni na satelitski karti.",
      en: "The move to the SIM7070G modem (LTE-M / NB-IoT and GPS), first on a swappable mPCIe card next to the ESP32 microcontroller. This is where the first location tests happened: positions reported by the modem, checked on a satellite map.",
      hr: "Prelazak na modem SIM7070G (LTE-M / NB-IoT i GPS), isprva na zamjenjivoj mPCIe kartici uz mikrokontroler ESP32. Ovdje su nastali prvi testovi lokacije: položaji koje je javio modem, provjereni na satelitskoj karti.",
      it: "Il passaggio al modem SIM7070G (LTE-M / NB-IoT e GPS), prima su una scheda mPCIe sostituibile accanto al microcontrollore ESP32. Qui sono nati i primi test di posizione: le coordinate inviate dal modem, verificate su una mappa satellitare.",
      de: "Der Wechsel zum SIM7070G-Modem (LTE-M / NB-IoT und GPS), zunächst auf einer austauschbaren mPCIe-Karte neben dem ESP32-Mikrocontroller. Hier entstanden die ersten Standorttests: vom Modem gemeldete Positionen, geprüft auf einer Satellitenkarte."
    },
    photos: [
      { src: "img/mPCIE_VmesnaEnota.jpg",
        cap: { sl: "SIM7070G na kartici mPCIe nad ploščo z ESP32", en: "SIM7070G on an mPCIe card above the ESP32 board",
               hr: "SIM7070G na mPCIe kartici iznad pločice s ESP32", it: "SIM7070G su scheda mPCIe sopra la scheda ESP32",
               de: "SIM7070G auf einer mPCIe-Karte über der ESP32-Platine" } }
      /* Held back until the owner confirms (shows the test site on a map):
      { src: "img/TestiranjeLokacije.jpg",
        cap: { sl: "Test GPS: zaporedni položaji na satelitski karti", en: "GPS test: successive positions on a satellite map",
               hr: "Test GPS-a: uzastopni položaji na satelitskoj karti", it: "Test GPS: posizioni successive su mappa satellitare",
               de: "GPS-Test: aufeinanderfolgende Positionen auf einer Satellitenkarte" } } */
    ]
  },

  {
    date: "2026-07",
    tag: "Rev 3",
    title: { sl: "Prva produkcijska enota", en: "First production unit", hr: "Prva proizvodna jedinica",
             it: "Prima unità di produzione", de: "Erste Serieneinheit" },
    text: {
      sl: "ESP32 in SIM7070G sta zdaj na eni plošči, z ločenima antenama za mobilno omrežje in GPS ter režo za SIM. Od načrta do izdelane plošče.",
      en: "The ESP32 and the SIM7070G now sit on one board, with separate antennas for the mobile network and GPS and a SIM slot. From design to finished board.",
      hr: "ESP32 i SIM7070G sada su na jednoj pločici, s odvojenim antenama za mobilnu mrežu i GPS te utorom za SIM. Od nacrta do gotove pločice.",
      it: "ESP32 e SIM7070G ora sono su un'unica scheda, con antenne separate per la rete mobile e il GPS e uno slot SIM. Dal progetto alla scheda finita.",
      de: "ESP32 und SIM7070G sitzen jetzt auf einer Platine, mit getrennten Antennen für Mobilfunk und GPS und einem SIM-Steckplatz. Vom Entwurf zur fertigen Platine."
    },
    photos: [
      { src: "img/PrvaProdukcijskaEnota.jpg",
        cap: { sl: "Sestavljena plošča z antenama za LTE in GPS", en: "The assembled board with LTE and GPS antennas",
               hr: "Sastavljena pločica s antenama za LTE i GPS", it: "La scheda assemblata con antenne LTE e GPS",
               de: "Die bestückte Platine mit LTE- und GPS-Antenne" } },
      { src: "img/3D_ProdukcijskaEnotaCAD.jpg", fit: "contain",
        cap: { sl: "3D-model iste plošče", en: "3D model of the same board", hr: "3D model iste pločice",
               it: "Modello 3D della stessa scheda", de: "3D-Modell derselben Platine" } }
    ]
  },

  {
    date: "2026-09",
    tag: "Rev 3",
    title: { sl: "Nova baterijska enota", en: "New battery unit", hr: "Nova baterijska jedinica",
             it: "Nuova unità batteria", de: "Neue Akkueinheit" },
    text: {
      sl: "Baterija in napajanje v enem kosu namesto dveh ločenih paketov: polnjenje prek USB, varovalke na vsaki veji in napajalni del za motor.",
      en: "Battery and power supply in one piece instead of two separate packs: USB charging, a fuse on every branch and the power stage for the motor.",
      hr: "Baterija i napajanje u jednom komadu umjesto dva odvojena paketa: punjenje preko USB-a, osigurači na svakoj grani i napajanje za motor.",
      it: "Batteria e alimentazione in un unico pezzo invece di due pacchi separati: ricarica via USB, un fusibile su ogni ramo e lo stadio di potenza per il motore.",
      de: "Akku und Stromversorgung in einem Teil statt zwei getrennter Packs: Laden über USB, eine Sicherung in jedem Zweig und die Leistungsstufe für den Motor."
    },
    photos: [
      { src: "img/NovaBaterija.jpg",
        cap: { sl: "Izdelana baterijska enota", en: "The finished battery unit", hr: "Gotova baterijska jedinica",
               it: "L'unità batteria finita", de: "Die fertige Akkueinheit" } },
      { src: "img/3DBaterijaCAD.jpg", fit: "contain",
        cap: { sl: "3D-model baterijske plošče", en: "3D model of the battery board", hr: "3D model baterijske pločice",
               it: "Modello 3D della scheda batteria", de: "3D-Modell der Akkuplatine" } }
    ]
  }

];
