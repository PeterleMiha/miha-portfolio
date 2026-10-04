/* ============================================================================
   Gallery content. This is the ONLY file to edit when adding photos or videos.

   One entry per stage of development. Entries show in the order they are
   written here (newest first). `date` and `tag` are optional: give an entry a
   date ("YYYY-MM" or "YYYY-MM-DD") and the page sorts dated entries newest
   first; leave both out and no date/tag row is shown at all.
   Every text field can be a plain string or an object per language; a
   missing language falls back to English, then Slovene.

   {
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
   itself. Use plain ASCII file names (no č/š/ž or spaces). Add
   fit: "contain"  to a photo that must not be cropped in the grid, such as a
   CAD render; fit: "tall" gives a phone screenshot a tall tile.
   Videos: `yt` is the ID from the YouTube link - the part after "v=" in
   youtube.com/watch?v=ID, or after the slash in youtu.be/ID. Nothing is loaded
   from YouTube until the visitor presses play.
   ========================================================================== */
window.HF_GALLERY = [

  {
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
  },

  {
    title: { sl: "Ohišje", en: "The housing", hr: "Kućište", it: "Il contenitore", de: "Das Gehäuse" },
    text: {
      sl: "Ohišje je natisnjeno iz ASA – materiala, ki je obstojen na UV-svetlobo in odporen na dež, zato zdrži celo leto na prostem. Ni pa namenjeno potapljanju v vodo. Elektronika sedi v ločenem predelu, krma pa teče skozi lijak po sredini.",
      en: "The housing is printed in ASA, a material that resists UV light and rain, so it lasts all year outdoors. It is not made to be submerged in water. The electronics sit in their own compartment while the feed runs through the funnel in the middle.",
      hr: "Kućište je ispisano od ASA – materijala otpornog na UV svjetlost i kišu, pa izdrži cijelu godinu na otvorenom. Nije predviđeno za potapanje u vodu. Elektronika je u zasebnom odjeljku, a hrana prolazi kroz lijevak u sredini.",
      it: "Il contenitore è stampato in ASA, un materiale resistente ai raggi UV e alla pioggia, quindi dura tutto l'anno all'aperto. Non è fatto per essere immerso in acqua. L'elettronica sta in un vano separato, mentre il mangime scorre nell'imbuto centrale.",
      de: "Das Gehäuse wird aus ASA gedruckt, einem UV- und regenbeständigen Material, und hält so das ganze Jahr im Freien. Untertauchen in Wasser verträgt es nicht. Die Elektronik sitzt in einem eigenen Fach, das Futter läuft durch den Trichter in der Mitte."
    },
    photos: [
      { src: "img/OhisjeStranskiPogled.jpg", fit: "contain",
        cap: { sl: "Deli ohišja, stranski pogled", en: "Housing parts, side view", hr: "Dijelovi kućišta, bočni pogled",
               it: "Parti del contenitore, vista laterale", de: "Gehäuseteile, Seitenansicht" } },
      { src: "img/StaroOhisjePrerez.jpg", fit: "contain",
        cap: { sl: "Prerez: lijak za krmo in predal za elektroniko", en: "Cross-section: feed funnel and electronics bay",
               hr: "Presjek: lijevak za hranu i odjeljak za elektroniku", it: "Sezione: imbuto del mangime e vano elettronica",
               de: "Schnitt: Futtertrichter und Elektronikfach" } }
    ]
  },

  {
    title: { sl: "Tipala za krmo", en: "Feed sensors", hr: "Senzori za hranu", it: "Sensori del mangime", de: "Futtersensoren" },
    text: {
      sl: "Majhne ploščice s parom IR oddajnik–sprejemnik. Ko krma prekrije žarek, krmilnica ve, da je v posodi še hrana; ko žarek pride skozi, vam sporoči, da je posoda prazna.",
      en: "Small boards with an IR transmitter–receiver pair. While feed blocks the beam the feeder knows there is food left; once the beam gets through, it tells you the hopper is empty.",
      hr: "Male pločice s parom IR odašiljač–prijemnik. Dok hrana prekriva zraku, hranilica zna da hrane još ima; kad zraka prođe, javlja vam da je spremnik prazan.",
      it: "Piccole schede con una coppia trasmettitore–ricevitore IR. Finché il mangime copre il raggio il distributore sa che c'è ancora cibo; quando il raggio passa, ti avvisa che il serbatoio è vuoto.",
      de: "Kleine Platinen mit einem IR-Sender–Empfänger-Paar. Solange Futter den Strahl verdeckt, weiß der Automat, dass noch Futter da ist; kommt der Strahl durch, meldet er einen leeren Behälter."
    },
    photos: [
      { src: "img/SenzorskaTipalaZaHrano.jpg", fit: "contain",
        cap: { sl: "Panel s 12 pari tipal", en: "A panel of 12 sensor pairs", hr: "Panel s 12 parova senzora",
               it: "Pannello con 12 coppie di sensori", de: "Nutzen mit 12 Sensorpaaren" } }
    ]
  },

  {
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
    title: { sl: "Testni modul", en: "Test module", hr: "Testni modul", it: "Modulo di prova", de: "Testmodul" },
    text: {
      sl: "Vmesni korak pred produkcijo: vse na eni plošči, IR oddajnik in sprejemnik pa na stranskih krilcih, ki se zložita ob steno posode za krmo.",
      en: "A step before production: everything on one board, with the IR transmitter and receiver on side tabs that fold against the wall of the feed hopper.",
      hr: "Korak prije proizvodnje: sve na jednoj pločici, a IR odašiljač i prijemnik na bočnim krilcima koja se preklope uz stijenku spremnika.",
      it: "Un passo prima della produzione: tutto su un'unica scheda, con trasmettitore e ricevitore IR su alette laterali che si piegano contro la parete del serbatoio.",
      de: "Ein Schritt vor der Serie: alles auf einer Platine, IR-Sender und -Empfänger auf seitlichen Laschen, die an die Wand des Futterbehälters geklappt werden."
    },
    photos: [
      { src: "img/StariModulTestni1.jpg", fit: "contain",
        cap: { sl: "Krilci za IR oddajnik in sprejemnik", en: "Tabs for the IR transmitter and receiver",
               hr: "Krilca za IR odašiljač i prijemnik", it: "Alette per trasmettitore e ricevitore IR",
               de: "Laschen für IR-Sender und -Empfänger" } },
      { src: "img/StariModulTestni.jpg", fit: "contain",
        cap: { sl: "Krilci zložena navzdol", en: "Tabs folded down", hr: "Krilca preklopljena prema dolje",
               it: "Alette piegate verso il basso", de: "Laschen nach unten geklappt" } }
    ]
  },

  {
    title: { sl: "Kapacitivno zaznavanje krme", en: "Capacitive feed sensing", hr: "Kapacitivno otkrivanje hrane",
             it: "Rilevamento capacitivo del mangime", de: "Kapazitive Futtererkennung" },
    text: {
      sl: "Ena prvih izvedb je krmo zaznavala brez stika – skozi steno posode, z veliko bakreno ploskvijo na plošči. Ideja je bila elegantna, a tipala z IR žarkom so se izkazala za bolj zanesljiva.",
      en: "One of the first versions sensed the feed without touching it – through the hopper wall, using a large copper pad on the board. Elegant idea, but the IR-beam sensors proved more reliable.",
      hr: "Jedna od prvih izvedbi otkrivala je hranu bez dodira – kroz stijenku spremnika, velikom bakrenom površinom na pločici. Elegantna ideja, ali IR senzori pokazali su se pouzdanijima.",
      it: "Una delle prime versioni rilevava il mangime senza contatto – attraverso la parete del serbatoio, con una grande piazzola di rame sulla scheda. Idea elegante, ma i sensori a raggio IR si sono rivelati più affidabili.",
      de: "Eine der ersten Versionen erkannte das Futter berührungslos – durch die Behälterwand, mit einer großen Kupferfläche auf der Platine. Eine elegante Idee, doch die IR-Strahl-Sensoren erwiesen sich als zuverlässiger."
    },
    photos: [
      { src: "img/KapacitivnoZaznavanje.jpg", fit: "contain",
        cap: { sl: "Spodaj levo: kapacitivna ploskev", en: "Bottom left: the capacitive pad", hr: "Dolje lijevo: kapacitivna površina",
               it: "In basso a sinistra: la piazzola capacitiva", de: "Unten links: die kapazitive Fläche" } }
    ]
  },

  {
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
               de: "SIM7070G auf einer mPCIe-Karte über der ESP32-Platine" } },
      { src: "img/TestiranjeLokacije.jpg",
        cap: { sl: "Test GPS: zaporedni položaji (rumene točke) na satelitski karti", en: "GPS test: successive positions (yellow dots) on a satellite map",
               hr: "Test GPS-a: uzastopni položaji (žute točke) na satelitskoj karti", it: "Test GPS: posizioni successive (punti gialli) su mappa satellitare",
               de: "GPS-Test: aufeinanderfolgende Positionen (gelbe Punkte) auf einer Satellitenkarte" } }
    ]
  },

  {
    title: { sl: "Prva aplikacija", en: "The first app", hr: "Prva aplikacija", it: "La prima app", de: "Die erste App" },
    text: {
      sl: "Že prva različica se je nastavljala s telefonom prek WiFi krmilnice na 192.168.4.1 – brez namestitve. Izbira jezika, pogoji uporabe, čarovnik v treh korakih, nastavitve krmljenja in dodatne telefonske številke. Ob strani še prvi SMS-ukazi. Primerjajte s sedanjo aplikacijo, ki jo lahko preizkusite na tej strani.",
      en: "Even the first version was set up with a phone over the feeder's WiFi at 192.168.4.1 – nothing to install. Language choice, terms of use, a three-step wizard, feeding settings and extra phone numbers. Alongside, the first SMS commands. Compare it with today's app, which you can try on this site.",
      hr: "Već se prva verzija postavljala mobitelom preko WiFi-ja hranilice na 192.168.4.1 – bez instalacije. Odabir jezika, uvjeti korištenja, čarobnjak u tri koraka, postavke hranjenja i dodatni brojevi telefona. Uz to prve SMS naredbe. Usporedite s današnjom aplikacijom koju možete isprobati na ovoj stranici.",
      it: "Già la prima versione si configurava con il telefono tramite il WiFi del distributore su 192.168.4.1 – senza installare nulla. Scelta della lingua, condizioni d'uso, procedura guidata in tre passi, impostazioni di alimentazione e numeri aggiuntivi. Accanto, i primi comandi SMS. Confrontala con l'app di oggi, che puoi provare su questo sito.",
      de: "Schon die erste Version wurde per Handy über das WLAN des Automaten unter 192.168.4.1 eingerichtet – ohne Installation. Sprachwahl, Nutzungsbedingungen, ein Assistent in drei Schritten, Fütterungseinstellungen und weitere Telefonnummern. Daneben die ersten SMS-Befehle. Vergleichen Sie mit der heutigen App, die Sie auf dieser Seite ausprobieren können."
    },
    photos: [
      { src: "img/StaraAplikacija1.jpg", fit: "tall",
        cap: { sl: "Začetni zaslon in izbira jezika", en: "Start screen and language choice", hr: "Početni zaslon i odabir jezika",
               it: "Schermata iniziale e scelta della lingua", de: "Startbildschirm und Sprachwahl" } },
      { src: "img/StaraAplikacija2.jpg", fit: "tall",
        cap: { sl: "Pogoji uporabe", en: "Terms of use", hr: "Uvjeti korištenja", it: "Condizioni d'uso", de: "Nutzungsbedingungen" } },
      { src: "img/StaraAplikacija3.jpg", fit: "tall",
        cap: { sl: "Čarovnik, 1. korak: krmljenje", en: "Wizard, step 1: feeding", hr: "Čarobnjak, 1. korak: hranjenje",
               it: "Procedura guidata, passo 1: alimentazione", de: "Assistent, Schritt 1: Fütterung" } },
      { src: "img/StaraAplikacija4.jpg", fit: "tall",
        cap: { sl: "Nastavitve krmilnika", en: "Feeder settings", hr: "Postavke hranilice",
               it: "Impostazioni del distributore", de: "Einstellungen des Automaten" } },
      { src: "img/StaraAplikacija5.jpg", fit: "tall",
        cap: { sl: "Dodatne telefonske številke", en: "Extra phone numbers", hr: "Dodatni brojevi telefona",
               it: "Numeri di telefono aggiuntivi", de: "Weitere Telefonnummern" } },
      { src: "img/StaraAplikacijaSMS.jpg", fit: "tall",
        cap: { sl: "Prvi SMS-ukazi", en: "The first SMS commands", hr: "Prve SMS naredbe",
               it: "I primi comandi SMS", de: "Die ersten SMS-Befehle" } }
    ]
  },

  {
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
  }

];
