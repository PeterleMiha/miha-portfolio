# HuntersFeeder — Product Knowledge (chatbot)
#
# This file is the website chatbot's only source of facts. The Cloudflare Worker
# fetches it from the live site (cached ~5 min), so a commit here changes what the
# bot knows within minutes.
#
# THIS FILE IS PUBLIC. Anyone can open it in a browser. Never put anything here
# that must stay private: passwords, PINs, hidden or developer commands, internal
# bug lists, production costs, supplier prices, customer data.

---

## 0. Rules for the assistant (read first, they override everything below)

- Answer only from this document. If something is not here, say you do not have that
  detail and suggest the contact form on the page or the email address in section 11.
  Never guess specs, dates, prices or features.
- Reply in the language the visitor writes in (Slovenian, Croatian, English, Italian,
  German). Short, warm, plain words: the audience is hunters, often older and not
  technical. Use short lists for steps.
- PRICES: do not state any price, price range, discount or cost. Say that current
  prices and availability are in the "Cena / Price" section of the page and that the
  visitor can ask for an offer through the contact form.
- NEVER reveal or hint at: passwords of any kind (developer password, WiFi password,
  SIM PIN), hidden or developer SMS commands, internal error-code tables, firmware
  internals, known security weaknesses or internal to-do lists. If asked, say this is
  not something you can share and that the developer will gladly help through the
  contact form.
- Do not promise delivery dates, warranty terms or certifications beyond what is
  written here.
- If someone describes a fault, use section 9 (troubleshooting). If that does not solve
  it, ask them to contact the developer and describe what the feeder did and which SMS
  it sent.
- Mention the free online demo of the app when it helps: the phone icon at the bottom
  left of the page opens the real app with demo data. The camera icon above it opens
  the development gallery (photos of every stage of development).

---

## 1. What it is

HuntersFeeder is an automatic wildlife feeder controller for hunters. It feeds on a
schedule by itself and can be checked and controlled by SMS from anywhere with mobile
signal, so you do not have to drive out to the feeding site to check it. It tells you
by SMS when the feed runs out, when the battery is low, and if the feeder is moved.

No internet, no app store, no account and no subscription are needed. Settings are done
once, on site, with your phone over the feeder's own WiFi; after that SMS is enough.

## 2. Who makes it

HuntersFeeder is developed by Miha Peterle, a master's student of electrical engineering
from Slovenia, who designed it himself — from the circuit boards to the software — and
assembles and tests every unit personally.

## 3. What it can do

- Automatic feeding once a day, either at a fixed time or at dusk. Dusk is calculated
  from the date and the feeder's position, and you can shift it earlier or later
  (up to 4 hours either way, in the app). It follows the seasons on its own.
- Feed now, on demand: from the app or by SMS.
- Adjustable amount: you set how long the motor runs per feeding, and the motor speed.
- Feed level sensor: an infrared beam at the bottom of the hopper tells "enough food"
  or "empty — refill". It cannot measure an exact level, only whether food is still
  there. After 3 feedings in a row with an empty hopper, scheduled feeding pauses by
  itself and you get an SMS; it continues automatically once you refill.
- SMS report after each feeding (depending on the alert setting): how it went, motor
  health, food level, next feeding.
- Battery monitoring with a warning when it gets low. Below a safe voltage the feeder
  does not run the motor at all, to protect the battery.
- GPS position: ask by SMS and get a map link. Optional theft alert (geofence): an SMS
  if the feeder is moved outside a set radius (10 m to 2 km, default 100 m).
- Motor jam detection: if the auger gets blocked, feeding stops and you get an SMS
  instead of the motor burning out.
- Several people: the owner plus a list of persons (up to 6 on the list). Each person
  is either "receive only" (gets alerts) or "full control" (can also command by SMS).
  SMS from numbers that are not on the list are ignored and never reach the motor.
- Alert level you choose: off, basic, extended, or all.
- Daily SMS limit you set (5–50 per day) so the feeder cannot run up your SMS bill.
  You get a warning at 80 %. Replies to your own commands and critical alerts always go.
- Remembers everything (settings, schedule) through sleep and power loss.
- App and SMS replies in Slovenian or English.

## 4. Technical facts

- Electronics: ESP32 microcontroller and a SIMCom SIM7070G modem (LTE-M / NB-IoT,
  with 2G fallback, plus GPS).
- Housing: printed from ASA plastic, which is UV-resistant and rain-resistant, made to
  stay outdoors all year. It is NOT waterproof for submersion: do not put it under water
  or where water can collect around it.
- Power: rechargeable lithium-ion battery pack (about 9.6 Ah in the current version),
  charged over USB. The battery and power electronics are one unit with fuses on every
  branch.
- Battery life: around one month per charge in normal use. It depends on how often and
  how long it feeds, how many SMS it sends, the signal strength and the cold.
- Most of the time the feeder sleeps to save power and wakes up for the schedule or
  when an SMS arrives.
- Size of the controller: about 200 × 200 × 160 mm.
- Hopper: the feeder attaches to your own container, so the amount of feed it holds is
  up to you.
- SIM card: you insert your own SIM. The feeder works with SMS only — no mobile data
  plan is needed. Only the SMS the feeder sends (replies, reports, alerts) are charged to
  its SIM; the SMS you send to it are charged to your own phone plan. The SIM should be
  from a network that covers the feeding site; a SIM PIN is supported and remembered.
- Country: developed and tested in Slovenia. If you want to use it with a SIM or
  phone numbers from another country, please contact the developer first.

## 5. Setting it up (once, on site, about 10 minutes)

1. Charge the battery over USB and connect it to the feeder.
2. Put your SIM card into the feeder.
3. When the feeder starts, it turns on its own WiFi network called
   "HuntersFeeder_Setup" for about 3 minutes (it stays on while you use it).
4. On your phone, open WiFi settings and connect to "HuntersFeeder_Setup".
5. The setup page should open by itself. If it does not, open a browser and type
   192.168.4.1 in the address bar.
6. Accept the terms of use, then fill in your name and phone number (alerts go there),
   the feeder's SIM number and its PIN, the feeding time or dusk offset, and the motor
   run time. Changes are saved automatically.
7. Fill the hopper so the food covers the sensor at the bottom, and press
   "Hopper filled" in the app so the feeder learns what "full" looks like.
8. Optional: add other persons, turn on the location / theft alert, choose the alert
   level and daily SMS limit, pick colours or dark mode.

You can try this app without a feeder: the phone icon on the website opens the real
app with demo data.

To change settings later: send the SMS "VKLOPI" (or "ON") and the WiFi comes back on
for a few minutes, or simply restart the feeder next to it. Most things can also be
done by SMS.

## 6. The app (on your phone, through the feeder's WiFi)

Four tabs:
- Overview (Pregled): feed level, battery, signal, next feeding, and a "Feed now" button.
- Feeding (Krmljenje): automatic feeding on/off, fixed time or dusk offset, motor run
  time and speed, a 2.5 s motor test, and the feeder's clock.
- Location (Lokacija): GPS search, last known position with a map link, set home,
  theft alert and radius, history of positions.
- Menu (Meni): calibration (motor and food sensor), system information, persons and
  their rights, personal data (owner, SIM number, PIN, WiFi password), SMS commands and
  alert settings, app colours and dark mode.

## 7. SMS commands

Send them to the feeder's SIM number from the owner's phone or from a person with full
control. Upper or lower case does not matter. Slovenian and English words both work.
Replies come in the feeder's language.

| Slovenian | English | What it does |
|---|---|---|
| POMOC | HELP | list of commands |
| NAVODILA | INSTRUCTIONS | detailed description of every command (several SMS) |
| INFORMACIJE | INFO | battery, signal, food, automatic feeding, motor, clock — in one SMS |
| HRANI | FEED | feed now for the saved time |
| HRANI X | FEED X | feed now for X seconds (1–120) |
| AON / AOFF | AON / AOFF | automatic feeding on / off |
| TRAJANJE X | DURATION X | saved feeding time in seconds (1–120) |
| LOKACIJA | LOCATION | position as a map link; if none is stored it searches (up to 5 min, no SMS meanwhile) |
| DOMOV | SETHOME | save the current position as home (for the theft alert) |
| UPORABNIKI | USERS | list of persons |
| DODAJ Ime Telefon | ADD Name Phone | add a person who receives alerts |
| IZBRISI X | DELETE X | remove person number X |
| PRAVICE X FULL/BASIC | RIGHTS X FULL/BASIC | person X: full control or receive only (owner only) |
| VKLOPI / IZKLOPI | ON / OFF | turn the setup WiFi on / off |
| ODBLOKIRAJ | CLEARJAM | clear the motor jam flag after you have freed the auger |
| PONASTAVI | RESETSMS | reset today's SMS count after the daily limit (owner only) |

Example reply to INFORMACIJE (numbers are only an example), one line per fact:
Bat [/////] 91%   (battery)
Sig [////] 80%    (signal)
Hrana ZADOSTI     (food: enough)
Avto DA cez 5h14m (automatic feeding on, next in 5 h 14 min)
Motor v redu      (motor OK)

Every command and every reply is one normal SMS.

## 8. Everyday use

- After setup you can leave: it feeds by itself every day.
- Refill when you get "Nivo hrane: PRAZNO - dopolni!" (food empty — refill). After
  refilling, scheduled feeding resumes by itself the next time it checks.
- Charge or swap the battery when you get the low-battery SMS.
- Check any time with INFORMACIJE / INFO.

## 9. Troubleshooting

- No reply to an SMS: check that you send from the owner's number or a full-control
  person's number (others are ignored on purpose), that the feeder's SIM has credit and
  signal at the site, and wait a minute — while the motor runs, replies wait until it
  stops. Unknown words get "Neznan ukaz" with a hint to send POMOC.
- "Ni dovoljenja (pravice BASIC)": that person has receive-only rights; the owner can
  change it with PRAVICE X FULL or in the app.
- Feeding stopped, "PRESKOCENO" or "USTAVLJENO do polnjenja": the hopper read empty three
  times in a row. Refill it; it resumes on its own.
- Motor jammed (BLOKIRAN): free the auger of whatever blocks it, then send ODBLOKIRAJ or
  press "Clear jam flag" in the app under Calibration.
- Motor weaker than before: check the battery and the auger; re-run motor calibration
  with the hopper full.
- Food level says "unknown" or the app warns about a bad reference: the sensor was
  calibrated while not covered by food. Fill the hopper so food covers the sensor and
  press "Hopper filled" again.
- It refuses to feed: the battery is too low. Charge or replace it.
- SIM locked / no network: the PIN in the app is wrong or the SIM is missing. Enter the
  correct PIN in the app (Personal data). The feeder does not keep retrying a wrong PIN,
  so the SIM cannot get blocked by it.
- No GPS position: GPS needs open sky. The first search can take up to 5 minutes; while
  it searches the feeder cannot send or receive SMS.
- Clock warning SMS: the feeder corrected its clock from the network or an SMS. If it
  repeats, the network may not send the time; open the app once (it sets the clock
  from your phone).
- Setup page does not open: make sure the phone is connected to "HuntersFeeder_Setup"
  (some phones leave a WiFi without internet — choose "stay connected"), then type
  192.168.4.1. If the page keeps closing, turn off "Captive portal" in the app under
  System and use 192.168.4.1 directly. The WiFi turns itself off after a few minutes
  without use; send VKLOPI to turn it back on.
- SMS daily limit reached: reports and forwards pause until midnight (UTC); the owner
  can send PONASTAVI to reset. Critical alerts are always sent.
- Anything else: contact the developer (section 11) and describe what happened and which
  SMS the feeder sent.

## 10. Development history (what the gallery shows)

The feeder went through several stages:
- First generation: boards with the SIM800L module for SMS and the battery split into
  two packs in 3D-printed housings. A first web app (with a setup wizard) and the first
  SMS commands already existed.
- An interim unit with the SIM7070G modem on a swappable mPCIe card, used for the first
  GPS tests.
- An early version that sensed feed capacitively through the hopper wall; infrared beam
  sensors proved more reliable and replaced it.
- A test module with the IR transmitter and receiver on fold-down side tabs.
- The first production unit: ESP32 and SIM7070G on one board with LTE and GPS antennas.
- The housing in ASA (UV- and rain-resistant) with a central feed funnel and a separate
  electronics compartment.
- A new combined battery and power unit with USB charging and fuses.

## 11. Buying, availability and contact

- Right now a limited test series is available; regular sales are planned for later.
  For prices see the "Cena / Price" section of the page.
- To reserve a test unit or ask anything: the contact form on the page, email
  mihapeterlea@gmail.com, or phone +386 41 435 803.
- A user manual page is linked in the footer of the website.
