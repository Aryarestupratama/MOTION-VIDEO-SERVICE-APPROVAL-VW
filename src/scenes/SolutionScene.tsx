import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { springIn, tween } from "../motion";
import {
  InspectionReportMock,
  REPORT_SCROLL_DISTANCE,
} from "../components/InspectionReportMock";
import { PhoneFrame } from "../components/PhoneFrame";
import { COLORS, EASE, FONTS, SPRING, fontFamily, sec } from "../theme";

// ---------- Konten dan timing (SEMUA dalam detik lokal scene, lewat sec()) ----------
// Durasi scene ada di timeline.ts (SCENE_SEC.solution). Urutan:
//   0,0 - 3,4   dua frasa teks (tidak diubah)
//   3,4 - 4,2   HP naik dari bawah, langsung memenuhi layar (tanpa zoom, tanpa terpotong)
//   4,05 - 4,95 isi layar awal muncul berurutan
//   5,0 - 14,5  scroll sampai kartu Workshop location; komponen muncul MENGIKUTI scroll
//   14,5 - akhir  tahan sebentar sebelum transisi
const PHONE_ENTER_SEC = [3.4, 4.2] as const;
const INTRO_START_SEC = 4.05;
const SCROLL_SEC = [5.0, 14.5] as const;

const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const VIDEO_W = 1080;
const VIDEO_H = 1920;
// HP memenuhi tinggi layar: 1060 * 1,74 = 1844 px dari 1920 (sisa ~38 px atas dan bawah).
const PHONE_SCALE = 1.74;
const PHONE_ENTER_FROM_SCALE = 1.62;
const PHONE_ENTER_RISE_PX = 1100;
const FLOAT_AMPLITUDE_PX = 5;
const FLOAT_PERIOD_SEC = 4;
// Blur gerak vertikal halus saat scroll cepat (menutupi patah-patah di 30 fps).
const SCROLL_BLUR_PER_PX = 0.1;
const SCROLL_BLUR_MAX = 1.6;
const WORD_STAGGER_SEC = 0.09;
const PHRASE_FADE_SEC = 0.32;

const AnimatedPhrase: React.FC<{
  lines: readonly string[];
  startSec: number;
  exitSec: number;
  fontSize: number;
  weight: number;
}> = ({ lines, startSec, exitSec, fontSize, weight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;
  const fadeOut = 1 - tween(frame, exitSec, exitSec + PHRASE_FADE_SEC, 0, 1, EASE.inOut);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 96px",
        textAlign: "center",
        color: COLORS.vwBlue,
        opacity: fadeOut,
      }}
    >
      {lines.map((line, lineIndex) => (
        <div
          key={`${line}-${lineIndex}`}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            columnGap: "0.24em",
            fontFamily: FONTS.headline,
            fontSize,
            fontWeight: weight,
            fontStyle: "normal",
            lineHeight: 1.2,
          }}
        >
          {line.split(" ").map((word) => {
            const at = startSec + wordIndex * WORD_STAGGER_SEC;
            wordIndex += 1;
            const bounce = springIn(frame, fps, at, SPRING.pop);
            const fadeIn = tween(frame, at, at + 0.24, 0, 1, EASE.out);

            return (
              <span
                key={`${word}-${wordIndex}`}
                style={{
                  display: "inline-block",
                  opacity: fadeIn,
                  transform: `translateY(${(1 - bounce) * 34}px) scale(${0.96 + bounce * 0.04})`,
                  transformOrigin: "50% 100%",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const PHRASES = [
  { lines: ["Solusinya?"], startSec: 0.25, exitSec: 1.12, fontSize: 84, weight: 700 },
  { lines: ["pantau service anda", "lewat genggaman tangan"], startSec: 1.42, exitSec: 3.12, fontSize: 70, weight: 700 },
] as const;

const scrollAt = (frame: number): number =>
  interpolate(frame, [sec(SCROLL_SEC[0]), sec(SCROLL_SEC[1])], [0, REPORT_SCROLL_DISTANCE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterStart = sec(PHONE_ENTER_SEC[0]);
  const enterEnd = sec(PHONE_ENTER_SEC[1]);
  const enter = (from: number, to: number): number =>
    interpolate(frame, [enterStart, enterEnd], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.out,
    });

  const riseY = enter(PHONE_ENTER_RISE_PX, 0);
  const scale = enter(PHONE_ENTER_FROM_SCALE, PHONE_SCALE);
  const rotateX = enter(7, 0);
  const rotateY = enter(-5, 0);
  const phoneOpacity = interpolate(frame, [enterStart, enterStart + sec(0.25)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Mengambang pelan; dimulai dari 0 setelah HP berhenti supaya tidak ada lompatan.
  const floatRamp = interpolate(frame, [enterEnd, enterEnd + sec(1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const floatY =
    Math.sin(((frame - enterEnd) / (fps * FLOAT_PERIOD_SEC)) * Math.PI * 2) *
    FLOAT_AMPLITUDE_PX *
    floatRamp;

  const scrollY = scrollAt(frame);
  const scrollSpeed = Math.abs(scrollY - scrollAt(frame - 1)); // px konten per frame
  const blurY = Math.min(SCROLL_BLUR_MAX, scrollSpeed * SCROLL_BLUR_PER_PX);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: COLORS.white,
        color: COLORS.vwBlue,
        fontFamily,
      }}
    >
      {PHRASES.map((phrase) => (
        <AnimatedPhrase key={phrase.lines.join(" ")} {...phrase} />
      ))}

      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <filter id="report-vblur" x="0" y="-2%" width="100%" height="104%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={`0 ${blurY.toFixed(2)}`} />
        </filter>
      </svg>

      <div
        style={{
          position: "absolute",
          left: (VIDEO_W - PHONE_WIDTH) / 2,
          top: (VIDEO_H - PHONE_HEIGHT) / 2,
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          zIndex: 2,
          transformOrigin: "50% 50%",
          opacity: phoneOpacity,
          scale,
          translate: `0 ${riseY + floatY}px`,
          transform: `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <PhoneFrame
          style={{
            boxShadow: "0 22px 54px rgba(0,0,0,0.30), 0 8px 18px rgba(0,0,0,0.20)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              filter: blurY > 0.15 ? "url(#report-vblur)" : undefined,
            }}
          >
            <InspectionReportMock scrollY={scrollY} introStartFrame={sec(INTRO_START_SEC)} />
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
