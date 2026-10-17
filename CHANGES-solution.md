# Revisi Solution scene

Ekstrak zip ini di root project (menimpa file lama), lalu `npm run dev`.

## File DIUBAH
- `src/scenes/SolutionScene.tsx`
- `src/components/InspectionReportMock.tsx`
- `src/timeline.ts` : `SCENE_SEC.solution` 29 -> 15,4 dtk (total video 144,3 -> 130,7 dtk)

## Isi perubahan
1. Komponen muncul MENGIKUTI scroll. Progres reveal dihitung dari `scrollY` dan posisi tiap blok
   (`REVEAL_TOP`, diukur dari layout asli), bukan dari timer/spring terpisah, jadi selalu selaras.
   Blok di layar awal muncul berurutan 0,07 dtk. Scroll 22 dtk -> 9,5 dtk.
2. Tidak ada zoom 2,33x lagi. HP langsung memenuhi layar (skala 1,74, tinggi 1844 dari 1920 px), tidak terpotong.
3. Semua timing Solution scene ditulis dalam detik lewat `sec()`. Blur gerak vertikal halus saat scroll
   cepat supaya tidak patah-patah di 30 fps. FPS global tidak diubah.
4. Scroll sekarang berhenti di sisi bawah kartu Workshop location yang sebenarnya (y=3870).
   Sebelumnya berhenti di 3450 sehingga tombol "Book a service" terpotong.

## Jika isi kartu di InspectionReportMock berubah tinggi
Ukur ulang angka `REVEAL_TOP` dan `REPORT_WORKSHOP_BOTTOM`.
