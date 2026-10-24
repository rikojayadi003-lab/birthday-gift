// =====================================================================
// BIRTHDAY DATA
// ---------------------------------------------------------------------
// INI SATU-SATUNYA FILE YANG PERLU KAMU EDIT untuk personalisasi:
// nama, tanggal, pesan, foto, caption, timeline, musik, dan warna.
//
// Tips:
// - Teks boleh pakai token ini, nanti otomatis diganti:
//     {name}      -> nama lengkap penerima   (Penti Gadis Juwita)
//     {firstName} -> nama depan              (Penti)
//     {nickname}  -> panggilan sayang        (Sayangkuu)
//     {sender}    -> nama pengirim           (Mas Riko)
//     {signature} -> tanda tangan            (Riko Jayadi)
//     {date}      -> tanggal ulang tahun     (25 Oktober 2026)
// - "\n" artinya pindah baris.
// - Nama yang ditulis HURUF BESAR semua otomatis ditampilkan rapi
//   (PENTI GADIS JUWITA -> Penti Gadis Juwita).
// - Jangan hapus tanda kutip, koma, atau kurung kurawal.
// =====================================================================

window.birthdayData = {

  // ---------- IDENTITAS ----------
  pageTitle: "Happy Birthday, {firstName} 🎂",   // judul tab browser
  recipientName: "PENTI GADIS JUWITA",
  firstName: "",                // kosongkan = otomatis kata pertama dari recipientName
  nickname: "Sayangkuu",        // dipakai di bagian penutup
  senderName: "MAS RIKO",
  senderSignature: "RIKO JAYADI",

  // ---------- TANGGAL ----------
  birthdayDate: "25 Oktober 2026",              // teks yang ditampilkan
  // Untuk countdown. Format: TAHUN-BULAN-TANGGAL T JAM:MENIT:DETIK + zona waktu
  // +07:00 = WIB. WITA = +08:00, WIT = +09:00
  birthdayISO: "2026-10-25T00:00:00+07:00",

  // ---------- WARNA (palet soft pink) ----------
  colors: {
    pink:  "#D98FA3",   // Primary Pink
    rose:  "#B96F86",   // Dusty Rose
    blush: "#F3D5DD",   // Blush Pink
    cream: "#FFF8F3",   // Soft Cream
    white: "#FFFFFF",   // Warm White
    mauve: "#9B788D",   // Muted Mauve
    ink:   "#765D61",   // Soft Brown (warna teks)
    gold:  "#D5B58A"    // Muted Gold (aksen kecil)
  },

  // ---------- 0. COVER / OPENING ----------
  cover: {
    eyebrow: "Hey, kamu...",
    title: "Someone left you\na little surprise",
    cardTo: "Untuk",              // tulisan kecil di kartu dalam amplop
    cardFrom: "dari {sender}",
    button: "Open Your Gift",
    hint: "atau ketuk amplopnya"
  },

  // ---------- 1. GREETING ----------
  greeting: {
    kicker: "{date}",
    title: "Happy Birthday,",     // nama penerima otomatis muncul setelah ini
    emoji: "🎂",
    subtitle: "hari ini adalah tentang kamu.",
    countdownLabel: "sampai hari spesialmu",
    countdownUnits: { days: "DAYS", hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS" },
    todayText: "Today is your special day! 🎂",
    scrollHint: "scroll pelan-pelan ya"
  },

  // ---------- 2. PESAN PEMBUKA ----------
  mainMessage: {
    label: "01 · Untukmu",
    title: "Sebelum kamu scroll lebih jauh…",
    lines: [
      "Aku bikin ini bukan karena harus,\ntapi karena aku ingin kamu tahu\nbetapa berartinya kamu.",
      "Ulang tahun cuma satu hari,\ntapi rasa sayangku buat kamu\ntidak pernah libur.",
      "Jadi pelan-pelan aja ya.\nAda banyak hal kecil yang sengaja\naku simpan di bawah sini."
    ]
  },

  // ---------- 3. FOTO KENANGAN (polaroid) ----------
  // Taruh file di assets/images/ . Boleh tambah/kurangi jumlah foto.
  // Kalau file belum ada, otomatis muncul gambar placeholder pink.
  memories: {
    label: "02 · Kenangan",
    title: "Potret kecil, rasa yang besar",
    hint: "ketuk fotonya, ada catatan kecil di baliknya",
    tapHint: "ketuk aku",
    // sudut miring tiap foto (derajat), diulang kalau fotonya lebih banyak
    rotations: [-5, 4, -3, 5, -4, 3]
  },
  photos: [
    { src: "assets/images/photo-01.jpg", alt: "Foto kenangan pertama",  caption: "our first photo" },
    { src: "assets/images/photo-02.jpg", alt: "Foto kenangan kedua",    caption: "one of my favorite days" },
    { src: "assets/images/photo-03.jpg", alt: "Foto kenangan ketiga",   caption: "you looked so happy here" },
    { src: "assets/images/photo-04.jpg", alt: "Foto kenangan keempat",  caption: "kamu, apa adanya" }
  ],

  // ---------- 4. TIMELINE ----------
  // GANTI isinya dengan cerita kalian yang sebenarnya.
  timeline: {
    label: "03 · Perjalanan",
    title: "Sedikit cerita tentang kita...",
    endText: "to be continued…",
    items: [
      {
        date: "2024",
        title: "First time we met",
        caption: "Hari yang kelihatannya biasa, ternyata jadi awal dari banyak hal baik.",
        photo: "assets/images/photo-01.jpg",
        alt: "Foto saat pertama bertemu"
      },
      {
        date: "2025",
        title: "Our first special moment",
        caption: "Salah satu hari yang paling ingin aku ulang.",
        photo: "assets/images/photo-02.jpg",
        alt: "Foto momen spesial pertama"
      },
      {
        date: "2026",
        title: "Still making memories",
        caption: "Dan aku masih ingin menambah satu cerita lagi, bareng kamu.",
        photo: "assets/images/photo-03.jpg",
        alt: "Foto kenangan terbaru"
      }
    ]
  },

  // ---------- 5. SURAT ----------
  letter: {
    label: "04 · Surat",
    envelopeTitle: "A little letter for you",
    envelopeHint: "ketuk untuk membuka",
    openedHint: "baca pelan-pelan ya ↓",
    salutation: "Untuk {firstName},",
    paragraphs: [
      "Selamat ulang tahun, ya. Semoga di umur yang baru ini kamu makin bahagia, makin sehat, dan makin dikelilingi orang-orang yang tulus sama kamu.",
      "Terima kasih sudah jadi kamu: yang hangat, yang sabar, yang bikin hari-hariku terasa lebih ringan. Hal-hal kecil dari kamu, yang mungkin kamu sendiri tidak sadar, sering jadi alasan aku tersenyum.",
      "Aku tidak janji bisa jadi sempurna, tapi aku janji akan terus berusaha ada buat kamu, di hari yang cerah maupun yang berat.",
      "Semoga semua doa dan harapanmu tahun ini pelan-pelan jadi nyata. Dan kalau boleh, izinkan aku jadi salah satu orang yang ikut merayakannya."
    ],
    closing: "Dengan sayang,",
    signature: "{sender}"
  },

  // ---------- 6. KUE ULTAH ----------
  cake: {
    label: "05 · Make a wish",
    title: "Make a wish 🎂",
    hint: "ketuk lilinnya, atau tekan tombol di bawah",
    button: "Make a Wish",
    doneText: "Your wish is on its way ✨",
    relight: "nyalakan lagi"
  },

  // ---------- 7. PENUTUP ----------
  final: {
    label: "06 · Untukmu, selalu",
    photo: "assets/images/photo-best.jpg",       // foto terbaik
    photoAlt: "Foto terbaik kita",
    title: "Happy Birthday,",
    heart: "❤️",
    message: "Thank you for being part of my life.",
    signature: "— {signature}",
    replayButton: "Replay the Surprise"
  },

  // ---------- EASTER EGG (hati emas kecil di ujung timeline) ----------
  easterEgg: {
    ariaLabel: "Ada satu kejutan lagi",
    title: "One more thing...",
    message: "I love you more than words can explain ❤️",
    small: "Makasih sudah ada.",
    close: "Tutup"
  },

  // ---------- MUSIK ----------
  // Taruh file di assets/music/ . Kosongkan src ("") kalau tidak ingin musik.
  music: {
    src: "assets/music/birthday-song.mp3",
    volume: 0.55           // 0.0 (hening) sampai 1.0 (penuh)
  }
};
