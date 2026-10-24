# 🎁 Digital Birthday Gift

Website ulang tahun interaktif (HTML + CSS + JS murni, tanpa build, tanpa library).

## 1. Analisis referensi
Video TikTok (`@kadovirtual.co/…/7678416057379343637`) **tidak bisa diakses** (TikTok memblokir akses otomatis), jadi detail visual berikut ditandai **[NEED REFERENCE]** dan TIDAK dikarang:
- [NEED REFERENCE] bentuk persis amplop/kartu/gift di video
- [NEED REFERENCE] font asli, urutan section asli, jenis transisi, posisi/gaya foto
- [NEED REFERENCE] lagu & momen musik mulai
**Cara kirim:** 5–8 screenshot (cover, section tiap scroll, saat interaksi) atau screen recording. Setelah itu tampilan bisa dicocokkan.

## 2. Arah desain (dari brief, bukan dari video)
- **Visual:** soft pink romantis, scrapbook + surat digital. Glass tipis, bayangan lembut, aksen emas kecil.
- **Palet:** Primary Pink `#D98FA3`, Dusty Rose `#B96F86`, Blush `#F3D5DD`, Cream `#FFF8F3`, White `#FFF`, Mauve `#9B788D`, Teks `#765D61`, Gold `#D5B58A`.
- **Font (3):** Playfair Display (judul elegan), Caveat (tulisan tangan), Nunito (isi, mudah dibaca di HP).
- **Animasi:** hanya `transform` + `opacity`, easing `cubic-bezier(.22,1,.36,1)`, confetti canvas hanya di momen penting.

## 3. User flow
OPEN (amplop) → tap **Open Your Gift** → amplop terbuka + confetti + musik mulai → **Greeting** (typing + countdown) → **Pesan** (baris bergantian) → **Foto** (polaroid, ketuk = caption) → **Timeline** → **Surat** (ketuk amplop) → **Kue** (tiup lilin) → **Final** + confetti → **Replay**. Easter egg: hati emas kecil di bagian foto.

## 4. Struktur folder
```
birthday-gift/
├── index.html      kerangka halaman
├── style.css       tampilan & animasi
├── script.js       logika (jangan perlu diubah)
├── data.js         ⭐ SEMUA konten ada di sini
└── assets/
    ├── images/     photo-01.jpg, photo-02.jpg, ...
    ├── music/      birthday-song.mp3
    └── icons/
```

## 5–7. Instalasi & menjalankan lokal
Tidak perlu install apa pun. Klik dua kali `index.html`, atau:
```
cd birthday-gift
python -m http.server 8000     # buka http://localhost:8000
```
(Foto kosong otomatis diganti placeholder pink "Ganti foto ini".)

## 8–12. Cara mengganti (semua di `data.js`)
| Yang diganti | Field |
|---|---|
| Nama | `recipientName`, `recipientShortName`, `nickname`, `senderName`, `signatureName` |
| Tanggal | `birthdayDate` (teks) + `birthdayISO` (`YYYY-MM-DD`, untuk countdown) |
| Foto | taruh file di `assets/images/`, lalu ubah `photos[]`, `timeline[].photo`, `finalPhoto`. Caption di `caption`. Ukuran ideal ≤ 1200px, < 300 KB |
| Musik | taruh `.mp3` di `assets/music/`, ubah `music` |
| Pesan | `mainMessage[]`, `loveLetter[]` (tiap item = 1 paragraf), `finalMessage`, `easterEgg` |
| Warna | objek `colors` |
| Timeline | array `timeline` (date, title, caption, photo) |

## 13. Deploy ke Vercel
1. Upload folder ke GitHub (repo baru).
2. vercel.com → **Add New → Project** → pilih repo.
3. Framework Preset: **Other**, tanpa build command. **Deploy**.
(Atau: `npm i -g vercel` → `vercel` di dalam folder.) Kirim link `.vercel.app` ke WhatsApp.

## 14. Checklist testing mobile
- [ ] Lebar 320 / 375 / 390 / 414 / 768 / 1024 / 1440: tidak ada scroll horizontal
- [ ] Tombol Open Your Gift jalan; musik mulai setelah tap (iPhone & Android)
- [ ] Tombol 🎵 (play/pause) dan 🔊 (mute) berfungsi
- [ ] Countdown benar; setelah tanggal lewat berubah jadi "Today is your special day"
- [ ] Foto tampil tidak gepeng; ketuk polaroid memunculkan caption
- [ ] Surat terbuka, teks nyaman dibaca
- [ ] Lilin bisa ditiup satu-satu & lewat tombol; confetti + balon muncul
- [ ] Hati emas (easter egg) membuka modal, bisa ditutup
- [ ] Replay kembali ke amplop
- [ ] Mode "Reduce Motion" di pengaturan HP: animasi berkurang
- [ ] Scroll terasa mulus, tidak patah-patah
