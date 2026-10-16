// Dua jenis transisi saja untuk seluruh video (MOTION-DESIGN.md 6.5):
// 1) sweep: bentuk vwBlue menyapu ke atas lalu menjadi latar scene berikutnya
// 2) fadeScale: fade-through ke vwBlue + scale 1.04 -> 1 untuk perpindahan tenang
import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { COLORS, EASE } from "./theme";

const range = (p: number, a: number, b: number): number => Math.min(1, Math.max(0, (p - a) / (b - a)));

// ---------- fadeScale ----------
// Fade-through: scene lama memudar ke latar vwBlue (babak 1), baru scene baru
// muncul dengan scale 1.04 -> 1 (babak 2). Dua scene tidak pernah tampil
// bersamaan, jadi teks tidak pernah menimpa HP scene lain.
type FadeScaleProps = { scaleFrom: number };

const FadeScaleComponent: React.FC<TransitionPresentationComponentProps<FadeScaleProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    const out = EASE.in(range(presentationProgress, 0, 0.5));
    return <AbsoluteFill style={{ opacity: 1 - out }}>{children}</AbsoluteFill>;
  }
  const p = EASE.out(range(presentationProgress, 0.5, 1));
  return (
    <AbsoluteFill
      style={{
        opacity: p,
        transform: `scale(${passedProps.scaleFrom + (1 - passedProps.scaleFrom) * p})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const fadeScale = (scaleFrom = 1.04): TransitionPresentation<FadeScaleProps> => ({
  component: FadeScaleComponent,
  props: { scaleFrom },
});

// ---------- sweep ----------
type SweepProps = { color: string };

const SweepComponent: React.FC<TransitionPresentationComponentProps<SweepProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  // Fase 1 (0-0.5): panel naik dari bawah menutup scene lama.
  // Fase 2 (0.5-1): panel terus naik keluar, membuka scene baru.
  const rise = EASE.inOut(range(presentationProgress, 0, 0.5));
  const leave = EASE.inOut(range(presentationProgress, 0.5, 1));
  const panelTop = (1 - rise) * 100;
  const panelBottom = leave * 100;
  const showScene = presentationProgress >= 0.5;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: showScene ? 1 : 0 }}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: passedProps.color,
          clipPath: `inset(${panelTop}% 0 ${panelBottom}% 0)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const sweep = (color: string = COLORS.vwBlue): TransitionPresentation<SweepProps> => ({
  component: SweepComponent,
  props: { color },
});
