// Helper animasi bersama. Semua murni dari frame (deterministik).
import type { CSSProperties } from "react";
import { interpolate, spring } from "remotion";
import { EASE, FPS, MOTION, SPRING, sec } from "./theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type EasingFn = (t: number) => number;

/** Interpolasi dengan waktu dalam DETIK (relatif ke Sequence induk). */
export const tween = (
  frame: number,
  fromSec: number,
  toSec: number,
  from: number,
  to: number,
  easing: EasingFn = EASE.out,
): number =>
  interpolate(frame, [sec(fromSec), sec(toSec)], [from, to], {
    ...clamp,
    easing,
  });

/** Spring 0 -> 1 mulai dari detik tertentu. */
export const springIn = (
  frame: number,
  fps: number,
  startSec: number,
  config: Record<string, number> = SPRING.smooth,
): number => spring({ frame: frame - sec(startSec), fps, config });

/** Blur-to-sharp: opacity 0->1, blur 14->0, naik 24px. Gaya dasar teks judul. */
export const blurIn = (
  frame: number,
  startSec: number,
  durationSec: number = MOTION.blurInSec,
): CSSProperties => {
  const p = tween(frame, startSec, startSec + durationSec, 0, 1, EASE.out);
  return {
    opacity: p,
    filter: `blur(${(1 - p) * MOTION.blurInPx}px)`,
    transform: `translateY(${(1 - p) * MOTION.riseInPx}px)`,
  };
};

/** Naik-turun pelan untuk HP (maks 7px, periode 4 dtk). Mulai dari 0. */
export const floatY = (frame: number): number =>
  Math.sin((frame / (FPS * MOTION.floatPeriodSec)) * Math.PI * 2) *
  MOTION.floatAmplitudePx;

/** Blur gerak ringan: naik saat kecepatan tinggi, 0 saat berhenti. */
export const motionBlurPx = (
  velocityPxPerFrame: number,
  maxPx = 10,
  pxPerVelocity = 0.35,
): number => Math.min(maxPx, Math.abs(velocityPxPerFrame) * pxPerVelocity);

/** Lama teks harus tampil diam (detik): 1.2 + 0.25 per kata (bagian 5). */
export const readHoldSec = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return 1.2 + 0.25 * words;
};
