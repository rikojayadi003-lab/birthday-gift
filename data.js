// ==========================================================
// BIRTHDAY DATA  —  Edit HANYA file ini untuk personalisasi
// (nama, pesan, tanggal, foto, lagu, warna, timeline)
// ==========================================================
const birthdayData = {
  // ---------- Identitas ----------
  recipientName: "PENTI GADIS JUWITA", // nama lengkap penerima (otomatis jadi huruf kapital di awal kata)
  recipientShortName: "Penti",         // nama panggilan (dipakai di amplop & teks akrab)
  nickname: "Sayangkuu",               // panggilan sayang di bagian penutup
  senderName: "MAS RIKO",              // dipakai di teks "dari ..."
  signatureName: "Riko Jayadi",        // tanda tangan di akhir

  // ---------- Tanggal ----------
  birthdayDate: "25 Oktober 2026",     // teks yang ditampilkan
  birthdayISO: "2026-10-25",           // format YYYY-MM-DD (dipakai countdown)

  // ---------- Opening ----------
  openingText: "Hey, sayangkuw... ada kejutan kecil yang menunggumu.",
  openButtonText: "Open Your Gift",
  envelopeCardText: "for you",

  // ---------- Birthday greeting ----------
  greetingSub: "hari ini adalah tentang kamu.",

  // ---------- Pesan utama (tiap item = satu baris yang muncul bergantian) ----------
  mainMessage: [
    "Aku nggak jago bikin kejutan.",
    "Tapi untuk kamu, aku mau coba.",
    "Jadi scroll pelan-pelan ya, ini semua cerita kecil untukmu."
  ],

  // ---------- Foto kenangan (taruh file di assets/images/) ----------
  photosTitle: "Memory Cards",
  photosSub: "ketuk fotonya satu-satu ✨",
  photos: [
    { src: "assets/images/photo-01.jpg", alt: "Foto kita yang pertama",    caption: "our first photo" },
    { src: "assets/images/photo-02.jpg", alt: "Salah satu hari favoritku", caption: "one of my favorite days" },
    { src: "assets/images/photo-03.jpg", alt: "Kamu terlihat bahagia",     caption: "you looked so happy here" },
    { src: "assets/images/photo-04.jpg", alt: "Kenangan manis kita",       caption: "i keep this one close" }
  ],

  // ---------- Timeline ----------
  timelineTitle: "Sedikit cerita tentang kita...",
  timeline: [
    { date: "2024", title: "First time we met",        caption: "Hari itu aku belum tahu, kamu bakal jadi orang yang penting.", photo: "assets/images/photo-01.jpg" },
    { date: "2025", title: "Our first special moment", caption: "Momen sederhana yang pelan-pelan jadi favoritku.",              photo: "assets/images/photo-02.jpg" },
    { date: "2026", title: "Still making memories",    caption: "Dan aku mau terus bikin cerita baru sama kamu.",                photo: "assets/images/photo-03.jpg" }
  ],

  // ---------- Surat ----------
  letterTitle: "A little letter for you 💌",
  letterHint: "ketuk amplopnya",
  loveLetter: [
    "Untuk Penti,",
    "Selamat ulang tahun cintaku. Semoga umur yang baru ini ngasih kamu lebih banyak tawa, lebih banyak tenang, dan lebih banyak hal baik yang pantas kamu dapat.",
    "Terima kasih sudah jadi kamu: sabar, hangat, dan bikin hari-hariku terasa lebih ringan. Hal-hal kecil darimu sering jadi hal yang paling aku ingat.",
    "Aku nggak bisa janji semuanya selalu mudah, tapi aku mau selalu ada di sisimu. Hari ini dan seterusnya.",
    "Dengan sayang,"
  ],

  // ---------- Kue ----------
  cakeTitle: "Make a wish 🎂",
  cakeHint: "tiup lilinnya, atau tekan tombolnya",
  cakeButton: "Make a Wish",
  cakeDone: "Your wish is on its way ✨",

  // ---------- Final ----------
  finalPhoto: { src: "assets/images/photo-05.jpg", alt: "Foto terbaik kita" },
  finalMessage: "Thank you for being part of my life.",
  replayText: "Replay the Surprise",

  // ---------- Easter egg (hati emas kecil di bagian foto) ----------
  easterEgg: {
    title: "One more thing...",
    message: "I love you more than words can explain ❤️",
    close: "Tutup"
  },

  // ---------- Musik (file di assets/music/) ----------
  music: "assets/music/birthday-song.mp3",

  // ---------- Warna (soft pink aesthetic) ----------
  colors: {
    pink:  "#D98FA3",  // Primary Pink
    rose:  "#B96F86",  // Dusty Rose
    blush: "#F3D5DD",  // Blush Pink
    cream: "#FFF8F3",  // Soft Cream
    white: "#FFFFFF",  // Warm White
    mauve: "#9B788D",  // Muted Mauve
    text:  "#765D61",  // Soft Brown (teks)
    gold:  "#D5B58A"   // Muted Gold (aksen kecil)
  }
};
