# Scene Booking (baru, setelah Contact Advisor, sebelum Closing)

## File BARU
- src/scenes/BookingScene.tsx
- src/components/BookingMock.tsx (halaman status Completed: Invoice, kotak Thank You, ERA, "Book your next service", SA, Workshop; template chat + balasan)

## File DIUBAH
- src/components/WhatsAppChatMock.tsx : prop `content` opsional (nama kontak, inisial, pesan, balasan, jam). Default tetap Service Advisor, scene Contact tidak berubah.
- src/components/ServiceAdvisorMock.tsx : `WorkshopCard` di-export.
- src/timeline.ts : tambah `booking: 23` dtk dan urutan scene.
- src/ServiceFlow.tsx : daftarkan scene booking (transisi fadeScale).

## Alur (frame lokal, 30 fps)
0-124 judul "Servis Berikutnya, Booking dengan Mudah" lalu naik; 36-96 HP naik; 132-242 kotak Thank You melayang di tengah, sekitar blur, teks "Satu Ketukan, Langsung Booking"; 196 tap Book your next service; 244-284 HP membesar jadi WhatsApp "Admin VW PIK"; 298-382 ketik pesan; 396 kirim; 416/432 centang; 440 mengetik; 500 balasan; 566-588 chat menghilang; 594 slogan "Booking Servis, Mudah dan Cepat" di halaman putih.

Catatan: di web asli tombol booking hanya membuka wa.me tanpa teks, jadi pesan dan balasan dibuat khusus untuk video. Nomor ERA di mock adalah placeholder.
