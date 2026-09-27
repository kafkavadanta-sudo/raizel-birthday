/* =====================================================================
   CONTENT FILE — edit this file to change text, photos, dates & links.
   You never need to touch app.js to swap content.

   Tips
   - Photos: drop files into assets/photos/... and update the paths below.
     WebP (~1200px on the long side, quality ~75) keeps things fast.
   - Text inside `backticks` can span multiple lines; line breaks are kept.
   - Gift codes are NOT in this file — see js/gifts.js + tools/gift-encoder.html
   ===================================================================== */

window.SITE = {
  herName: "Raizel",
  myName: "Kafka",

  /* ---------------- PART 1 — THE JOURNEY ----------------
     type: "choice"   → text + several buttons (all advance)
           "button"   → text + one button
           "scrabble" → drag the tiles to spell `word`
           "slider"   → slide to 100% to continue
           "auto"     → fades in, holds `holdMs`, fades to next
           "finale"   → big title, then melts into the dashboard
     bg: background colour for that screen (fades smoothly between screens)
     volume: ambient audio level for that screen (0–1)                      */
  journey: [
    { type: "choice", text: "Seems like you got your flowers! Do you like 'em?", buttons: ["yes!", "YES I REALLY LOVE THEM"], bg: "#FFFAD3", volume: 0.2 },
    { type: "button", text: "And guess what! There's one more big thing!", button: "Ohhh... what is it?", bg: "#FFFAD3", volume: 0.2 },
    { type: "button", text: "Someone is turning 19, Hmm... I wonder who she is...", button: "Really??", bg: "#FFFAD3", volume: 0.2 },
    { type: "scrabble", text: "Who's the birthday girl?", word: "RAIZEL", bg: "#FFFAD3", volume: 0.2 },
    { type: "button", text: "You got it right! But wait! Are you the birthday girl?", button: "Yes I am!", bg: "#FFFAD3", volume: 0.22 },
    { type: "button", text: "Are you sureee??", button: "Yes I AM!", bg: "#FFFAD3", volume: 0.22 },
    { type: "slider", text: "Haha, let's see about that! Slide the slider below to confirm", sliderLabel: "slide to confirm", bg: "#FFFAD3", volume: 0.25 },
    { type: "auto", text: "Hi Raizel", holdMs: 4000, bg: "#FFFAD3", volume: 0.32 },
    { type: "auto", text: "Today is your special day", holdMs: 4000, bg: "#FFEFC6", volume: 0.4 },
    { type: "auto", text: "To the prettiest, most loving girl", holdMs: 4000, bg: "#FFE3B6", volume: 0.48 },
    { type: "auto", text: "And to the best girlfriend ever", holdMs: 4000, bg: "#FFD6B4", volume: 0.55 },
    { type: "auto", text: "I, Kafka, want to say...", holdMs: 4000, bg: "#FFC7B5", volume: 0.62 },
    { type: "finale", text: "Happy 19th Birthday! 🎂❤️", holdMs: 3600, bg: "#FFB1B1", volume: 0.65 },
  ],

  /* ---------------- AMBIENT AUDIO ----------------
     Leave `src` empty to use the built-in soft synthesized piano.
     Or drop an mp3/m4a in assets/audio/ and set e.g. "assets/audio/ambient.mp3" */
  audio: {
    src: "",
    dashboardVolume: 0.3,
  },

  /* ---------------- PART 2 — THE DASHBOARD ---------------- */
  nav: [
    { id: "about", label: "About Her" },
    { id: "dates", label: "Dates" },
    { id: "letters", label: "Letters" },
    { id: "numbers", label: "Us in Numbers" },
    { id: "radio", label: "Affectum Radio" },
    { id: "bucket", label: "Bucket List" },
    { id: "gallery", label: "Gallery" },
    { id: "playlist", label: "Playlist" },
    { id: "code", label: "Code" },
  ],

  hero: {
    title: "Happy 19th Birthday, Raizel! 🎂❤️",
    subtitle: "from a boy who loves you very much! ~ Kafka",
    body: "In this special day, is all about you! So, to make it just a bit more special, please enjoy the small bits of joy I scattered throughout this page. I hope this makes your day just a bit more special, as you make my life as special ❤️",
    closing: "Enjoy!",
  },

  // Photo conveyor belt under the hero (5–10 photos looks best)
  conveyorPhotos: [
    { src: "assets/photos/conveyor/01.webp", alt: "Us" },
    { src: "assets/photos/conveyor/02.webp", alt: "Us" },
    { src: "assets/photos/conveyor/03.webp", alt: "Us" },
    { src: "assets/photos/conveyor/04.webp", alt: "Us" },
    { src: "assets/photos/conveyor/05.webp", alt: "Us" },
    { src: "assets/photos/conveyor/06.webp", alt: "Us" },
    { src: "assets/photos/conveyor/07.webp", alt: "Us" },
    { src: "assets/photos/conveyor/08.webp", alt: "Us" },
  ],

  aboutHer: {
    title: "About Her",
    // Placeholder — replace with the real content. Each string = one paragraph.
    paragraphs: [
      "✏️ Placeholder: a few words about Raizel go here.",
      "What makes her laugh, her favourite things, the little habits that make her her.",
    ],
    // Optional little "fact chips" — delete the list (or leave empty) to hide
    facts: [
      { label: "Favourite flower", value: "✏️ placeholder" },
      { label: "Comfort food", value: "✏️ placeholder" },
      { label: "Laughs at", value: "✏️ placeholder" },
    ],
  },

  /* Dates calendar — scrollable from `startMonth` to `endMonth` (YYYY-MM).
     Each event key is a date "YYYY-MM-DD". Tapping that day opens the popup. */
  dates: {
    title: "Dates",
    intro: "Tap a highlighted day ❤️",
    startMonth: "2025-09",
    endMonth: "2026-10",
    weekStartsOn: 0, // 0 = Sunday, 1 = Monday
    events: {
      "2025-09-20": {
        title: "The day we first talked",
        photo: "assets/photos/dates/met.webp",
        story: "✏️ Placeholder story — what happened that day.",
        why: "✏️ Placeholder — why this day matters.",
      },
      "2025-11-03": {
        title: "Kafka's birthday",
        photo: "assets/photos/dates/kafka-birthday.webp",
        story: "✏️ Placeholder story.",
        why: "✏️ Placeholder.",
      },
      "2026-02-14": {
        title: "Valentine's Day",
        photo: "assets/photos/dates/valentines.webp",
        story: "✏️ Placeholder story.",
        why: "✏️ Placeholder.",
      },
      "2026-04-12": {
        title: "Our first date",
        photo: "assets/photos/dates/first-date.webp",
        story: "✏️ Placeholder story.",
        why: "✏️ Placeholder.",
      },
      "2026-05-01": {
        title: "The day you said yes ❤️",
        photo: "assets/photos/dates/anniversary.webp",
        story: "✏️ Placeholder story (thank you Bebek Disko!).",
        why: "✏️ Placeholder — day one of our happy days.",
      },
      "2026-10-11": {
        title: "Your 19th birthday! 🎂",
        photo: "assets/photos/dates/birthday.webp",
        story: "✏️ Placeholder story.",
        why: "✏️ Placeholder.",
      },
    },
  },

  // Letters — shown exactly as written. Blank lines = new paragraph.
  letters: {
    title: "Letters",
    intro: "Open whenever you need one 💌",
    items: [
      {
        title: "A Small Wish",
        icon: "🌷",
        text: `To my girlfriend, Raizel ❤️

Happy 19th birthday, honey! You're one year older ever since we met haha! It has been a blast to be with you. For your special day, I wish you to be Raizel!

I wish you to be the Raizel that is caring, someone who is kind and loving. Someone who loves the people around her and her family. I wish you to be the Raizel that is strong, someone who will get through things no matter what. I wish you to be the Raizel that is sweet, someone who can make people happy just by her presence. I wish you to be the Raizel that is funny, someone who makes the mood feel alive. I wish you to be the Raizel that is you, someone who I truly love and adore.

Thank you for making my days better every day, and I wish you love, once again.

~ From a boy who loves you, Kafka`,
      },
      {
        title: "Read This When You're Sad",
        icon: "🌧️",
        text: `Hi honey, this is me! Kafka!

I know things might not be okay right now, I know things might be awful and sad. I know things might not work out from what you expect. It is poopy, huh?

Well... I must tell you, you will be okay. You know you will. But promise me, now, you have to believe it. Know that you will be okay, know that everything will go absolutely fine. And promise yourself, you will be kind, you will keep loving, and pinky promise to yourself, you will get through it no matter what. Because whatever it is, I will keep always rooting for you, for everything that you might be facing right now, and everything that will happen, or has happened.

Let today be poopy, take your space, take your time, have a drink and take a rest. And tomorrow will be brighter than ever. So say thanks to yourself for being strong all these times, and root for yourself to be strong. You can make it. I always believe in you.`,
      },
      {
        title: "Read This When You Miss Me",
        icon: "🌙",
        text: `It is a bit ironic that I wrote this knowing that I miss you more. But whatever, I still wanna write it anyways (cuz I miss you haha).

I miss you. And here's the thing honey, I always will. Everything you do reminds me how grateful I am to have you. I am grateful we met, I am grateful we talked that day, I am grateful that I took you out on that date, and I am of course very grateful for the day I asked you to be my girlfriend (thank you Bebek Disko haha).

It has been a blast to be with you, and I am truly grateful for everything we had.

Thank you for making my days soo much fun sayang! I hope it does the same way to you... I will always miss you, even when we're apart, just know I will always care for you!

I love you honey!`,
      },
    ],
  },

  // Us in Numbers — dates are local time. Birthdays: month 1–12.
  numbers: {
    title: "Us in Numbers",
    togetherSince: "2026-05-01",
    kafkaBirthday: { month: 11, day: 3 },
    raizelBirthday: { month: 10, day: 11 },
    cards: {
      happyDays: "Our Happy Days",
      toKafka: "Days to Kafka's Birthday",
      toRaizel: "Days to Raizel's Birthday",
      dates: { label: "Our Dates", value: "67 dates! (and more to come)" },
      love: { label: "Kisses, Huggies, and Love", value: "UNLIMITED" },
    },
  },

  radio: {
    title: "Affectum Radio",
    label: "📻 Affectum Radio — now playing, just for you",
    // Paste the unlisted YouTube link (any youtube.com / youtu.be format works)
    youtubeUrl: "",
  },

  bucketList: {
    title: "Our Bucket Lists",
    items: [
      "Candlelight dinner",
      "Another picnic date",
      "Crafting date",
      "Another beach date",
      "Escape room date",
      "IKEA date",
      "Board game cafe date",
    ],
    placeholder: "Add a new adventure…",
  },

  gallery: {
    title: "My Favorite Pics of You",
    photos: [
      { src: "assets/photos/favorites/01.webp", alt: "Raizel" },
      { src: "assets/photos/favorites/02.webp", alt: "Raizel" },
      { src: "assets/photos/favorites/03.webp", alt: "Raizel" },
      { src: "assets/photos/favorites/04.webp", alt: "Raizel" },
      { src: "assets/photos/favorites/05.webp", alt: "Raizel" },
      { src: "assets/photos/favorites/06.webp", alt: "Raizel" },
      { src: "assets/photos/favorites/07.webp", alt: "Raizel" },
    ],
  },

  playlist: {
    title: "Playlist",
    label: "Songs that sound like us 🎧",
    // Paste the Spotify playlist link, e.g. https://open.spotify.com/playlist/XXXX
    spotifyUrl: "",
  },

  code: {
    title: "Code",
    intro: "Every gift comes with a secret code. Type one in to unlock its little story 🎁",
    placeholder: "Enter a code",
    wrong: "Hmm… that's not it. Try again 💭",
  },

  footer: "Made with a whole lot of love, by Kafka ❤️",
};
