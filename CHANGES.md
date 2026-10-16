# 04-intro-motion

Intro versi motion graphics, tanpa font italic. Scene lain tidak disentuh.
Pasang SETELAH 01, 02, 03 (timeline.ts di sini sudah memuat durasi Problem 7,2 dtk dari 03).

## File BARU
- `src/components/MaskText.tsx` : teks kata demi kata, tiap kata naik dari balik garis potong (blur 8px -> 0, stagger 0,09 dtk).

## File DIUBAH
- `src/scenes/IntroScene.tsx` : ditulis ulang.
- `src/timeline.ts` : `SCENE_SEC.intro` 5.4 -> 5.9 dtk (total video 2595 frame = 86,5 dtk).

## File yang harus DIHAPUS manual
Tidak ada.

## Perintah
```
npx tsc --noEmit
npm run dev
```

## Isi animasi (detik dalam scene)
| Waktu | Kejadian |
|---|---|
| 0,0 | Latar vwBlue + glow lightBlue + 5 bokeh lembut menyala pelan, lalu "bernapas" |
| 0,2 | Logo mekar dari lingkaran (clip circle + scale 0,82 -> 1 + blur 12px -> 0), soft thud |
| 0,35 / 0,5 | Dua cincin tipis lightBlue memancar keluar dari logo |
| 0,9 | "Proses Servis" naik kata demi kata (putih), swipe pelan |
| 1,08 | "Kendaraan Anda" menyusul (lightBlue, aksen lewat WARNA bukan italic) |
| 1,7 | Subtitle naik dari balik garis potong |
| 0,2-5,0 | Kamera mendorong sangat pelan (1,0 -> 1,035), latar bergerak setengahnya (paralaks) |
| 5,0-5,5 | Teks sudah selesai dibaca: kamera mendorong masuk (1,035 -> 1,235) dengan blur 0 -> 10px |
| 5,5 | Sweep ke scene Problem (mulai tepat saat dorongan selesai) |

## Perubahan dari versi 02
- Hapus penggunaan Instrument Serif Italic di Intro. Font hanya Poppins (800 untuk judul, 500 untuk subtitle).
- Durasi 5,4 -> 5,9 dtk: dorongan kamera keluar butuh 0,5 dtk yang terlihat SEBELUM sweep. Teks harus diam sampai 5,0 dtk
  (subtitle 6 kata, min 2,7 dtk), jadi dorongan tidak bisa dimajukan.
- Teks (isi) tidak berubah dari versi 02.

## Cue efek suara
| Momen | Suara | Waktu | Volume |
|---|---|---|---|
| Logo mekar | thud | 0,2 | 0,45 |
| Judul masuk | swipe | 0,9 | 0,22 |
| Transisi ke Problem | whoosh | otomatis dari ServiceFlow | 0,35 |

## Pemeriksaan
- `npx tsc --noEmit` dan ESLint bersih. Tidak ada Math.random, setTimeout, CSS animation, atau angka frame mentah.
- 13 still diperiksa (0,3 sampai 5,6 dtk): tidak ada tumpang tindih, teks tidak terpotong.
- Pratinjau MP4 frame 0-239 dirender; trek AAC ada; onset suara cocok (thud 0,2 dtk).
- Durasi composition: 2595 frame.

## Kontras dengan MOTION-DESIGN.md (keputusan Anda)
- Bagian 4 mewajibkan satu kata aksen serif italic per judul. Instruksi Anda menghapusnya, jadi saya ikuti Anda.
  MOTION-DESIGN.md belum saya ubah (itu file Anda); sebaiknya bagian 4 dan 6.2 Anda perbarui.
- Dorongan kamera keluar 1,035 -> 1,235 dengan blur 10px: ini zoom yang lebih tegas daripada "zoom in tanpa zoom out" di
  scene HP, tetapi hanya 0,5 dtk dan dipakai sebagai transisi. Kalau dianggap terlalu agresif (bagian 10), ubah `EXIT_PUSH`.
- Gerakan latar (glow bernapas, bokeh, dolly) dan teks yang bergerak sangat pelan tetap ada selama teks dibaca.
  Ini sengaja (kamera hidup), bukan teks yang "bergerak" sebagai animasi.

## Belum diuji
- Font Google Fonts tidak bisa dimuat di lingkungan saya; visual diuji dengan font lokal yang sama.
- Bunyi thud dan swipe belum saya dengar.
- Render penuh dan performa render di mesin Anda (bokeh dan vignette memakai gradient CSS, bukan filter blur besar, supaya ringan).
