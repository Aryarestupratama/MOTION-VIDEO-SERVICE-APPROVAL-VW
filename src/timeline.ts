// Durasi scene dalam DETIK. Total composition dihitung dari sini
// (jumlah durasi scene dikurangi tumpang tindih transisi).
import { sec } from "./theme";

export const TRANSITION_SEC = 0.4;

export const SCENE_SEC = {
  intro: 5.9, // 2 -> 5.9 dtk: aturan baca (bagian 5) + dorongan kamera keluar 0,5 dtk sebelum sweep
  problem: 7.2, // 4 -> 7.2 dtk: tiga kartu harus diam sesuai aturan baca (bagian 5)
  solution: 29,
  status: 13,
  video: 8,
  repair: 10,
  price: 23, // 11 -> 23 dtk: judul, approve/reject, order summary melayang, submit + konfirmasi
  payment: 9,
  contact: 8,
  closing: 4,
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
