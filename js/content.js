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
    { type: "choice", text: "Seems like you got your flowers! Do you like 'em?", buttons: ["Yes!", "YES I REALLY LOVE THEM"], bg: "#FFFAD3", volume: 0.2 },
    { type: "button", text: "And guess what! There's one more big thing!", button: "Ohhh... what is it?", bg: "#FFFAD3", volume: 0.2 },
    { type: "button", text: "Someone is turning 19, Hmm... I wonder who...", button: "Really??", bg: "#FFFAD3", volume: 0.2 },
    { type: "scrabble", text: "Can you guess the birthday girl?", word: "RAIZEL", bg: "#FFFAD3", volume: 0.2 },
    { type: "button", text: "You got it right! But wait! Are YOU the birthday girl?", button: "Yes I am!", bg: "#FFFAD3", volume: 0.22 },
    { type: "button", text: "Are you sureee??", button: "Yes I AM!", bg: "#FFFAD3", volume: 0.22 },
    { type: "slider", text: "Haha, let's see about that! Slide the slider below to confirm!", sliderLabel: "slide to confirm", bg: "#FFFAD3", volume: 0.25 },
    { type: "auto", text: "Hi Raizel", holdMs: 3000, bg: "#FFFAD3", volume: 0.32 },
    { type: "auto", text: "Today is your special day!", holdMs: 3000, bg: "#FFEFC6", volume: 0.4 },
    { type: "auto", text: "To the prettiest, most loving girl", holdMs: 3000, bg: "#FFE3B6", volume: 0.48 },
    { type: "auto", text: "And to the best girlfriend ever", holdMs: 3000, bg: "#FFD6B4", volume: 0.55 },
    { type: "auto", text: "I, Kafka, want to say...", holdMs: 3000, bg: "#FFC7B5", volume: 0.62 },
    { type: "finale", text: "Happy 19th Birthday! 🎂❤️", holdMs: 3600, bg: "#FFB1B1", volume: 0.65 },
  ],

  /* ---------------- BACKGROUND MUSIC ----------------
     👉 DROP THE MP3 HERE: assets/audio/i think you were in my profile picture once (instrumental).mp3
     (Loops forever. Until the file exists, a soft built-in piano loop plays instead.) */
  audio: {
    src: "assets/audio/i think you were in my profile picture once (instrumental).mp3",
    dashboardVolume: 0.3,
  },

  /* ---------------- PART 2 — THE DASHBOARD ---------------- */
  nav: [
    { id: "about", label: "About Raizel" },
    { id: "dates", label: "Remember This Day?" },
    { id: "letters", label: "Letters For You" },
    { id: "numbers", label: "Us in Numbers" },
    { id: "radio", label: "Affectum Radio" },
    { id: "bucket", label: "Bucket List" },
    { id: "gallery", label: "Gallery" },
    { id: "playlist", label: "Playlist" },
    { id: "code", label: "Secret Surprise" },
  ],

  hero: {
    title: "Happy 19th Birthday, Raizel! 🎂❤️",
    subtitle: "from a boy who loves you very much! ~ Kafka",
    body: "In this special day, is all about you! So, to make it just a bit more special, please enjoy the small bits of joy I scattered throughout this page. I hope this makes your day just a bit more special, as you make my life as special ❤️",
    closing: "Enjoy!",
  },

  // Photo conveyor belt under the hero.
  // 👉 DROP FILES HERE: assets/photos/conveyor/  (e.g. "AFFECTUM CAROUSELS - 1.webp")
  // Any file that's missing is simply skipped, so nothing breaks before you add it.
  conveyorPhotos: [
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 1.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 2.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 3.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 4.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 5.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 6.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 7.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 8.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 9.webp", alt: "Us" },
    { src: "assets/photos/conveyor/AFFECTUM CAROUSELS - 10.webp", alt: "Us" },
  ],

  aboutHer: {
    title: "About Raizel",
    // "Generals" list. An item with `birthdate` shows her age, calculated live.
    generalsTitle: "Generals",
    // `emoji` shows next to each label. `birthdate` = age calculated live.
    generals: [
      { emoji: "💖", label: "Name", value: "Alaricia Raizel Avano" },
      { emoji: "🎂", label: "Age", birthdate: "2007-10-11" },
      { emoji: "👧", label: "Gender", value: "Girl" },
      { emoji: "✝️", label: "Faith", value: "Catholic" },
      { emoji: "♎", label: "Sign", value: "Libra" },
      { emoji: "🧠", label: "MBTI", value: "INFP" },
      { emoji: "🎓", label: "Student At", value: "Communication Science '25, Universitas Gadjah Mada" },
      { emoji: "🌍", label: "Member of", value: "AIESEC in UGM 25/26" },
    ],
    cards: [
      { label: "Her foods", value: "Meat 🍖" },
      { label: "Her drinks", value: "Baileys Coffee & anything milk" },
      { label: "Her dessert", value: "Dubai Chewy Cuki, Smoothie Bowls" },
      { label: "Her favorite artists", value: "Jhené Aiko, Mom Jeans, Modern Baseball, Drake, Future, Mac Miller, The Smashing Pumpkins, PARTYNEXTDOOR" },
      { label: "Her favorite anime/series", value: "NANA" },
      { label: "Her favorite celebrity", value: "Ryan Gosling" },
      { label: "Her favorite movies", value: "La La Land, Blue Valentine, Spider-Man: Into the Spider-Verse" },
      { label: "Her love language", value: "Physical Touch + Quality Time" },
    ],
  },

  /* "Remember This Day?" calendar — scrollable from `startMonth` to `endMonth` (YYYY-MM).
     Each event key is a date "YYYY-MM-DD". Tapping that day opens its popup.

     📸 PHOTOS: put each date's pictures in a folder named after the date, e.g.
        assets/photos/dates/3 JULY 2026/   (any file names, .jpg/.png/.webp/.heic-converted)
     The list of files is read from js/photo-manifest.js, which is rebuilt
     automatically on deploy (or run: node tools/build-photo-manifest.js).
     A date with no folder / no photos just shows its story — no error.
     To use a differently-named folder for a date, add  folder: "My Folder Name". */
  dates: {
    title: "Remember This Day?",
    intro: "Tap a highlighted day ❤️",
    startMonth: "2025-09",
    endMonth: "2026-10",
    weekStartsOn: 0, // 0 = Sunday, 1 = Monday
    photosRoot: "assets/photos/dates/",
    // Gold box on the calendar (the day we started dating)
    highlightDate: "2026-05-01",
    // Little heart on every day from this date through today
    togetherSince: "2026-05-01",
    events: {
      "2025-09-15": {
        title: "Where It All Started",
        story: "This is practically the first day we met! I mean, not technically, but this is the time when we first talked. It was such a bizarre moment looking back again at it.",
      },
      "2025-09-20": {
        title: "Took Some Time...",
        story: "Took some time, but this is when I realized that I, in fact, had a crush on you. Funny day! Kael was the first person who I told about it, so props to her 😭",
      },
      "2025-09-24": {
        title: "Our First Date",
        story: "I mean, for me, this was in fact our first date! It was at Zoomia, and I clearly remembered that I was nervous to the bones. But I'm glad that we met that day, and you even let me drive you to the band practice for KNP.",
      },
      "2025-09-26": {
        title: "First Flower",
        story: "My first EVER flower that I gave to YOU! It was my first ever bold move, even though you turned down the idea at first, I'm glad that you actually considered me at the time! Thank you! I'm happy I got to spend the night with you! 💐",
      },
      "2025-09-27": {
        title: "Compare Night",
        story: "First compare night! Jujur, this was probably the night where I was SUPER obvious to you (even orang orang aja pada sadar) haha. Such a cute pic ngl",
      },
      "2025-09-29": {
        title: "Honestly...",
        story: "I'm not gonna sugar coat it, my heart was crushed that night haha! Honestly, I was sobbing the whole night at my room right after I got home. I added this to the important dates to further emphasize that there are in fact bittersweet moments in our love story, and I don't wanna hide that. Whatever we went through was OUR journey, and I'm glad I got to experience it with you.",
      },
      "2025-10-12": {
        title: "Raizel's 18th Birthday Present",
        story: "This day was pretty sweet I would say, I had a nice ice cream with you and got you a tumbler for your birthday present (even though this was when I found out somebody was shooting his chances again, glad you turned it down tho lol). Honestly, I still find it cute that you still use the tumbler I gave you that day everyday as your daily bottle. Thank you yaa sayang. I maybe never mentioned it before, but I am super happy that you liked my present! ❤️🎁",
      },
      "2025-10-27": {
        title: "Our First DBL Date",
        story: "This is very cute, and surprisingly super MODUS. Astaga, you actually bela belain ke DBL just to watch it with me? Insane... but honestly, thank you tho! I was very happy that night.",
      },
      "2025-11-04": {
        title: "Kafka's 19th Birthday Present",
        story: "Gng you actually didn't believe me when I said that my birthday was on the third. Yet, you still took the effort to buy me a Tyler the Creator tee (I LOVED ITTTTTT). Makasih sayangg ❤️ I LOVE YOUUUUU... It's literally one of my favorite clothes of all time!!",
      },
      "2025-11-17": {
        title: "Kafka's Confession",
        story: "I genuinely had no picture of when I confessed. And again, NO SUGAR COATING, that day was bittersweet. I thought it would be the end of it all. I was planning to say whatever that was on my chest, and hope for the best. But that day, changed everything. Thank you for being so kind to me that day, and actually respect my feelings. I am so grateful you didn't make me feel more awful that I should've, but you actually made me feel a lot better ❤️",
      },
      "2025-11-25": {
        title: "Burger Date",
        story: "This date is super memorable for me, that's why I'm adding it to the important dates haha!",
      },
      "2025-11-30": {
        title: "Kula Nuwun Party",
        story: "Another bittersweet night. I don't have any picture of us, but that night, I gave you jedai, helped you with the fruit punch stall, got McDonalds and took you home. That night was super sweet. You even borrowed me your guitar, another sweet points! Agak heartbreaking sih haha when you told me \"tapi aku gak boleh kalau beda agama\". Yeah... agak nyesek gimana gituuu wkwkwkw",
      },
      "2025-12-01": {
        title: "Sicky Raizie Bagel Date",
        story: "I remember you weren't feeling well that day, and I took you here before driving you to the hospital to visit your grandpa. Honestly, this was the day when I was planning to do a photobooth with you. Welp, the machine was broken, oh well...",
      },
      "2025-12-14": {
        title: "The Day I Thought Everything Ended",
        story: "I sent you a long message the day before. I cried. I thought that was the day when everything would end. A holiday ended with a broken heart again, haha... I still remember I cried for hours to this message. It was a bitter way to close the year, but I'm glad you were one of the strongest aftertaste of my 2025.",
      },
      "2026-04-13": {
        title: "Our First Picnic Date (My Favorite Date of All Time)",
        story: "Quite a time skip huh? Yep, we both know the story, but this day was when I took the courage to actually take you out again. To this day, I can safely say, this was the best date I've ever had with anyone, ever. Yes, you read that right, this was my favorite date of all time! I love every moment about it. Thank you for making this date so sweet ❤️",
      },
      "2026-04-20": {
        title: "Our First Photobooth",
        story: "You said I was very touchy here haha, yaudah sihh wkkww, I was shooting my chances before anyone else gets you. And turns out, this was our first photobooth! You looked really pretty that day",
      },
      "2026-04-21": {
        title: "Our First Movie Date",
        story: "Dari sini sebenernya udah keliatan clingy nya kita, just the next day, we had our first movie date. Hail Mary will forever be my canon event 🎬",
      },
      "2026-04-28": {
        title: "A Lot Of Dates!",
        story: "We went to a lot of places together huh. Look! We even had our photobooth together again!",
      },
      "2026-05-01": {
        title: "The Start of Our Journey",
        story: "You held my hand, I held yours. We both know things that are hard to ignore, yet we still choose to go through it together. Thank you for choosing me, believing in me, and thank you for everything sayang ❤️",
      },
      "2026-05-25": {
        title: "Whoa? Flowers?",
        story: "Huh, siapa nih yang cantik2 ngasih aku bunga? HAHAHA you're super SWEET!",
      },
      "2026-06-29": {
        title: "Our First Conflict (I guess lol)",
        story: "Yeah I know, I was in the wrong. This picture was taken during our video call that night. Yes, I would count that this was in fact our first conflict. (your face looked really pissed 😭)",
      },
      "2026-07-03": {
        title: "First Artjog Date",
        story: "Our first Artjog date! Yayy!! Oh this was also when I realized how deeply in love I am with you btw. You looked really pretty that day, and honestly, you're genuinely the most interesting 'art' I saw that day. Thank you for spending the time with me and go out with me to Artjog sayang, I love you! 🎨",
      },
      "2026-07-13": {
        title: "Beach Date",
        story: "I COULDN'T BELIEVE IT!! We actually went on a beach date, something that I thought would be impossible. I was really happy that I got to spend time with you at the beach that day, it was really romantic, genuinely. ☀️",
      },
      "2026-07-22": {
        title: "Pizza Date",
        story: "Hell yeah! Pizzaaaaa!!!!! Another date where I actually planned a lot of things, but in the end, we still had so much fun!",
      },
      "2026-07-28": {
        title: "Uhm...",
        story: "It was... so unexpected... but thank you for that! haha!",
      },
      "2026-08-09": {
        title: "Photobooth?",
        story: "It seems like, uh.... we.... uhh.... yeah! Loved that, it was a really romantic night!",
      },
      "2026-08-29": {
        title: "GELEX n Reality Club Date",
        story: "HOLYYY, mimpi basah maba gw ke check list. What a date, GELEX date was reallyyyyyy nice. I had so much fun, and honestly as someone who never really go to concerts, I had so much fun watching Reality Club LIVE with you. Thank you for being so sweet, and honestly, this is officially one of my best canon events of all time.",
      },
      "2026-09-19": {
        title: "Another Compare Night",
        story: "Can't believe that it has been a year since we met. Thank you sayang, you're truly one of a kind. You've always been supportive, understanding, and very loving. Thank you for being there for me, and thank you for trusting me to be a partner for you. I will forever cherish our journey together ❤️",
      },
      "2026-09-26": {
        title: "Another DBL Date",
        story: "Astaga, kok ini gemas ahahahahah. Cuma bentar sih, but you were so pretty... :(",
      },
    },
  },

  // Letters — shown exactly as written. Blank lines = new paragraph.
  letters: {
    title: "Letters For You",
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
      {
        // Interactive card: she writes letters to her future self (saved on her phone)
        type: "journal",
        title: "A Note From The Future",
        icon: "🕊️",
        text: `Since I've been writing a lot about you, I want to give you the chance to write something about yourself. This letter is special because you can write a letter to your future self. Write something, not for anyone else, not for me, but for yourself. What will you tell yourself in 5 years time?`,
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
      happyDays: "Our Happy Days Together",
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
    title: "Gallery of My Favorite Pics",
    // 👉 DROP FILES HERE: assets/photos/gallery/  ("GALLERY - 1.webp" … "GALLERY - 10.webp")
    photos: [
      { src: "assets/photos/gallery/GALLERY - 1.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 2.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 3.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 4.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 5.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 6.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 7.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 8.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 9.webp", alt: "Raizel" },
      { src: "assets/photos/gallery/GALLERY - 10.webp", alt: "Raizel" },
    ],
  },

  playlist: {
    title: "Playlist",
    label: "Songs that sound like us 🎧",
    // Paste the Spotify playlist link, e.g. https://open.spotify.com/playlist/XXXX
    spotifyUrl: "",
  },

  code: {
    title: "Secret Surprise",
    intro: "Every gift comes with a secret code. Type one in to unlock its little story 🎁",
    placeholder: "Enter a code",
    wrong: "Hmm… that's not it. Try again 💭",
  },

  footer: "Made with a whole lot of love, by Kafka ❤️",
};
