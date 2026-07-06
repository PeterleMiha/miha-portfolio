# HuntersFeeder — Product Knowledge
# This one file is the chatbot's "brain" AND the source of the manual page captions.
# Fill in / verify anything in [BRACKETS]. Keep it in the repo at:  data/knowledge.md
# To update what the bot knows later: just edit this file on GitHub and commit.

---

## 1. What it is (one short paragraph — the bot uses this to introduce the product)

HuntersFeeder is a smart, cellular-controlled wildlife feeder for hunters. It dispenses
feed automatically on a schedule and can be controlled remotely by SMS, so you don't have
to drive out to the feeding site to check or adjust it. It gives you notifications and
feedback on power and food levels, saving you time — and time is money.

## 2. Who it's for

Mainly hunters. Sold across SL / EN / DE / IT / HR markets.

## 3. Key features (the bot lists these when asked "what can it do")

- Remote control by SMS / cellular
- Automatic feeding on a set schedule — by hour, or by outside brightness (light-triggered)
- Alert when the hopper is running low
- Alert when the battery is low
- GPS location tracking
- Multi-user support (more than one person can control/monitor the same device)
- Rugged design for outdoor / all-weather use
- Long battery life — 1 month+ on a charge

## 4. Technical specs

- Controller:         Espressif (ESP32-family)
- Connectivity:       LTE / Cat-M1
- Power / battery:    Li-ion, 9Ah–12Ah
- Hopper capacity:    Unlimited — sized by whatever external container the customer attaches
- Dimensions/weight:  200 x 200 x 160 mm
- Price:              Early test units: €150–200. Launched product: €200–300.
- SIM / subscription: Customer inserts their own SIM card. Device only sends SMS
                      (no data plan needed). Only outgoing SMS FROM the device
                      (alerts, status feedback) is billed to the device's own SIM;
                      SMS commands sent TO the device are billed on the customer's
                      own phone/provider plan, not the device's SIM.

## 5. How it works, start to finish

**Initial setup (one-time, via WiFi):**
The device creates its own local WiFi access point (hotspot) with a small built-in
web server at a single fixed address, 192.168.4.1. Connecting to that WiFi and opening
that address in a browser opens a captive portal — a setup page that lets you configure
everything from A to Z (schedule, SIM/phone number, etc.) in one place.

1. Charge the battery.
2. Connect the battery to the device.
3. On your phone, open WiFi settings and connect to the "HuntersFeeder" network.
4. Open a browser (Chrome, Safari, etc.).
5. Wait a few seconds for the setup page to open automatically. If it doesn't within
   ~5 seconds, type 192.168.4.1 into the address bar.
6. Follow the on-screen instructions to configure the schedule, SIM/phone number, etc.
   (Note: you must be connected to the HuntersFeeder WiFi network first, before this
   page will load.)

**Day-to-day use (after setup):**
- Once configured, you can walk away — the device runs on its own schedule.
- Most functions from then on are controlled remotely by SMS, and the device sends
  feedback (status, alerts) back to you by SMS too. You don't need to reconnect to
  its WiFi again unless you want to change settings via the captive portal.
- You'll receive SMS alerts for low food, low battery, etc.

## 6. Manual steps index  ←← THIS is what lets the bot point to a picture
# Format:  step-NN | image filename | short caption (what this step shows)
# The manual page shows the caption under the image; the bot points here by number.
#
# PENDING — no illustrations yet. Until images exist, the bot will describe steps in
# text only (from Section 5 above) and will NOT reference a picture. Fill this in
# once the step-by-step illustrations are ready; captions can reuse Section 5's wording.

- step-01 | step-01.webp | [pending: charge the battery]
- step-02 | step-02.webp | [pending: connect battery to device]
- step-03 | step-03.webp | [pending: connect to HuntersFeeder WiFi]
- step-04 | step-04.webp | [pending: open browser / 192.168.4.1]
- step-05 | step-05.webp | [pending: follow on-screen setup]
- [add more as needed]

## 7. FAQ  (the bot answers from these — add every question a customer might ask)

Q: Does it work without phone signal?
A: Yes, scheduled feeding still runs on time without a GSM signal — the schedule is stored
   on the device itself. However, you won't receive SMS alerts (low food, low battery,
   GPS updates) until signal is available again.

Q: How long does the battery last?
A: Around one month on heavy use.

Q: How do I know the hopper is empty?
A: The device senses low food level and sends an SMS alert automatically.

--- Suggested additional questions — keep, edit, or delete freely ---

Q: How do I set it up for the first time?
A: [Reuse Section 5's WiFi setup steps]

Q: Can more than one person control the same feeder?
A: Yes — it supports multi-user access, so family or hunting-group members can share control.

Q: Does it track the feeder's location?
A: Yes, it has GPS, useful if the feeder is moved or needs to be located in the field.

Q: What SIM card do I need, and who pays for it?
A: You insert your own SIM card. The device only sends SMS, no data plan required.
   Only the messages the device sends out (alerts, status feedback) are billed on the
   device's SIM — commands you send to the device are billed on your own phone plan,
   like any normal text message.

Q: How much does HuntersFeeder cost?
A: [your answer — e.g. early test units €150–200, full launch price €200–300]

Q: Is it weatherproof / can it handle rain, snow, cold?
A: [FILL IN — what conditions has it actually been tested/built for?]

Q: How do I refill the hopper?
A: [FILL IN — physical steps, since hopper size is customer-supplied]

Q: Can I change the feeding schedule after setup, or only during initial WiFi setup?
A: [FILL IN — e.g. can it be changed later via SMS command, or does it require reconnecting to WiFi?]

Q: What happens if the device loses power completely?
A: [FILL IN — does it lose its schedule/settings, or remember them?]

Q: Is there a warranty?
A: [FILL IN — do you offer one, and for how long?]

Q: How do I buy one / where can I order?
A: Right now the product is in its final development stage — only test samples are
   available. Please reach out via the contact form or email so we can follow up
   when it's ready.

## 8. Rules for the bot (how it should behave)

- Answer in the same language the user writes in (SL, EN, DE, IT, HR).
- Be friendly and simple — the audience is older rural hunters, not engineers.
- If asked about ordering, price, or anything you don't know: point them to the contact
  form / email (mihapeterlea@gmail.com) instead of guessing.
- When explaining a physical step, reference the matching manual step so the picture shows.
- Never invent specs. If it's not in this document, say you'll have someone follow up.
