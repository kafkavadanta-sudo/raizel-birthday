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
Every drop spot has a `_PUT … HERE.txt` note inside it.

| Where | What to drop | Notes |
| --- | --- | --- |
| `assets/photos/conveyor/` | `AFFECTUM CAROUSELS - 1.webp` … `- 10.webp` | Moving strip under the hero. The list is in `js/content.js` → `conveyorPhotos`. |
| `assets/photos/gallery/` | `GALLERY - 1.webp` … `- 10.webp` | "Gallery of My Favorite Pics". The list is in `js/content.js` → `gallery.photos`. |
| `assets/photos/dates/<DATE>/` | any images, e.g. `assets/photos/dates/3 JULY 2026/1.jpg` | One folder per calendar date. They already exist. Photos show in file-name order. |

A photo that isn't there yet is skipped, never shown broken.
A date with an empty folder just shows its story.

**Date folders are picked up automatically on deploy**, because Vercel and Netlify run `node tools/build-photo-manifest.js`.
If you preview locally, run that command once after adding photos.

Big PNGs are slow on phones.
If you can, export them at about 1600px on the long side, or convert them to JPG/WebP at [squoosh.app](https://squoosh.app).
If you rename a file, update its name in `js/content.js`.

### Remember This Day? (calendar)
Each date lives in `js/content.js` → `dates.events` as `"YYYY-MM-DD": { title, story }`.
- `highlightDate` is the gold box (May 1, 2026).
- `togetherSince` is where the little hearts start. They extend to today automatically.
- To point a date at a differently named folder, add `folder: "My Folder"` to it.
- `special: true` (used on Oct 11, 2026) makes a date wiggle on the calendar and open a big celebratory popup with `title`, `subtitle` and emoji `confetti`.

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
Drop the song into `assets/audio/`, named exactly:
`i think you were in my profile picture once (instrumental).mp3`

It loops forever. Until the file is there, a soft built-in piano loop plays instead.

Music only starts after her first tap (Safari rule), gets louder over screens 8–12, and has a mute button bottom-right.
On iPhone, the ringer/silent switch can mute web audio on older iOS versions.

### Fonts
Fraunces (headings) + Quicksand (body), from Google Fonts.
To swap them, change the `<link>` in `index.html` and `--font-display` / `--font-body` in `css/styles.css`.

## Deploy

It's a static site. The only build step is the one-line photo-list script, and it's already configured:
- **Vercel:** `vercel.json` sets the build command and output directory (`.`).
- **Netlify:** `netlify.toml` does the same.

The page has `noindex` set so search engines skip it.

## Saved on her phone (localStorage)
- `rb.journey`: journey progress/finished
- `rb.bucket`: checked items and items she added
- `rb.gifts`: gifts she has unlocked
- `rb.future`: her "Notes For The Future" letters
