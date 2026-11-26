<!--
  Tehnična baza znanja za Bambija (2. vir, poleg data/knowledge.md).
  Worker jo prebere s spletne strani (predpomnjeno ~5 min), zato sprememba tu
  spremeni Bambijevo znanje v nekaj minutah po mergu.
  DATOTEKA JE JAVNA: nikoli ne vpisuj gesel, PIN-ov, internih ukazov ali podatkov strank.
-->

# HuntersFeeder: baza znanja za pomočnika na spletni strani

*Stanje: 26. 11. 2026 (programska oprema V3, v razvoju). Dokument je namenjen kot kontekst za AI
pomočnika, ki odgovarja kupcem in lovcem. Vsak razdelek je napisan tako, da ga lahko pomočnik bere
samostojno.*

---

## 0. Navodila za pomočnika (preberi najprej)

**Kdo te sprašuje:** lovci, lastniki krmilnikov, kupci in zainteresirani. Večina ni tehnikov.
Sprašujejo, zakaj nekaj ne deluje, kaj naj naredijo in kaj lahko pričakujejo.

**Kako odgovarjaš:**
1. V jeziku vprašanja; privzeto v **slovenščini**. Kratko, s preprostimi besedami, korak za korakom.
   Najprej povej, kaj naj človek naredi, šele nato zakaj.
2. **Pošteno.** HuntersFeeder je v razvoju in prva izdaja je preizkusna (beta, samo Slovenija).
   Če je funkcija v tem dokumentu označena kot »še ni preizkušeno« ali »v razvoju«, to povej.
   Ne obljubljaj datumov, ki jih ta dokument ne navaja.
3. **Ne izmišljuj.** Če odgovora v tem dokumentu ni, reci, da ne veš, in napoti na podporo:
   **kontaktni obrazec na strani (gumb »Rezerviraj« / meni → Kontakt), e-pošta mihapeterlea@gmail.com ali telefon +386 41 435 803**.
4. **Varnost pred vsem:** preden kdo seže v polž ali posodo, mora biti motor ustavljen, roke stran
   od polža. Pri baterijah: ne odpirati, ne prebadati, ne polniti poškodovanih celic.
5. **Zasebnost:** nikoli ne sprašuj za PIN ali PUK kartice SIM, gesla, številke kartic ali
   telefonske številke. Če jih kdo napiše, ga opozori, naj jih ne deli.
6. Ne razkrivaj notranjih podrobnosti razvoja (razvijalska gesla, interni diagnostični ukazi,
   izvorna koda). Za razvijalski način v aplikaciji napoti na podporo.
7. Kodo napake (npr. `E_MOTOR_JAM`) vedno pojasni s človeškimi besedami in povej, kaj narediti.

**Kdaj takoj napotiš na podporo:**
- motor je bil izklopljen zaradi previsoke napetosti (»prenapetost motorja«, več kot enkrat);
- krmilnik se večkrat zapored sam ponovno zažene, čeprav je baterija polna (padci napajanja);
- vidne poškodbe, vlaga v ohišju, vonj po zažganem, napihnjena baterija;
- posodobitev programa večkrat ne uspe ali se krmilnik po njej ne oglasi.

---

## 1. Kaj je HuntersFeeder

HuntersFeeder je **samodejni krmilnik za divjad** za uporabo v gozdu, kjer ni elektrike in ne WiFi.
- Ob nastavljenem času sam strese krmo. Polž poganja električni motor.
- Upravljaš ga **s SMS sporočili** od koderkoli, kjer imaš signal.
- Ko stojiš ob njem, ga upravljaš z **aplikacijo v telefonu**: krmilnik ima svoje WiFi omrežje,
  aplikacija se odpre v brskalniku, internet ni potreben in nič se ne namešča.
- Napaja se iz **baterije** (litij-ionske celice). Večino časa globoko spi, da porabi čim manj.
- Javi se sam, ko je kaj narobe: prazna posoda, prazna baterija, zataknjen polž, morebitna kraja.

**Dve izvedbi:**
- **S SIM modulom** (mobilni modul SIM7070G): SMS ukazi, opozorila, prikaz omrežja, lokacija (GPS).
- **Brez SIM modula** (»samo časovnik«): krmi po urniku, upravlja se samo z aplikacijo ob krmilniku.
  Aplikacija na taki napravi sama skrije vse, kar potrebuje mobilni modul.

**Prva izdaja:** samo za Slovenijo, da je podpora lahko osebna. Širitev v druge države EU je
mogoča kasneje (glej razdelek 21).

---

## 2. Stanje razvoja: kaj je preverjeno in kaj ne

Pošteno: velik del programa je nov in **še ni bil preizkušen na terenu**. Razvoj poteka po korakih.
Vsaka sprememba se najprej preizkusi na mizi, nato na terenu.

| Področje | Stanje |
|---|---|
| Krmljenje po urniku, ročno krmljenje, motor, kalibracija | deluje; izboljšave se še preizkušajo |
| Aplikacija prek WiFi krmilnika | deluje |
| SMS ukazi in odgovori | deluje s kartico **HoT** (omrežje A1); s **Telemach** znane težave, glej 10.6 |
| Samodejna izbira mobilnega omrežja (Cat-M → 2G → NB-IoT) | **nova, še ni preizkušena na terenu** |
| Načini varčevanja (Odzivno / Uravnoteženo / Varčno) | **novo**; koliko omrežje dejansko dovoli, se še meri |
| Lokacija (GPS) | **ne deluje zanesljivo**, zato je privzeto izklopljena; vzrok se išče (razdelek 15) |
| Ocena trajanja baterije v aplikaciji | **ocena**, ne meritev |
| Posodobitev programa iz telefona | deluje |
| Kamera | samo ideja, ni v razvoju |

Če na krmilniku ni najnovejše različice programa, nekatere funkcije iz tega dokumenta morda še
niso na voljo. Rešitev je posodobitev programa (razdelek 17).

---

## 3. Iz česa je sestavljen (laično)

- **Krmilnik (mikroračunalnik ESP32):** možgani. Ima svoje WiFi omrežje za aplikacijo.
- **Mobilni modul SIM7070G:** SMS in prijava v mobilno omrežje; v njem je tudi sprejemnik GPS.
  Pozna samo tri tehnologije: **LTE-M (Cat-M)**, **NB-IoT** in **2G (GSM)**. Navadnega 4G/LTE, ki ga
  uporabljajo telefoni, **ne pozna**, 3G in 5G tudi ne. Zato ima lahko telefon na istem mestu
  odličen signal, krmilnik pa ne.
- **Kartica SIM:** ponudnika izbere uporabnik (razdelek 11).
- **Motor in polž:** motor vrti polž, ki iztresa krmo. Pretvornik dvigne napetost baterije na
  napetost motorja (6–14 V, odvisno od nastavljene hitrosti).
- **Senzor hrane (infrardeči žarek)** na dnu posode: zazna, ali je pred njim hrana. **Ne meri
  količine** (razdelek 7).
- **Baterija:** litij-ionske celice (trenutna izvedba: 4 celice po 3 Ah vzporedno, skupaj ~12 Ah).
  Zgradba se lahko še spremeni.
- **Antene:** za mobilno omrežje in za GPS.

---

## 4. Prvi zagon in nastavitev

1. **Vstavi kartico SIM** (če ima krmilnik mobilni modul) in priključi napajanje.
2. Ob vklopu krmilnik prižge svoje **WiFi omrežje `HuntersFeeder_Setup`**. Na telefonu se poveži
   nanj. Povezati se moraš v približno 3 minutah, sicer se WiFi izklopi, da ne troši baterije.
3. Stran z aplikacijo se večinoma **odpre sama** (samodejni portal). Če se ne, v brskalniku odpri
   **http://192.168.4.1**.
4. Ob prvem odprtju te vodi **čarovnik za nastavitev**:
   - **PIN kartice SIM** (4–8 števk, na embalaži kartice). Če kartica PIN-a nima, ga ni treba vpisati.
   - **Tvoja telefonska številka:** s te številke boš krmilnik upravljal, sem pridejo opozorila.
     Ta številka ima vedno vse pravice.
   - Korak lahko preskočiš; PIN vpišeš pozneje v **Meni → SIM in omrežje**, številko v
     **Meni → Osebni podatki**.
5. Nastavi **urnik krmljenja** v zavihku **Krmljenje** in ga vklopi (samodejno krmljenje je ob
   prvem zagonu **izklopljeno**).
6. Napolni posodo s hrano, tako da hrana pokrije senzor na dnu, in na prvi strani pritisni
   **»Napolnil sod«** (kalibracija senzorja, razdelek 7).
7. V **Meni → Kalibracija** zaženi **kalibracijo motorja** s polno posodo (razdelek 8).

**Ura:** ko odpreš aplikacijo, telefon krmilniku sam nastavi pravo uro.

---

## 5. Aplikacija: stran za stranjo

Aplikacija je v **slovenščini ali angleščini**, ima svetlo in temno temo ter nastavljive barve.
Nastavitve se **shranijo same**, ko spustiš drsnik ali pritisneš stikalo. Če shranjevanje ne uspe,
se pokaže gumb za ponovni poskus.

**Spodnji zavihki:** 🏠 Pregled · 🕒 Krmljenje · 📍 Lokacija (samo, ko je vklopljena) · ☰ Meni.
Med zavihki lahko tudi podrsaš.

### 5.1 🏠 Pregled (prva stran)
- **Količina krme:** sod, senzor nivoja (»Hrana zaznana« / »Hrana ni zaznana« / »ni kalibriran« /
  »napačna referenca«), graf žarka v živo in gumb **»Napolnil sod«**. Barva kartice: zelena = hrana je,
  oranžna = prazno, siva = senzor ne more povedati. Lahko pokaže tudi »pribl. N krmljenj« (ocena).
- **Baterija:** odstotek in dve meritvi napetosti (»Modem« in »Senzor«). Če se meritvi ne ujemata,
  kartica utripa rdeče. To pomeni težavo z meritvijo, ne s prazno baterijo.
- **Signal:** odstotek in črtice, kot na telefonu. Ob črticah piše **tehnologija** (Cat-M, 2G ali
  NB-IoT), **R** pomeni gostovanje. Pod njimi je **ime omrežja**, npr. **»HoT · A1«**: najprej ime
  ponudnika s kartice, nato omrežje, na katerem kartica deluje. Med iskanjem piše
  »🔎 Iščem omrežje (2/3)«. Če kartica SIM ne deluje, kartica to pove in te ob tapu odpelje do nastavitve.
- **Naslednje krmljenje:** ura in odštevanje; tag pove, ali gre za fiksni čas ali zamik od mraka.
  Gumb »Prilagodi« odpre Krmljenje.
- **Krmi zdaj:** ročno krmljenje (s potrditvijo). Med vrtenjem se gumb spremeni v **USTAVI**.

### 5.2 🕒 Krmljenje
- **Samodejno krmljenje** vklop/izklop.
- **Kdaj:** **ob fiksnem času** (tvoj lokalni čas, poletni in zimski čas se upoštevata sama) ali
  **zamik od mraka** (v aplikaciji od 4 ure pred do 4 ure po mraku, npr. 30 min po mraku).
- **Koliko:** čas delovanja motorja v sekundah (privzeto 5 s) in **hitrost motorja** (0–100 %) z gumbom
  »Testiraj 2,5 s«.
- **Čas naprave** in njegov vir, stikalo **Samodejna kalibracija časa** (glej 16).

### 5.3 ☰ Meni
- 🪪 **Moj krmilnik:** 👤 **Osebni podatki** (ime, telefon, geslo za WiFi krmilnika) ·
  📶 **SIM in omrežje** (razdelek 10 in 11).
- 👥 **Več uporabnikov:** **Osebe** (do 6 oseb, pravice, razdelek 13).
- ❓ **Pomoč:** ✉️ **SMS ukazi** (seznam ukazov, primeri odgovorov, opozorila, dnevna omejitev SMS).
- 🛠️ **Naprava:** 🎚️ **Kalibracija** (motor, senzor hrane) · ℹ️ **Sistemski podatki** (različica,
  posodobitev, ponovni zagon, izvoz nastavitev, tovarniška ponastavitev, samodejni portal) ·
  📍 **Lokacija (GPS)**, stikalo (razdelek 15).
- 🔒 **Za razvijalce:** zaščiteno z geslom, za vzdrževanje in podporo.

### 5.4 📍 Lokacija (samo, ko je vklopljena v Meniju)
Iskanje lokacije, zadnja znana pozicija, »Odpri v zemljevidih«, »Nastavi to pozicijo kot dom«,
geoograda (opozorilo o kraji s polmerom) in zgodovina zadnjih pozicij.

### 5.5 Nedejavnost in izklop WiFi
Po **5 minutah brez uporabe** se WiFi izklopi in krmilnik zaspi. Zadnjih 20 sekund to odšteva
zaslon »Naprava je nedejavna«; tap kjerkoli jo podaljša. Gumb **Izklopi** jo ugasne takoj.
Krmljenje po urniku in SMS ukazi delujejo naprej. WiFi spet vklopiš s SMS **VKLOPI** ali tako, da
izklopiš in vklopiš napajanje.

---

## 6. Krmljenje

**Urnik:**
- **Fiksni čas:** vsak dan ob izbrani uri tvojega lokalnega časa (privzeto 18:00). Poletni in zimski
  čas se upoštevata samodejno.
- **Zamik od mraka:** krmilnik izračuna mrak za svojo lokacijo. Brez lokacije GPS uporabi
  **oceno za Slovenijo**, kar je za Slovenijo dovolj natančno.
- **Trajanje** (1–120 s) in **hitrost motorja** določata, koliko krme pade.

**Ročno krmljenje:** »Krmi zdaj« v aplikaciji ali SMS **HRANI** (ali **HRANI 10** za 10 sekund).

**Poročilo po krmljenju (SMS):** ena kratka sporočila z viri (aplikacija, SMS, urnik), zdravjem
motorja, nivojem hrane (ZADOSTI / PRAZNO - dopolni! / NEZNANO) in naslednjim krmljenjem.
Kdo ga dobi, je odvisno od nastavitve opozoril (razdelek 12.5): redna poročila samo pri ravni »Vse«,
pri »Osnovno« le, ko je posoda prazna.

**Zaklep ob prazni posodi:** če senzor **3-krat zapored** po krmljenju pokaže prazno, se
**krmljenje po urniku ustavi**, da motor ne vrti v prazno. Ob vsakem načrtovanem času krmilnik le
preveri senzor in javi »PRESKOCENO / PRAZNO - dopolni!«. Ko zazna hrano (po polnjenju), se zaklep
sam odstrani. Ročno krmljenje (aplikacija, SMS) dela ves čas. Zaklep odstrani tudi
»Napolnil sod«.

**Kdaj krmilnik NE krmi (in zakaj):**
- samodejno krmljenje je izklopljeno (privzeto ob prvem zagonu);
- zaklep ob prazni posodi (zgoraj);
- **motor je blokiran** (razdelek 8);
- **baterija je pod 5 %**: motor se ne vrti, dokler je ne napolniš (razdelek 9);
- med kalibracijo;
- **ura ni znana**: krmilnik krmi po notranjem časovniku, ki ni natančen. Ko dobi uro (iz omrežja
  ali ob odprtju aplikacije), se vrne na nastavljeni čas.

---

## 7. Senzor hrane (koliko krme je)

- Senzor je **infrardeči žarek na dnu posode**. Pove samo **»hrana je pred senzorjem« ali
  »ni«**. **Ne meri količine**, zato aplikacija ne kaže »100 %«, ampak »Hrana zaznana«.
- »Pribl. N krmljenj« je **ocena** iz števila krmljenj, ne meritev.
- **Kalibracija »Napolnil sod«:** najprej napolni posodo, da **hrana pokrije senzor**, šele nato
  pritisni gumb. Meritev brez hrane je neuporabna, zato jo krmilnik zavrne (»Kalibracija zavrnjena …
  Senzor ni pokrit s hrano«).
- **»Napačna referenca«:** referenca je bila izmerjena, ko senzor ni bil pokrit. Tak senzor nikoli
  ne zazna prazne posode. Napolni posodo in znova pritisni »Napolnil sod«.
- **»Ni kalibriran«:** senzorja še nihče ni nastavil.

**Pogosto:** »Posoda je polna, krmilnik pa pravi PRAZNO.« Hrana ne leži na senzorju (obok, sprijeta
ali vlažna krma), senzor je umazan, ali referenca ni prava. Pretresi krmo, očisti okence senzorja
in ponovi »Napolnil sod« s polno posodo.

---

## 8. Motor, polž in kalibracija

**Kalibracija motorja** (Meni → Kalibracija): motor se vrti **približno 10 sekund** in **iztrese
nekaj krme**. Posoda naj bo **polna**, ker se mora motor izmeriti pod pravo obremenitvijo. Krmilnik
si zapomni, kaj je zanj »normalno«, in kasneje po tem prepozna težave. Ponovi jo po zamenjavi
motorja, polža ali vrste krme.

**Stanja motorja:**
- **Deluje normalno.**
- **Šibkeje kot ob nastavitvi:** polž je morda zamašen ali je krma vlažna. Krmljenje še deluje.
- **Ni kalibriran:** brez kalibracije krmilnik ne zazna, če se polž zatakne. Kalibriraj.
- **Motor je blokiran (ZAGOZDENO):** krmljenje je **ustavljeno**. Lastnik dobi SMS:
  »KRITICNO: motor blokiran … Odstrani oviro iz polza in poslji KALIBRIRAJ …«.

**Kako odblokiraš:**
1. **Najprej odstrani oviro iz polža.** Pred tem se prepričaj, da motor stoji; roke stran.
2. Pošlji SMS **KALIBRIRAJ** (ali **ODBLOKIRAJ**, isto) ali v aplikaciji pritisni
   **»Počisti in kalibriraj«**.
3. Motor se zavrti nekaj sekund. Zastavica se počisti **samo, če se motor vrti kot prej**.
   Dobiš en SMS z izidom: uspelo / še vedno blokiran / se ni zavrtel.

**Prenapetost motorja:** če napetost motorja doseže 14,5 V, krmilnik motor **takoj izklopi**, da
pretvornika ne uniči. Ponovi kalibracijo. Če se ponovi, **ne krmi in pokliči podporo**.

**Rdeči ali rumeni »!« v zgornji vrstici aplikacije** opozarja na blokiran, šibek ali nekalibriran
motor. Tap nanj pove, kaj narediti.

---

## 9. Baterija in napajanje

**Meje (pomembno za razumevanje »zakaj ne krmi«):**

| Stanje baterije | Kaj se zgodi |
|---|---|
| **pod 20 %** | opozorilo po SMS, krmljenje še teče |
| **pod 5 %** (~3,06 V v mirovanju) | **motor se ne vrti več** (krmljenje, test, kalibracija). Gumb Krmi je siv. En SMS: »Krmljenje ustavljeno: baterija je prevec prazna … Motor se ne bo vrtel, dokler baterije ne napolnite.« Ponovno se omogoči nad ~3,10 V. |
| **pod 3,0 V** | krmilnik se **sam izklopi**, da baterije ne uniči. Prej pošlje kritičen SMS, če lahko. **Sam se ne zbudi.** Napolni baterijo in izklopi/vklopi napajanje. |

**Padec napajanja (brownout):** če napetost ob zagonu motorja ali oddajanju modema pade prenizko,
se krmilnik ponovno zažene. Pri nizki bateriji nato počiva in baterijo preverja čez 10 min, 1 h in 6 h.
Če se to dogaja **večkrat z dobro baterijo**, gre za težavo strojne opreme, zato pokliči podporo.

**Koliko zdrži baterija:** aplikacija (Meni → SIM in omrežje → Način delovanja) pokaže **oceno** za
vsak način. Ocena **ni meritev**; zanesljive terenske meritve še niso narejene. Največ porabijo:
- **mobilni modul**, odvisno od načina delovanja in omrežja (2G porabi več, ker tam varčevanja ni);
- vsako krmljenje (motor) in vsako bujenje;
- **WiFi in aplikacija**, dokler sta vklopljena (zato se WiFi po 5 min sam izklopi);
- iskanje GPS (do 5 min z vklopljenim sprejemnikom).

**Dve meritvi napetosti** (»Modem« in »Senzor«) merita isto. Če se ne ujemata, je težava v meritvi.

---

## 10. Mobilno omrežje

### 10.1 Katera omrežja krmilnik uporablja
Mobilni modul pozna **LTE-M (Cat-M)**, **NB-IoT** in **2G**. Navadnega 4G/LTE (telefoni), 3G in 5G
**ne**. Zato krmilnik ne vidi vedno istega kot telefon na istem mestu.

| Omrežje | Cat-M (LTE-M) | NB-IoT | 2G | Opomba |
|---|---|---|---|---|
| **A1 Slovenija** | da | da | da | na njem delujejo tudi **HoT**, bob, T-2 |
| **Telekom Slovenije** | da (po vsem omrežju od 2025) | da | da | |
| **Telemach** | **v nobenem viru ni potrjeno** | da | da | glej 10.6 |

Podatki o operaterjih so iz javnih virov in se lahko spremenijo. Pokritost v vašem lovišču je
treba preveriti na kraju samem.

### 10.2 Samodejna izbira (»lestvica«), priporočeno
Krmilnik sam poišče omrežje, na katerem deluje. Poskusi po vrsti, vsakega do 90 sekund:
1. **Cat-M**: najboljši za SMS in baterijo;
2. **2G**: dobro nosi SMS, porabi več;
3. **NB-IoT**: zadnja možnost, ker se lahko poveže, **SMS pa tam morda ne delujejo**.

- Kar deluje, si **zapomni za vsako kartico SIM posebej** in ob naslednjem bujenju začne s tem.
- **Enkrat na dan poskusi boljše omrežje** (do Cat-M), nikoli pa ne preide na NB-IoT samo zaradi
  poskusa.
- Če **SMS na nekem omrežju dvakrat zapored ne uspe zaradi omrežja**, ga za en dan izpusti. Napake,
  ki niso od omrežja (napačna številka, ni dobroimetja), tega ne sprožijo.
- Če ne najde ničesar, prepusti izbiro modulu. Dokler ni omrežja, se krmilnik **vsakih 6 ur zbudi**
  samo zato, da omrežje poišče znova (takrat ne krmi).
- Med iskanjem ostane krmilnik buden največ 6 minut na bujenje.

*Ta del je nov in še ni preizkušen na terenu.*

### 10.3 Ročna izbira (Meni → SIM in omrežje → Napredno)
Možnosti: 🤖 Samodejno (priporočeno) · Samo Cat-M · Samo NB-IoT · Samo 2G. Shrani se šele po potrditvi.
- **Opozorila ob izbiri:**
  - **NB-IoT:** ⚠️ tudi ko se krmilnik uspešno poveže, **SMS sporočila na tem omrežju morda ne
    delujejo**; odvisno od operaterja.
  - **Cat-M:** najboljši, a ga nimajo vsi operaterji (Telemach ga morda nima).
  - **2G:** porabi več baterije (ni varčevanja) in ga operaterji počasi ukinjajo.
- **Pravilo 60 sekund:** če krmilnik izbranega omrežja **ne najde v 60 sekundah**, se izbira
  **sama vrne na Samodejno**. To velja tudi po menjavi kartice in ob izpadu. Aplikacija pokaže:
  »🔁 Ročno izbranega omrežja ni bilo mogoče najti v 60 sekundah, zato sem preklopil na 🤖 Samodejno.«
  (7 dni oziroma do naslednje izbire).

### 10.4 »Krmilnik je bil premaknjen«
Aplikacija pokaže pasico »📍 Krmilnik je bil premaknjen, omrežje se znova izbira samodejno«
(7 dni), ko:
- se ob zagonu zapomnjeno omrežje ne prijavi, **prijavi pa se drugo**; ali
- se na isti tehnologiji javi **drug operater** (ne pri gostovanju); ali
- GPS pokaže premik **za vsaj 2 km**.
Takrat krmilnik pozabi stara omrežja in ročno izbiro vrne na Samodejno. **Noč brez signala ali izpad
operaterja ni premik** in pasice ne sproži. **Menjava kartice SIM ni premik**: stara omrežja se
tiho pozabijo in iskanje začne znova.

### 10.5 Gostovanje (»R«)
»R« ob tehnologiji pomeni, da je kartica prijavljena v tuje omrežje. To je pogosto pri IoT karticah
in pri ponudnikih na tujem omrežju. Plačilo gostovanja ureja vaš ponudnik; v EU velja »gostovanje
kot doma«.

### 10.6 Kartica Telemach
**Znana težava:** s Telemach kartico se je krmilnik dolgo povezoval, nato pa ni delal ne SMS ne
prenos podatkov. Z isto napravo in kartico **HoT** (na omrežju A1) je delovalo.
- **Najverjetnejši vzrok (še ni potrjen):** Telemach v Sloveniji morda nima omrežja Cat-M, starejša
  programska oprema pa je dovolila samo Cat-M in NB-IoT. Na NB-IoT SMS za navadne kartice
  verjetno ni omogočen.
- **Rešitev v razvoju:** nova samodejna izbira omrežja dovoli **2G**, ki ga Telemach še ima in ki
  nosi SMS (razdelek 10.2). **Na terenu še ni preizkušena.**
- Do potrditve je **najvarnejša izbira kartica, ki deluje na omrežju A1** (npr. HoT) ali
  Telekom Slovenije.

### 10.7 Načini delovanja (varčevanje)
Meni → SIM in omrežje → **Način delovanja**:

| Način | SMS pride | Baterija |
|---|---|---|
| ⚡ **Odzivno** | takoj | največja poraba |
| ⚖️ **Uravnoteženo** | z zamikom do ~20 s | srednje |
| 🔋 **Varčno** | z zamikom do ~80 s | najmanjša poraba |

- Varčevanje (eDRX) mora **odobriti omrežje**; aplikacija pokaže, kaj je omrežje dovolilo.
- **Na 2G so vsi trije načini enaki**, tam takega varčevanja ni.
- Ocene trajanja so izračun, ne meritev (razdelek 9).

---

## 11. Kartica SIM

- **Katera kartica:** potrebuje **SMS**; prenos podatkov ni nujen. Deluje na omrežjih z Cat-M, 2G ali
  NB-IoT (razdelek 10). Priporočljivo: kartica na omrežju **A1** (npr. HoT) ali **Telekom Slovenije**.
  Pri Telemachu glej 10.6.
- **Dobroimetje in aktivacija:** kartica mora biti aktivna in imeti dobroimetje. Predplačniške
  kartice po daljšem neuporabljanju lahko potečejo. Vsak SMS, ki ga krmilnik pošlje, plača
  kartica v krmilniku.
- **PIN:** vpišeš ga v aplikaciji (4–8 števk). Krmilnik ga ob zagonu poskusi **samo enkrat**,
  da se kartica ne zaklene s kodo PUK. Napačen PIN popravi v Meni → SIM in omrežje.
- **»Zapomni si PIN«:** potrebno, da se krmilnik po ponovnem zagonu sam vrne v omrežje.
- **PUK:** po treh napačnih PIN-ih se kartica zaklene. Odkleni jo **v telefonu** s kodo PUK,
  nato jo vstavi nazaj.
- **Stanja kartice v aplikaciji:** deluje · čaka na PIN · napačen PIN · zaklenjena s PUK ·
  ni kartice. Opozorilo »Kartica SIM ne deluje« se pokaže samo, ko je res kaj narobe.
- **»Kartica SIM je odklenjena, a se krmilnik ne more prijaviti v omrežje«:** slab signal,
  neaktivna kartica, brez dobroimetja ali omrežje, ki ga modul ne pozna.
- **Brez delujoče kartice:** SMS ne deluje, **krmljenje po urniku deluje naprej**.
- **Tovarniška ponastavitev izbriše tudi PIN.** Krmilnik se brez novega vpisa PIN-a ne vrne v omrežje.
- Podatki (PIN, številke) so shranjeni **samo na napravi**.

---

## 12. SMS

### 12.1 Kako pošlješ ukaz
- Ukaz pošlji na **številko kartice SIM v krmilniku**: z lastnikove številke ali s številke osebe s
  **polnim nadzorom**.
- Velikost črk ni pomembna. Delujejo slovenski in angleški ukazi.
- **Piši brez šumnikov** (IZBRISI, POMOC). Tudi odgovori so brez šumnikov, ker modem uporablja
  osnovni nabor znakov SMS.
- Odgovori so v **jeziku naprave** (privzeto slovenščina), ne glede na to, ali si ukaz napisal
  slovensko ali angleško.

### 12.2 Seznam ukazov

| Ukaz (SI) | Ukaz (EN) | Kaj naredi | Kdo sme |
|---|---|---|---|
| `POMOC` | `HELP` | seznam ukazov (en SMS) | lastnik, polni nadzor |
| `NAVODILA` | `INSTRUCTIONS` | podroben opis ukazov (več SMS) | lastnik, polni nadzor |
| `INFO` / `INFORMACIJE` | `INFO` | en SMS: baterija, signal, hrana (senzor), samodejno krmljenje (naslednje / zadnje), motor, ura; najprej izmeri sveže vrednosti | lastnik, polni nadzor |
| `HRANI` | `FEED` | nahrani zdaj za shranjeno trajanje | lastnik, polni nadzor |
| `HRANI X` | `FEED X` | nahrani zdaj za X sekund (1–120) | lastnik, polni nadzor |
| `AON` / `AOFF` | `AON` / `AOFF` | vklopi / izklopi samodejno krmljenje | lastnik, polni nadzor |
| `TRAJANJE X` | `DURATION X` | shranjeno trajanje krmljenja (1–120 s) | lastnik, polni nadzor |
| `UPORABNIKI` | `USERS` | seznam oseb | lastnik, polni nadzor |
| `DODAJ Ime Telefon` | `ADD Name Phone` | doda osebo (prejema opozorila) | lastnik, polni nadzor |
| `IZBRISI X` | `DELETE X` | odstrani osebo številka X s seznama | lastnik, polni nadzor |
| `PRAVICE X FULL` / `PRAVICE X BASIC` | `RIGHTS X FULL/BASIC` | polni nadzor ali samo prejema | **samo lastnik** |
| `VKLOPI` / `IZKLOPI` | `ON` / `OFF` | vklopi / izklopi WiFi krmilnika za aplikacijo | lastnik, polni nadzor |
| `LOKACIJA` | `LOCATION` | lokacija kot povezava na zemljevid; brez shranjene jo poišče (do 5 min, medtem brez SMS) | lastnik, polni nadzor |
| `DOMOV` | `SETHOME` | trenutno lokacijo shrani kot dom | lastnik, polni nadzor |
| `KALIBRIRAJ` (ali `ODBLOKIRAJ`) | `CALIBRATE` (ali `CLEARJAM`) | preveri in odblokira motor; en SMS z izidom | lastnik, polni nadzor |
| `PONASTAVI` | `RESETSMS` | ponastavi današnji števec SMS (dnevna omejitev) | **samo lastnik** |

Neznan ukaz dobi odgovor: »Neznan ukaz. Poslji POMOC za seznam ukazov.«

### 12.3 Kdo sme ukazovati
- **Lastnik** (številka v Osebnih podatkih): vse.
- **Oseba s polnim nadzorom:** vse razen PRAVICE in PONASTAVI.
- **Oseba »samo prejema«:** samo prejema opozorila. **Ukazi te osebe se ne izvedejo in ona ne
  dobi odgovora**; ukaz se posreduje lastniku in osebam s polnim nadzorom.
- **Neznana številka:** krmilnik se ji **ne odzove**. Sporočilo posreduje lastniku in osebam s
  polnim nadzorom, če je vklopljena raven opozoril »Razširjeno« ali »Vse«. Neznana številka
  nikoli ne more zagnati motorja.

### 12.4 Kdaj pride odgovor
- Krmilnik večinoma **spi**; SMS ga zbudi. Odgovor pride običajno v nekaj sekundah do minute.
- V načinu **Uravnoteženo** ali **Varčno** lahko SMS do krmilnika zamudi do ~20 oz. ~80 sekund
  (razdelek 10.7).
- Med **krmljenjem** krmilnik prebere SMS šele, ko se motor ustavi. Odgovor na HRANI pride, ko je
  krmljenje končano.
- Med **iskanjem GPS** (do 5 min) je mobilno omrežje izklopljeno: SMS ne prihajajo in ne odhajajo.
  Pošljejo se, ko je omrežje spet nazaj.
- Brez omrežja SMS čaka v vrsti nekaj minut (kritični dlje), nato se zavrže.
- **INFO** najprej sveže izmeri baterijo, signal in senzor, zato odgovor pride sekundo ali dve kasneje.

### 12.5 Opozorila: kdo dobi kaj
Raven opozoril se nastavi posebej **zase (lastnik)** in **za ostale osebe** (Meni → SMS ukazi):
**Izklop · Osnovno (privzeto) · Razširjeno · Vse**.

| Sporočilo | Lastnik | Ostale osebe |
|---|---|---|
| Baterija prazna, motor blokiran, kraja (geoograda) | Osnovno+ | Osnovno+ (zastoj motorja dobi samo lastnik) |
| Baterija pod 20 % | Osnovno+ | Osnovno+ |
| Posoda prazna (poročilo), preskočeno krmljenje | Osnovno+ | Osnovno+ |
| Napaka ure | Osnovno+ | ne |
| Neznana številka / sporočila operaterja (posredovanje) | Razširjeno+ | samo polni nadzor, Razširjeno+ |
| Oseba »samo prejema« je poskusila ukaz | Osnovno+ | polni nadzor |
| Vsako redno krmljenje (poročilo) | Vse | Vse |
| Souporabnik je vprašal za lokacijo | Vse | ne |
| Dnevna omejitev SMS (80 %, 100 %) | vedno | ne |
| Odgovori na ukaze | pošiljatelju | pošiljatelju |

»Izklop« pomeni res nič. Krmilnik ti ne bo pisal niti, ko bo prazen. Napake se vseeno shranijo
in se vidijo v aplikaciji.

### 12.6 Dnevna omejitev SMS
Da ena napaka ali tuja številka ne bi porabila dobroimetja, ima krmilnik **dnevno omejitev SMS**
(privzeto **30**, nastavljivo 5–50, Meni → SMS ukazi).
- Šteje, kar krmilnik pošlje sam: opozorila, poročila, posredovanja.
- **Odgovori na tvoje ukaze se ne štejejo in se nikoli ne ustavijo.**
- Pri 80 % dobiš SMS. Ob omejitvi se **poročila in posredovanja ustavijo do polnoči**; kritična
  opozorila in odgovori gredo še vedno.
- **PONASTAVI** (samo lastnik) števec ponastavi.

### 12.7 Opozorilo o uri
Če ura krmilnika zaostaja za časom SMS sporočil za 2 uri ali več, dobi lastnik največ enkrat na dan
SMS »Ura naprave je zaostajala …«. Manjša odstopanja (do 30 min) krmilnik popravi tiho.

---

## 13. Osebe in pravice

- Do **6 oseb** poleg lastnika (Meni → Osebe ali SMS DODAJ).
- Vsaka oseba ima ime, telefonsko številko (privzeto Slovenija +386; tuje številke delujejo) in
  pravico:
  - **Samo prejema:** dobiva opozorila; ukazov ne more pošiljati.
  - **Polni nadzor:** dobiva opozorila in krmilnik upravlja s SMS (krmljenje, urnik, osebe).
- Nova oseba, dodana s SMS, ima privzeto »samo prejema«. Pravice spremeni lastnik
  (PRAVICE ali aplikacija).
- Pravice veljajo za SMS. **Kdor je povezan na WiFi krmilnika, lahko v aplikaciji naredi vse**,
  zato zaščiti WiFi z geslom (razdelek 14).
- Ista številka ne more biti na seznamu dvakrat.

---

## 14. WiFi krmilnika in aplikacija

- Ime omrežja: **`HuntersFeeder_Setup`**. Naslov aplikacije: **http://192.168.4.1**.
- **Kdaj je WiFi vklopljen:** ob vklopu napajanja in po SMS **VKLOPI**. Če se nihče ne poveže v
  ~3 minutah, ali po **5 minutah brez uporabe**, se izklopi. SMS **IZKLOPI** ga izklopi takoj.
- **Doseg** je kot pri navadnem WiFi: biti moraš blizu krmilnika (nekaj deset metrov, manj skozi
  ovire).
- **Geslo:** privzeto je omrežje **odprto**. V Meni → Osebni podatki nastaviš geslo (8–32 znakov).
  Uporabi se ob **naslednjem** vklopu WiFi, ne takoj. **Priporočamo geslo**, ker ima vsak, ki je
  povezan, v aplikaciji polni nadzor.
- **Samodejni portal:** stran se po povezavi odpre sama. Če telefon noče ostati povezan
  (javlja »ni interneta« in prekine), v Meni → Sistemski podatki izklopi **Samodejni portal** in
  ročno odpri 192.168.4.1.

**Pogoste težave:**
- *Ne vidim omrežja HuntersFeeder_Setup.* WiFi je izklopljen (spi). Pošlji SMS **VKLOPI** ali
  izklopi in vklopi napajanje. Počakaj nekaj sekund.
- *Povezan sem, stran se ne odpre.* V brskalniku vpiši **http://192.168.4.1**. Na nekaterih
  telefonih izklopi mobilne podatke, da telefon ne išče interneta mimo krmilnika.
- *Telefon se sam prekine.* Izklopi Samodejni portal (zgoraj) ali v telefonu izberi »ostani
  povezan« oz. »uporabi to omrežje brez interneta«.
- *Pozabil sem geslo za WiFi.* Tovarniška ponastavitev (izbriše vse nastavitve, tudi PIN) ali
  podpora. Brez povezave do aplikacije se geslo ne da spremeniti.

---

## 15. Lokacija (GPS) in opozorilo o kraji

**Kje se vklopi:** Meni → 🛠️ Naprava → **📍 Lokacija (GPS)**. Privzeto je **izklopljena**. Ko jo
vklopiš, se spodaj pojavi zavihek **📍 Lokacija**, ob izklopu izgine.

**Kaj pomeni vklop:** stikalo ne prižge sprejemnika takoj. GPS se prižge **samo, ko je iskanje
zahtevano**:
- tap na »Tapni za iskanje lokacije« (zavihek Lokacija);
- SMS **LOKACIJA** (ko lokacije še ni) ali **DOMOV**;
- po krmljenju, **če je vklopljeno opozorilo o kraji**.

**Med iskanjem (do 5 min) mobilno omrežje ne deluje**: GPS in mobilno omrežje si v modulu delita
radijski del. SMS takrat ne prihajajo in ne odhajajo; zadržana sporočila (npr. odgovor na LOKACIJA,
opozorilo o kraji) gredo, ko je omrežje nazaj.

**Opozorilo o kraji (geoograda):** v zavihku Lokacija nastaviš polmer (10–2000 m). Če je nova
lokacija dlje od zadnje shranjene, pride SMS »OPOZORILO: naprava premaknjena!« s koordinatami
(največ enkrat na 24 h). Kdo ga dobi, določa raven opozoril (12.5).

**Trenutno stanje (pošteno):** lokacija **še ne deluje zanesljivo**. Modul na ukaz za vklop GPS
odgovori »v redu«, sprejemnik pa se ne zažene. Zato je funkcija privzeto izklopljena: brez
koristi samo troši baterijo. Vzrok se išče s preizkusi na mizi. Ko bo znan, bo popravek v posodobitvi
programa. Do takrat:
- mrak za urnik se računa po **oceni za Slovenijo**, kar zadošča;
- »LOKACIJA« vrne zadnjo shranjeno lokacijo, če jo krmilnik ima; sicer pove, da je ni mogel določiti.

---

## 16. Ura in čas

Krmilnik potrebuje pravo uro za urnik. Viri ure, od najbolj zaupanja vrednega:
1. **telefon ob odprtju aplikacije** (nastavi se samo);
2. GPS (ko deluje);
3. **mobilno omrežje** (NITZ; ne pošiljajo ga vsi operaterji v vseh primerih);
4. čas prejetega SMS (»Samodejna kalibracija časa« v Krmljenju).

- Poletni in zimski čas se upoštevata samodejno (srednjeevropski čas).
- Dokler ure ni, aplikacija pokaže »Ura še ni nastavljena, prikazan je preostali čas«.
- Krmilnik zavrne **sumljive skoke ure** (več kot 3 dni) in o tem obvesti lastnika. Rešitev: odpri
  aplikacijo, telefon nastavi pravo uro.
- Notranja ura med spanjem ni povsem natančna. Krmilnik si zapomni, za koliko odstopa, in se
  zbudi malo prej, da krmi ob pravem času.

---

## 17. Posodobitev programa

1. Datoteko za posodobitev (**.hfu**) dobiš od razvijalca (pišite prek kontaktnega obrazca ali na
   mihapeterlea@gmail.com). Javne povezave za prenos zaenkrat ni. Shrani jo na telefon.
2. Poveži se na WiFi krmilnika → Meni → Sistemski podatki → **Posodobi program** → izberi datoteko.
3. Traja približno minuto. **Ne zapiraj strani in ostani blizu krmilnika.** Nato se krmilnik sam
   ponovno zažene (~20 s); WiFi za trenutek izgine, poveži se znova.

**Krmilnik datoteko preveri, preden jo namesti.** Če karkoli ni v redu, **program ostane
nespremenjen**:

| Sporočilo | Pomen in rešitev |
|---|---|
| To ni datoteka za posodobitev (.hfu) | izbral si napačno datoteko |
| Motor teče | počakaj, da se ustavi |
| Baterija je prešibka | najprej napolni baterijo |
| Datoteka ni uradna ali je poškodovana | prosi razvijalca za novo kopijo |
| Ta datoteka ni za ta krmilnik | napačna različica za tvojo napravo |
| Datoteka ni prišla cela / povezava se je prekinila | poskusi znova, bližje krmilniku |
| To različico krmilnik že ima | posodobitev ni potrebna |

Če se izbira datoteke ne odpre, odpri 192.168.4.1 v Safariju ali Chromu (ne v vgrajenem oknu portala).

---

## 18. Spanje, bujenje in dosegljivost

- Krmilnik večino časa **globoko spi**; mobilni modul ostane prijavljen v omrežje, da lahko sprejme SMS.
- **Zbudi ga:** prejet SMS, čas krmljenja, vklop napajanja, ob iskanju omrežja vsakih 6 ur
  (samo če ni omrežja) in počitek po padcu napajanja.
- Po opravilu (krmljenje, odgovor) spet zaspi. Ko je odprta aplikacija, ostane buden, dokler je v uporabi.
- Krmilnik **nikoli ne zaspi, ne ugasne in se ne zažene znova, medtem ko se vrti motor.**

---

## 19. Kode napak (s človeškimi besedami)

Napake se shranjujejo v krmilniku; podpora jih vidi v aplikaciji. Kar mora vedeti lastnik:

| Koda | Kaj pomeni | Kaj narediti |
|---|---|---|
| `E_MODEM_TIMEOUT` | modul se ni pravočasno odzval | posamični so normalni; če se ponavljajo, podpora |
| `E_MODEM_DEAD` | mobilni modul se ni oglasil; krmilnik dela kot časovnik | preveri modul in napajanje; po popravilu ga krmilnik sam najde |
| `E_SMS_SEND_FAIL` | SMS ni bil poslan | signal, dobroimetje, številka prejemnika |
| `E_SMS_PARSE` | prejetega SMS ni bilo mogoče prebrati | redko; če se ponavlja, podpora |
| `E_SIM_PIN_FAIL` | kartica po vnosu PIN-a ni pripravljena | popravi PIN v aplikaciji (krmilnik ga ne poskuša znova, da se kartica ne zaklene) |
| `E_MOTOR_JAM` | polž je zagozden, krmljenje ustavljeno | odstrani oviro, nato KALIBRIRAJ ali »Počisti in kalibriraj« |
| `E_MOTOR_WEAK` | motor slabi ali kalibracija ni uspela | preveri baterijo in polž, ponovi kalibracijo |
| `E_BAT_LOW` | baterija pod 20 % | napolni ali zamenjaj baterijo |
| `E_BAT_CRITICAL` | baterija prazna, krmilnik se je izklopil | napolni in izklopi/vklopi napajanje |
| `E_NVS_FAIL` | shranjene nastavitve so bile poškodovane | preveri nastavitve v aplikaciji |
| `E_GNSS_TIMEOUT` | iskanje lokacije ni uspelo | znana težava, glej 15 |
| `E_GEOFENCE_MOVED` | krmilnik se je premaknil iz geoograde | preveri krmilnik (možna kraja) |
| `E_WEB_AUTH_FAIL` | napačno geslo za razvijalski način | če nisi bil ti, obvesti podporo |
| `E_FREEZE_RESET` | program je zastal in se je sam ponovno zagnal | če se ponavlja, podpora |
| `E_CLOCK_SKEW` | ura je zaostajala ≥ 2 h | preveri signal; odpri aplikacijo |
| `E_CLOCK_BAD` | omrežje ni poslalo časa | odpri aplikacijo, telefon nastavi uro |
| `E_NET_TIME_FAIL` | ura prek podatkov ni uspela | običajno ni podatkovnega paketa; ni nujno |
| `E_CLOCK_JUMP` | sumljiv skok ure je bil zavrnjen | odpri aplikacijo |
| `E_OTA_FAIL` | posodobitev zavrnjena, program nespremenjen | glej tabelo v 17 |
| `E_MOTOR_OVERVOLT` | napetost motorja previsoka, motor izklopljen | ponovi kalibracijo; če se ponovi, ne krmi in pokliči podporo |
| `E_BROWNOUT` | napajanje je padlo, krmilnik se je ponovno zagnal | pri nizki bateriji napolni; z dobro baterijo večkrat = podpora |
| `E_POWER_LOSS` | napajanje se je sesedlo med vrtenjem motorja | strojna težava, podpora |

---

## 20. Pogosta vprašanja in odpravljanje težav

### SMS in omrežje

**Pošljem SMS, krmilnik ne odgovori.**
1. Ali pošiljaš s pravo številke? Odgovarja samo lastniku in osebam s **polnim nadzorom**. Oseba
   »samo prejema« in neznane številke odgovora ne dobijo (12.3).
2. Ali je ukaz pravilen in brez šumnikov? Poskusi **INFO**.
3. Počakaj do 1–2 minuti: krmilnik morda krmi, išče GPS ali je v varčnem načinu (12.4).
4. Ali kartica deluje? Odpri aplikacijo ob krmilniku: kartica Signal na prvi strani pokaže stanje
   kartice in omrežje.
5. Dobroimetje in aktivnost kartice; dosežena dnevna omejitev SMS (odgovori se sicer vedno pošljejo).
6. Kartica Telemach: glej 10.6.

**Na prvi strani piše NB-IoT, SMS pa ne delujejo.**
To je znan pojav: NB-IoT se lahko poveže, SMS pa na njem pri nekaterih operaterjih ne deluje.
V Meni → SIM in omrežje izberi **Samodejno**; samodejna izbira ima NB-IoT kot zadnjo možnost in po
dveh neuspelih SMS na omrežju to omrežje za en dan izpusti. Če je NB-IoT izbran ročno, izberi
Cat-M ali 2G ali Samodejno.

**Ročno sem izbral omrežje, zdaj pa piše Samodejno.**
Izbranega omrežja krmilnik ni našel v 60 sekundah, zato se je sam vrnil na Samodejno (10.3).
To je namerno, da krmilnik ne ostane brez omrežja.

**Pasica »Krmilnik je bil premaknjen«, čeprav ga nisem premaknil.**
Pomeni, da zapomnjeno omrežje na tem mestu ni več delovalo, delovalo pa je drugo (ali drug
operater). Krmilnik je omrežje izbral znova. Nič ni treba narediti; pasica izgine po 7 dneh.

**Telefon ima signal, krmilnik pa ne.**
Telefon uporablja 4G/5G, krmilnik pa samo Cat-M, NB-IoT in 2G (10.1). Pokritost teh je lahko
drugačna. Poskusi kartico drugega operaterja ali premakni krmilnik oz. anteno.

**Signal je nizek (1 črtica).**
Krmilnik še deluje, a SMS lahko zamujajo ali ne uspejo. Pomaga višja lega antene, manj ovir
(kovina, gost gozd, teren) ali drug operater.

**Kaj pomeni »R« ob tehnologiji?** Gostovanje (10.5).

**Kaj pomeni »HoT · A1«?** HoT je ponudnik kartice, A1 je omrežje, na katerem kartica deluje.
Tako kot na telefonu.

**Zakaj so odgovori brez šumnikov?** Modem uporablja osnovni nabor znakov SMS. Podpora šumnikom
je v načrtu.

### Krmljenje

**Krmilnik ni krmil ob nastavljeni uri.** Preveri po vrsti: samodejno krmljenje vklopljeno?
Baterija nad 5 %? Motor ni blokiran? Ni zaklepa prazne posode? Ali ima krmilnik uro (prva stran)?
(6, »Kdaj krmilnik NE krmi«)

**Krmi ob napačni uri.** Ura ni bila prava ali je bil izbran zamik od mraka. Odpri aplikacijo
(nastavi uro) in preveri nastavitev v Krmljenju.

**Pade premalo ali preveč krme.** Spremeni trajanje (sekunde) ali hitrost motorja v Krmljenju;
preizkusi z »Testiraj 2,5 s«. Vlažna ali sprijeta krma pada slabše.

**Piše PRAZNO, posoda pa je polna.** Glej 7.

**Krmilnik ne krmi več po urniku in pošilja »PRESKOCENO, PRAZNO - dopolni!«.**
Zaklep ob prazni posodi (6). Napolni posodo; ob naslednjem času se odklene sam, ali pritisni
»Napolnil sod«.

### Motor

**Prišel je SMS »motor blokiran«.** Glej 8: odstrani oviro, nato KALIBRIRAJ.

**Po KALIBRIRAJ je motor še vedno blokiran.** Ovira je še tam ali je motor/polž poškodovan.
Preveri polž (motor naj stoji), nato poskusi znova. Če se ponavlja, podpora.

**Motor je »šibek«.** Zamašen polž, vlažna krma ali nizka baterija. Očisti, napolni, ponovi kalibracijo.

### Baterija

**Gumb »Krmi zdaj« je siv.** Baterija je pod 5 %; motor se ne bo vrtel, dokler je ne napolniš (9).

**Krmilnik se ne oglaša več (ne SMS ne WiFi).** Najverjetneje se je izklopil zaradi prazne baterije
(pod 3,0 V). Sam se ne zbudi: napolni baterijo, izklopi in vklopi napajanje.

**Baterija se hitro prazni.** Velikokrat odprta aplikacija ali WiFi, način Odzivno, 2G omrežje,
pogosto iskanje GPS ali slab signal (modul več išče). Poskusi način Uravnoteženo ali Varčno
(10.7), izklopi Lokacijo (GPS), če je ne potrebuješ.

**Kartica Baterija utripa rdeče.** Dve meritvi napetosti se ne ujemata; to je težava meritve, ne
prazne baterije. Če traja, podpora.

### WiFi in aplikacija
Glej 14 (»Pogoste težave«).

**Zavihka Lokacija ni več.** Lokacija je zdaj stikalo v Meni → Naprava → Lokacija (GPS). Ko jo vklopiš,
se zavihek pojavi (15).

**Aplikacija se je sama osvežila.** Krmilnik ima novejšo različico aplikacije, kot jo je imel
telefon v spominu; osvežitev jo uskladi.

### Lokacija
**Lokacija ne najde položaja.** Znana težava (15). Funkcija je preizkusna; popravek bo v posodobitvi.

**Med iskanjem lokacije ni SMS.** Tako je narejeno: GPS in mobilno omrežje si delita radio (15).

---

## 21. Kaj lahko pričakujemo (načrti)

Brez obljubljenih datumov. Vrstni red se lahko spremeni.
- **Terenski preizkus** nove samodejne izbire omrežja (Cat-M → 2G → NB-IoT), posebej s
  karticami Telemach in HoT, in meritve, katero omrežje v Sloveniji zanesljivo nosi SMS.
- **Meritve porabe** v načinih Odzivno / Uravnoteženo / Varčno, nato natančnejše ocene trajanja baterije.
- **Popravek lokacije (GPS)** po preizkusih na mizi; nato vklop opozorila o kraji kot zanesljive funkcije.
- **Šumniki v SMS** (č, š, ž).
- **Zgodovina SMS** in zaščita pred vsiljenimi sporočili (omejitev posredovanj z iste neznane številke).
- **Statistika krme:** boljša ocena, koliko krmljenj še ostane.
- **Certifikacija CE (RED)** pred redno prodajo; varnostne zahteve vključujejo tudi privzeta gesla.
- **Širitev izven Slovenije** po uspešni slovenski preizkusni izdaji (potrebna je preverba
  omrežij v vsaki državi; 2G se v nekaterih državah ukinja).
- **Kamera:** zgolj ideja, ne v tem letu.

---

## 22. Slovar

- **Cat-M (LTE-M):** mobilna tehnologija za naprave; varčna, dobro nosi SMS. Ni isto kot 4G v telefonu.
- **NB-IoT:** zelo varčna tehnologija za naprave; **SMS na njej ni zagotovljen**.
- **2G (GSM):** stara mobilna tehnologija; zanesljivo nosi SMS, porabi več, operaterji jo ukinjajo.
- **eDRX:** varčevanje, pri katerem modul vmes »dremlje«; SMS zato pride z zamikom.
- **Gostovanje (R):** kartica je prijavljena v omrežje drugega operaterja.
- **NITZ:** čas, ki ga pošlje mobilno omrežje.
- **PIN / PUK:** koda kartice SIM / koda za odklep po treh napačnih PIN-ih.
- **Polž:** vijačnica, ki potiska krmo iz posode.
- **Kalibracija:** krmilnik si zapomni normalno stanje motorja ali senzorja.
- **Geoograda:** navidezni krog okoli krmilnika; izhod iz njega sproži opozorilo o kraji.
- **Samodejni portal:** stran z aplikacijo se po povezavi na WiFi odpre sama.
- **.hfu:** datoteka za posodobitev programa HuntersFeeder.
- **Brownout:** kratek padec napajanja, po katerem se krmilnik ponovno zažene.

---

## 23. Česar pomočnik ne sme

- Ne sprašuj in ne ponavljaj PIN-ov, PUK-ov, gesel, številk kartic SIM ali telefonskih številk.
- Ne svetuj odpiranja baterije, spreminjanja ožičenja ali posega v elektroniko. To je za podporo.
- Ne trdi, da funkcija »deluje«, če je v tem dokumentu označena kot nepreizkušena ali v razvoju.
- Ne obljubljaj datumov ali cen, ki jih tukaj ni.
- Ne razkrivaj notranjih razvojnih podrobnosti (gesla, interni ukazi, koda).
- Ko ne veš: napoti na podporo (razdelek 0, točka 3).
