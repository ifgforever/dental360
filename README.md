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

## Change the words, hours, phone, tips, reviews

Everything lives in one file: **`config.js`**. Open it, change the text inside
the quotes, save. No coding needed. The TV reloads itself every 4 hours, or
press **F5** on the TV device to see the change right away.

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

**How it updates.** GitHub runs `scripts/build-news.mjs` every 30 minutes
(the "Refresh Chicago headlines" workflow) and saves the results to
`news.json`. The TV re-reads it every 15 minutes. If `news.json` is missing or
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
   later push updates the TV automatically.

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
| `config.js` | Everything you'd want to edit: text, hours, slide order, ads |
| `assets/` | Logo, tooth graphic, photos, QR code (`qr-book.svg` points to the online booking page) |
| `news.json` | Latest Chicago headlines, refreshed automatically |
| `scripts/build-news.mjs` | Fetches the headlines into `news.json` |
| `.github/workflows/news.yml` | Runs the headline refresh every 30 minutes |
| `.github/workflows/pages.yml` | Publishes to GitHub Pages on each push (skips until Pages is on) |

Weather comes from Open-Meteo (free, no account needed). If the TV has no
internet the clock still works and the weather chip simply stays hidden.
