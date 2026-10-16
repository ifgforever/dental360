# Dental 360 — Lobby TV Signage

Full-screen, self-running signage for the lobby TV at
**Dental 360 Irving Park Family Dentistry**, 3435 W. Irving Park Rd, Chicago.

It replaces the news channel with a loop of slides about the practice:
welcome, services, patient reviews, hours with a scan-to-book QR code,
healthy-smile tips, promos for orthodontics / implants / whitening, and
the "20+ locations" story, a Chicago headlines page, and a Facebook follow
page with a QR code. A bar along the bottom shows the Dental 360 logo, a
scrolling ticker of office messages mixed with Chicago headlines, the time,
and the current Chicago weather.

Ad slots are built in and switched off until you add something to them.

## See it

Open `index.html` in any browser. Press **F11** for full screen.

Once GitHub Pages is switched on (see "Publish" below) the live address is:

    https://ifgforever.github.io/dental360/

Handy keys while testing: **→** next slide, **←** previous, **Space** pause,
**H** show the slide counter. Add `?slide=hours` to the address to start on a
given slide, or `?debug` to show the counter from the start.

## Let the office manage it themselves

`admin.html` is a simple "Manage Lobby Screen" page for the office staff. It
works on a computer or a phone and needs no coding:

    https://ifgforever.github.io/dental360/admin.html

- **Your slides.** Drag in pictures, flyers or short MP4 videos, or type a text
  announcement such as holiday hours. Each slide gets its own on/off switch,
  seconds on screen, and optional start and stop dates, so a promo can turn
  itself off when it ends. Pictures are resized automatically.
- **Scrolling messages** and **office hours** can be edited, added or removed.
- **Screen settings** turn the Chicago headlines and the built-in Dental 360
  slides on or off, and set how often the office's own slides play.
- **Publish to TV** saves everything at once. The TV checks for changes every
  few minutes and refreshes itself, usually within 5–10 minutes.

**One-time connection.** The first time, the page asks for an access key. It
walks you through making one on GitHub: a fine-grained token limited to this
one repository with **Contents: Read and write**. The key is stored only in that
computer's browser, and "Disconnect this computer" removes it. Without a key the
page can't change anything, so it's fine that the address is public.

Under the hood each Publish is one commit that updates `content.json` and adds
or removes files in `uploads/`. Once the office has published, their ticker
messages and hours take priority over the ones in `config.js`.

Only use patient photos with the patient's written permission.

## Handing it over (sold outright)

1. The office makes a free GitHub account.
2. In this repo go to **Settings → General → Transfer ownership** and transfer it
   to their account. Their screen address becomes
   `https://THEIR-ACCOUNT.github.io/dental360/`, and the manage page finds the
   new location on its own.
3. Point the TV at the new address and help them create their access key.

## Know every TV is online and playing

Each TV checks in with [Healthchecks.io](https://healthchecks.io) every 5
minutes. The check-in is sent from the slideshow itself, so it proves the page
is on screen and the slides are moving, not just that the device has power.
If a TV goes quiet for 15 minutes, you get an alert.

A TV reports a problem right away, and Healthchecks alerts you, when:

- the slideshow stops advancing. The TV also restarts the page by itself.
- another app is in front of the signage, such as someone pressing Home.

Each check-in also notes how many slides and which ads played since the last
one, what's on screen, and whether headlines loaded. You can see this in the
TV's event log on Healthchecks.

**Set it up (once)**

1. Make a free account at healthchecks.io. Under **Integrations**, add how you
   want alerts. Email works on the free plan.
2. Go to **Project Settings → Ping key → Create** and paste the key into
   `config.js` under `monitor.pingKey`.
3. Give each TV its own name at the end of its address:

       https://ifgforever.github.io/dental360/?screen=irving-park-lobby

   The TV appears on your Healthchecks dashboard the first time it checks in.

**Many TVs at once.** List every TV under `monitor.screens` in `config.js`.
Then create a read-write API key in Healthchecks (**Project Settings → API
Access**) and save it in this repo under **Settings → Secrets and variables →
Actions** as `HEALTHCHECKS_API_KEY`. Run **Actions → Set up TV monitoring → Run
workflow**. It creates or updates every TV with the 15-minute alert timing and
your alert channels. It's safe to run again whenever you add TVs. TVs not on
the list still appear on their own the first time they check in, but with
Healthchecks' default one-day timing, so run the workflow afterwards.

| Healthchecks plan | TVs | Price |
|---|---|---|
| Hobbyist | up to 20 | free |
| Business | up to 100 | $20/month |
| Business Plus | up to 1,000 | $80/month |

**What it can't see.** The check-in can't tell whether the TV itself is
switched on or set to the right input. For that, plug the TV into a smart
plug that reports power use. A TV that's on draws far more power than one in
standby. Turn off the TV's sleep timers too.

**After hours.** If the office switches the TV and stick off at night, pause
those checks in Healthchecks or give them a schedule there. Otherwise you'll
get an alert every night.

The ping key is visible in the page source, as it has to be for the TV to use
it. All it allows is sending check-ins. It can't read or change your
Healthchecks settings. Keep the API key secret.

## Change the words, hours, phone, tips, reviews

Day-to-day content is easiest through the manage page above. Everything else
lives in one file: **`config.js`**. Open it, change the text inside the quotes,
save. No coding needed. The TV notices the change within a few minutes and
refreshes itself. It never refreshes while the internet is down, so the screen
keeps playing.

- `business` — office name, address, phone, booking link, Google rating
- `hours` — opening hours table
- `ticker` — the scrolling messages along the bottom
- `services`, `values`, `reviews`, `tips` — the content pools
- `slides` — the order of the loop. Delete a line to drop a slide, copy a
  line to show it more often, add `seconds: 20` to hold it longer.

Swap in real Irving Park Google reviews when you have them; the three in there
now are the testimonials from the Dental 360 website. Check the Google rating
numbers against the office's Google Business Profile before the TV goes live.

## Chicago news headlines

Headlines from WGN, Block Club Chicago, NBC 5, ABC 7, WTTW and the Sun-Times
show in two places:

- **The ticker** along the bottom, two headlines then one of your own messages.
  Each headline has a red tag naming the outlet.
- **The "Chicago headlines" slide**, a full page of the six newest stories.

Each outlet writes its own headlines, so the list is mostly different stories.
When two outlets cover the same story, the newer one is kept and the repeat
is dropped. Headlines with words like "shooting", "killed" or "crash" are
filtered out so the lobby screen stays calm. Edit `skipWords` in `config.js`
to change that.

**How it updates.** Every 30 minutes the publish workflow runs
`scripts/build-news.mjs` and publishes fresh headlines in `news.json`. The TV re-reads it every 15 minutes. If `news.json` is missing or
more than 12 hours old, the TV reads the feeds directly through a free RSS
service instead. If the internet is down, the ticker shows your own messages.

To change outlets, edit the `news.feeds` list in `config.js`. To keep headlines
off the ticker but keep the slide, set `inTicker: false`. To turn news off
entirely, set `enabled: false`.

## Add an ad

In `config.js`, put the ad in the `ads` list. One ad plays after every
`adEvery` (default 4) regular slides, rotating through the list.

```js
ads: [
  // a picture (drop it in the assets folder — 1920x1080 looks best)
  { type: "image", src: "assets/ads/joes-pizza.jpg", seconds: 10 },

  // a simple text card
  { type: "text", eyebrow: "Neighborhood partner", title: "Joe's Pizza",
    text: "Show your Dental 360 appointment card for 10% off", footer: "4000 W Irving Park Rd" },

  // a short video (mp4, plays muted, moves on when it ends)
  { type: "video", src: "assets/ads/clip.mp4" }
]
```

Ads are tagged "Sponsored" in the corner. Leave the list empty for no ads.

## Publish (one-time)

1. On GitHub open the repo → **Settings → Pages**.
2. Under **Build and deployment → Source** choose **GitHub Actions**.
3. Push any change (or run the "Publish signage to GitHub Pages" workflow from
   the Actions tab). About a minute later the address above is live, and every
   later save updates the TV automatically.

GitHub Pages on a private repository needs a paid GitHub plan. On a free plan,
make the repository public. Everything in it is lobby content anyway.

## Put it on the TV

Any device with a web browser works. Point it at the Pages address, make it
full screen, and stop it from sleeping. Cheapest reliable options:

**Amazon Fire TV Stick (about $30)**
Install **Fully Kiosk Browser** or **Silk Browser** from the Appstore, open the
address, choose full screen. In Fire TV settings turn the screensaver off
(Settings → Display & Sounds → Screensaver → Start time → Never). In Fully
Kiosk set it as the start URL so it comes back after a power cut.

**Raspberry Pi / mini PC / old laptop**
Launch Chrome or Chromium in kiosk mode on startup:

```
chromium --kiosk --noerrdialogs --disable-session-crashed-bubble --incognito https://ifgforever.github.io/dental360/
```

Disable screen blanking in the OS power settings.

**Smart TV with a built-in browser**
Open the address in the TV browser and use its full-screen option. Many TV
browsers can't hide their toolbar or survive reboots, so a stick is usually
the better choice.

**TV settings worth doing while you're re-hanging it**
- Turn off auto power-off / sleep timers and any "eco" dimming.
- Set the input to the stick and disable the TV's own channel tuner.
- Picture mode "Standard" or "Natural" keeps the brand blue from going neon.
- The page is designed at 1920x1080 and scales to fit any screen, so a 4K TV
  is fine too.

## What's in the folder

| File | Purpose |
|------|---------|
| `index.html` | The player: layout, styling, slide templates, clock, weather, ticker |
| `admin.html` | "Manage Lobby Screen" page for the office: uploads, announcements, ticker, hours |
| `content.json` | What the office saved from the manage page (written by `admin.html`) |
| `uploads/` | Pictures and videos the office uploaded |
| `config.js` | Built-in content and settings: text, hours, slide order, ads, news feeds |
| `assets/` | Logo, tooth graphic, photos, QR code (`qr-book.svg` points to the online booking page) |
| `news.json` | Latest Chicago headlines, refreshed automatically |
| `scripts/build-news.mjs` | Fetches the headlines into `news.json` |
| `scripts/setup-monitoring.mjs` | Creates or updates a Healthchecks.io check for every TV in `monitor.screens` |
| `.github/workflows/monitoring.yml` | "Set up TV monitoring", run by hand from the Actions tab |
| `.github/workflows/pages.yml` | Publishes on every save and every 30 minutes with fresh headlines (skips until Pages is on) |

Weather comes from Open-Meteo (free, no account needed). If the TV has no
internet the clock still works and the weather chip simply stays hidden.
