// Durasi scene dalam DETIK. Total composition dihitung dari sini
// (jumlah durasi scene dikurangi tumpang tindih transisi).
import { sec } from "./theme";

export const TRANSITION_SEC = 0.4;

export const SCENE_SEC = {
  intro: 5.9, // 2 -> 5.9 dtk: aturan baca (bagian 5) + dorongan kamera keluar 0,5 dtk sebelum sweep
  problem: 7.2, // 4 -> 7.2 dtk: tiga kartu harus diam sesuai aturan baca (bagian 5)
  solution: 15.4, // 29 -> 15.4 dtk: HP penuh layar tanpa zoom, scroll 9,5 dtk dengan reveal terikat scroll
  status: 13,
  video: 8,
  repair: 10,
  price: 23, // 11 -> 23 dtk: judul, approve/reject, order summary melayang, submit + konfirmasi
  payment: 22, // 9 -> 22 dtk: judul, payment details, rekening, upload bukti
  contact: 23.4, // 8 -> 23.4 dtk: kartu zoom, chat WhatsApp (ketik, balasan), panggilan masuk
  closing: 6.4, // 4 -> 6.4 dtk: teks huruf demi huruf (seperti Intro) perlu selesai dan ditahan
} as const;

export type SceneKey = keyof typeof SCENE_SEC;
export const SCENE_ORDER: SceneKey[] = [
  "intro",
  "problem",
  "solution",
  "status",
  "video",
  "repair",
  "price",
  "payment",
  "contact",
  "closing",
];

export const TRANSITION_FRAMES = sec(TRANSITION_SEC);

export const sceneFrames = (key: SceneKey): number => sec(SCENE_SEC[key]);

/** Frame awal (absolut) tiap scene setelah dikurangi tumpang tindih. */
export const SCENE_START: Record<SceneKey, number> = (() => {
  const out = {} as Record<SceneKey, number>;
  let cursor = 0;
  SCENE_ORDER.forEach((key) => {
    out[key] = cursor;
    cursor += sceneFrames(key) - TRANSITION_FRAMES;
  });
  return out;
})();

export const TOTAL_FRAMES =
  SCENE_ORDER.reduce((sum, key) => sum + sceneFrames(key), 0) -
  (SCENE_ORDER.length - 1) * TRANSITION_FRAMES;
