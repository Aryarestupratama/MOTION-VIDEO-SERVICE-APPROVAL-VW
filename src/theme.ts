// Sumber tunggal: warna, font, easing, spring, FPS, sec(), ukuran layout.
// Semua nilai brand diambil dari tailwind.config.js repo web (Design.md bagian 11).
import { Easing } from "remotion";
import { headlineFont, accentFont, labelFont } from "./fonts";

// ---------- Waktu ----------
// CATATAN: scene lama masih memakai frame mentah pada 30 fps. Selama belum
// semua scene dimigrasi, FPS tetap 30. Setelah scene terakhir selesai,
// ubah satu angka ini menjadi 60 (semua durasi lewat sec()).
export const FPS = 30;
export const sec = (n: number): number => Math.round(n * FPS);

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// ---------- Warna ----------
export const COLORS = {
  // Token MOTION-DESIGN.md bagian 3
  vwBlue: "#161E59",
  approved: "#2E7D32",
  // Web asli memakai abu gelap untuk Reject (OQ-D1 belum diputuskan owner).
  // Token merah disiapkan tetapi TIDAK dipakai sampai ada keputusan.
  rejected: "#D32F2F",
  rejectedNeutral: "#374151", // gray-700, tampilan Reject di web sekarang
  paper: "#F4F1EA",
  white: "#FFFFFF",
  ink: "#0E1330",
  muted: "rgba(14, 19, 48, 0.55)",
  // Kompatibilitas scene lama (hapus setelah semua scene dimigrasi)
  offWhite: "#F2F2F2",
  lightBlue: "#00B0F0",
} as const;

// ---------- Font ----------
export const FONTS = {
  headline: headlineFont,
  accent: accentFont,
  label: labelFont,
} as const;
export const fontFamily = headlineFont; // kompatibilitas scene lama

// ---------- Easing dan spring ----------
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // masuk: cepat lalu lembut berhenti
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // geser, scroll, kamera
  in: Easing.bezier(0.7, 0, 0.84, 0), // keluar
};
export const SPRING = {
  smooth: { damping: 200 }, // tanpa pantulan: judul, kamera, HP
  soft: { damping: 22, stiffness: 120, mass: 1 }, // kartu, tombol
  pop: { damping: 14, stiffness: 160, mass: 0.8 }, // centang, bintang
} as const;

// ---------- Layout (canvas 1080 x 1920) ----------
export const SAFE = { x: 96, top: 200, bottom: 260 } as const;
export const TITLE_ZONE_HEIGHT = 380;
export const GAP = 80;

// ---------- Ukuran teks ----------
export const TYPE = {
  titleMin: 84,
  titleMax: 112,
  titleLineHeight: 1.05,
  bodyMin: 44,
  labelMin: 24,
} as const;

// ---------- Gerak ----------
export const MOTION = {
  blurInPx: 14,
  riseInPx: 24,
  blurInSec: 0.6,
  accentDelaySec: 0.15,
  lineStaggerSec: 0.08, // jeda antar baris judul
  floatAmplitudePx: 7,
  floatPeriodSec: 4,
  maxPhoneTiltDeg: 12,
} as const;
