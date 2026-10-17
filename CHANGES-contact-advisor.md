# Contact Advisor scene (rework)

## File BARU
- `src/components/WhatsAppChatMock.tsx` : mockup chat WhatsApp + layar panggilan masuk.

## File DIUBAH
- `src/scenes/ContactAdvisorScene.tsx` : ditulis ulang (latar putih, teks navy kata demi kata, HP langsung setengah seperti scene Payment).
- `src/components/ServiceAdvisorMock.tsx` : ditulis ulang (kartu SA + halaman Estimation/Workshop mengikuti web asli, data pesan).
- `src/timeline.ts` : `SCENE_SEC.contact` 8 -> 23.4 dtk.

## Urutan (detik dalam scene)
| Waktu | Kejadian |
|---|---|
| 0,3 | Judul "Hubungi Service Advisor Kapan Saja" naik kata demi kata, lalu ke atas |
| 1,2-3,2 | HP setengah naik dari bawah (tanpa full HP di awal) |
| 4,4-5,3 | Kartu SA zoom, sisanya blur |
| 6,5 | Tombol Send Message diketuk |
| 8,1-9,5 | HP membesar jadi layar video penuh, berubah jadi WhatsApp |
| 9,9-12,7 | Template pesan diketik, lalu 13,2 diketuk kirim |
| 14,7-16,7 | SA "mengetik...", balasan muncul |
| 19,4 | Panggilan masuk dari SA + teks "Service Advisor akan menghubungi Anda secepatnya" |

## Data yang bisa diganti (ServiceAdvisorMock.tsx > SERVICE_ADVISOR_DEMO)
name, customerName, workOrder, message, reply, callCaptionLines.
Pesan = template `saMessage` dari InspectionReport.jsx.

## Perintah
```
npx tsc --noEmit
npm run dev
```
