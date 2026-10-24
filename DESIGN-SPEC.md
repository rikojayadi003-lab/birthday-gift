# Design Specification — Digital Birthday Gift

Dokumen ini dibuat SEBELUM coding. Isinya arah visual, alur, animasi, tipografi,
warna, dan hierarki section. Kalau nanti kamu kirim screenshot/rekaman layar
video referensi, bagian bertanda **[NEED REFERENCE]** bisa disesuaikan.

---

## 1. Analisis referensi

**Status akses video:** video TikTok
(`@kadovirtual.co/video/7678416057379343637`) **tidak bisa dibuka** — TikTok
memblokir akses otomatis. Jadi tidak ada satu pun detail visual dari video yang
aku klaim "sudah dilihat".

Yang bisa disimpulkan dari URL saja: akunnya bernama *kadovirtual.co*, artinya
genre-nya adalah "kado virtual" (hadiah digital berbentuk website). Itu selaras
dengan arahan di brief: halaman terasa seperti *membuka hadiah*, bukan landing
page.

| Aspek dari video | Status | Keputusan sementara |
|---|---|---|
| Alur pembukaan | [NEED REFERENCE] | Pakai alur dari brief: cover → buka amplop → greeting |
| Urutan section | [NEED REFERENCE] | Pakai 11 langkah dari brief (digabung jadi 8 chapter) |
| Bentuk objek hadiah (amplop / box / kartu) | [NEED REFERENCE] | Amplop (pilihan pertama di brief) |
| Font asli yang dipakai | [NEED REFERENCE] | Cormorant Garamond + Caveat + Nunito |
| Gaya transisi antar bagian | [NEED REFERENCE] | Scroll-reveal fade/blur/slide, halus |
| Cara foto ditampilkan | [NEED REFERENCE] | Polaroid scrapbook (opsi dari brief) |
| Efek hati/bintang/partikel | [NEED REFERENCE] | Hati, sparkle, bunga kecil melayang pelan |
| Musik (lagu, kapan mulai) | [NEED REFERENCE] | Mulai saat "Open Your Gift" ditekan |
| Warna | Dari brief (palet soft pink) | Ikuti palet yang kamu tentukan |

**Yang perlu kamu kirim supaya bisa disamakan dengan video:**
1. Screenshot layar pembuka (sebelum & sesudah dibuka).
2. Screenshot tiap section saat scroll (minimal 1 per section).
3. Rekaman layar yang menunjukkan animasi saat tombol/amplop ditekan.
4. Kalau tahu: nama font di video.

---

## 2. Visual direction

Konsep: **surat cinta digital + scrapbook**. Hangat, lembut, personal.

- Kertas, amplop, polaroid, pita washi-tape emas → kesan benda nyata.
- Kaca buram ringan (glassmorphism) hanya untuk kartu, bukan di mana-mana.
- Dekorasi bergerak sangat pelan, jumlahnya sedikit, tidak menutupi teks.
- Banyak ruang kosong (whitespace) agar terasa tenang, bukan ramai.
- Bukan: navbar, hero bisnis, dashboard, grid galeri, template Bootstrap.

## 3. User flow

```
OPEN        Cover: "Hey, kamu..." + amplop + tombol "Open Your Gift"
  ↓ tap
DISCOVER    Amplop terbuka, kartu naik, confetti + hati, musik mulai
  ↓
GREETING    "Happy Birthday, <Nama>" muncul kata per kata + countdown
  ↓ scroll
READ        Pesan pembuka (baris muncul satu-satu, blur → jernih)
  ↓
REMEMBER    Polaroid (tap = caption) → Timeline vertikal
  ↓
INTERACT    Surat (tap amplop → surat terbuka) → Kue (tiup lilin)
  ↓
SURPRISE    Easter egg: hati emas kecil di ujung timeline → modal
  ↓
CLOSING     Foto terbaik + pesan akhir + tanda tangan + "Replay the Surprise"
```

Pembeda dari "OPEN → SCROLL → READ": ada 4 interaksi wajib (buka amplop, tap
foto, buka surat, tiup lilin) + 1 tersembunyi.

## 4. Section hierarchy

| # | Chapter | Fungsi | Interaksi |
|---|---|---|---|
| 0 | Cover | Hook & izin autoplay musik | Tap amplop / tombol |
| 1 | Greeting | Momen emosional pertama | Countdown live |
| 2 | Pesan | Konteks personal | Scroll reveal |
| 3 | Kenangan | Foto | Tap foto → caption |
| 4 | Perjalanan | Timeline | Scroll reveal; hati emas = easter egg |
| 5 | Surat | Pesan panjang | Tap amplop |
| 6 | Make a wish | Permainan kecil | Tiup lilin → confetti + balon |
| 7 | Penutup | Emosional closing | Replay |

## 5. Animation direction

- Hanya `transform`, `opacity`, `filter: blur` (sesekali) → ringan di HP.
- Easing: `cubic-bezier(.22,.8,.24,1)` (keluar cepat, berhenti lembut).
- Reveal: fade-up, blur-to-clear, scale-in; stagger 110–180 ms.
- Confetti: Canvas 2D buatan sendiri, hanya di 4 momen (buka hadiah, greeting,
  tiup lilin, penutup) lalu berhenti total — tidak looping.
- Elemen melayang: 10–16 item, CSS keyframes, tanpa JS per-frame.
- `prefers-reduced-motion`: animasi dipersingkat, confetti/balon/floaters mati.

## 6. Typography

| Peran | Font | Alasan |
|---|---|---|
| Judul, kutipan | Cormorant Garamond (italic) | Elegan, romantis |
| Nama, surat, caption | Caveat | Tulisan tangan, mudah dibaca di HP |
| Isi / label kecil | Nunito | Bersih, bulat, ramah |

Hanya 3 font. Ukuran pakai `clamp()` agar pas dari 320px sampai 1440px.

## 7. Color palette (soft pink aesthetic)

| Nama | Hex | Dipakai untuk |
|---|---|---|
| Primary Pink | `#D98FA3` | Aksen utama, hati, confetti, garis timeline |
| Dusty Rose | `#B96F86` | Tombol, ikon, heading kecil |
| Blush Pink | `#F3D5DD` | Border, amplop, background kartu, polaroid placeholder |
| Soft Cream | `#FFF8F3` | Background dasar, kertas surat |
| Warm White | `#FFFFFF` | Kartu, polaroid, kue |
| Muted Mauve | `#9B788D` | Variasi gradient, label |
| Soft Brown | `#765D61` | Semua teks isi (kontras ±5.5:1 di atas cream) |
| Muted Gold | `#D5B58A` | Aksen kecil: washi tape, segel, hati rahasia, sparkle |

Aturan kontras: teks kecil memakai Soft Brown atau versi lebih gelap dari
Rose/Mauve (dihitung otomatis di JS). Pink terang & gold **tidak** dipakai
untuk teks kecil. Tidak ada hot pink / neon.
