# Animasi teks seragam (per kata, bounce, rata tengah)

## File BARU
- src/components/WordLines.tsx : komponen animasi teks standar (sama dengan Solution scene).

## File DIUBAH
- src/scenes/StatusShowcaseScene.tsx : judul "4 Status, Terpantau Real-Time" mulai di TENGAH layar lalu naik; tiap label status (Sedang Dikerjakan, dst.) muncul kata demi kata.
- src/scenes/IntroScene.tsx : huruf demi huruf -> kata demi kata.
- src/scenes/ClosingScene.tsx : huruf demi huruf -> kata demi kata.
- src/scenes/PriceTransparencyScene.tsx : 3 teks sekunder (instruksi, ringkasan, kirim) per kata.
- src/scenes/PaymentUploadScene.tsx : 3 teks melayang per kata.
- src/scenes/ContactAdvisorScene.tsx : teks "Satu Ketukan, ..." per kata.

Durasi scene dan timeline.ts tidak berubah. tsc dan eslint bersih.
