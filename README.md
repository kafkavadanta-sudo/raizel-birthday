# For Raizel 💌

A birthday gift website. Plain HTML, CSS and JS with **no build step**: edit a file, refresh, deploy.
It's built for iPhone Safari in portrait.

- **Part 1, the Journey:** 13 guided screens. It includes the scrabble puzzle and the slide-to-confirm slider.
- **Part 2, the Dashboard:** the page she can come back to any time.

Once she finishes the journey, her phone remembers it, so later visits open straight to the dashboard.
There's a small "↺ replay the beginning" link in the footer.

## Run it locally

```bash
npx serve .          # then open the printed URL
```

(Opening `index.html` directly works too. A local server is closer to the real thing.)

## Where to change things

| What | File |
| --- | --- |
| All text, journey screens, letters, dates, stats, links, bucket list, photo lists | `js/content.js` |
| Gift codes and their stories | `js/gifts.js` (generated with `tools/gift-encoder.html`) |
| Colors and fonts | top of `css/styles.css` (`:root`) |
| Photos | `assets/photos/…` |

You shouldn't need to touch `js/app.js`.

### Photos
1. Resize to about 1200px on the long side and save as **WebP** at quality ~75.
   [squoosh.app](https://squoosh.app) does this in the browser.
2. Put the files in:
   - `assets/photos/conveyor/`: the scrolling strip under the hero (5–10 photos)
   - `assets/photos/favorites/`: "My Favorite Pics of You" (6–7 photos; the first one is shown big)
   - `assets/photos/dates/`: one per key date
3. Update the file names in `js/content.js`.

The files there now are pastel placeholders.

### Key dates
In `js/content.js` → `dates.events`, each key is a date `"YYYY-MM-DD"` with a `title`, `photo`, `story` and `why`.
Add or remove entries freely. The calendar range is set by `startMonth` / `endMonth`.

### Links
In `js/content.js`:
- `radio.youtubeUrl`: the unlisted YouTube link (any format)
- `playlist.spotifyUrl`: the Spotify playlist link

While either is empty, a friendly "coming soon" shows instead.

### Gift codes 🎁
Codes are stored hashed, and each gift's text is scrambled with its own code, so she can't read them from the page source.
This is light obfuscation, not real security.

1. Open `tools/gift-encoder.html` in your browser. Double-click works.
2. Type each code, gift name, emoji and narrative, then press **Generate**.
3. Replace everything in `js/gifts.js` with the output.

Codes ignore spaces and upper/lower case.

> ⚠️ The current codes are placeholders (`CODE1` … `CODE4`). Replace them before the big day.

### Music
By default a soft piano loop is generated in the browser, so there's no file to download.
To use your own track, drop an mp3/m4a into `assets/audio/` and set `audio.src` in `js/content.js`.

Music only starts after her first tap (Safari rule), gets louder over screens 8–12, and has a mute button bottom-right.
On iPhone, the ringer/silent switch can mute web audio on older iOS versions.

### Fonts
Fraunces (headings) + Quicksand (body), from Google Fonts.
To swap them, change the `<link>` in `index.html` and `--font-display` / `--font-body` in `css/styles.css`.

## Deploy

It's a static site, so there are no build settings. Either:
- **Vercel:** import the repo, framework preset "Other", no build command, output directory `.`
- **Netlify:** import the repo (`netlify.toml` is included), or drag the folder onto app.netlify.com/drop

The page has `noindex` set so search engines skip it.

## Saved on her phone (localStorage)
- `rb.journey`: journey progress/finished
- `rb.bucket`: checked items and items she added
- `rb.gifts`: gifts she has unlocked
