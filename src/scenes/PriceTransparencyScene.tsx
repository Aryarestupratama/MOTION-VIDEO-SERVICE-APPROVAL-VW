import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { PhoneFrame } from "../components/PhoneFrame";
import {
  OrderSummaryCard,
  PRICE_ITEMS,
  SUMMARY_H,
  SUMMARY_W,
  SUMMARY_Y,
  PriceDecisionMock,
  type PriceDecision,
} from "../components/PriceDecisionMock";
import { COLORS, EASE, FONTS, SPRING, fontFamily } from "../theme";

// ---------- Konten ----------
const TITLE_LINES = ["Transparansi Harga,", "Anda yang Memutuskan"] as const;
const INSTRUCTION_LINES = ["Approve dan Reject item", "sesuai keinginan Anda"] as const;
const SUMMARY_LINES = ["Cek Total Harganya,", "Tanpa Biaya Kejutan"] as const;
const SUBMIT_LINES = ["Kirim Keputusan Anda", "dengan Satu Ketukan"] as const;

// ---------- Timeline (frame lokal scene, 30 fps) ----------
export const PRICE_TRANSPARENCY_SCENE_FRAMES = 23 * 30;

// HP langsung setengah (scale 1.8), tanpa animasi full HP di awal maupun akhir.
const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const PHONE_SCALE = 1.8;
const PHONE_TOP = 480;
const PHONE_LEFT = (1080 - PHONE_WIDTH) / 2;
const SCREEN_OFFSET = 14; // border 5 + padding 9 pada PhoneFrame
const PHONE_RISE = [36, 96] as const;
const PHONE_FADE = [36, 52] as const;

const TITLE_START_SEC = 0.28;
const TITLE_MOVE = [46, 70] as const;
const TITLE_CENTER_TOP = 770;
const TITLE_ZONE_TOP = 96;
const TITLE_FADE_OUT = [108, 124] as const;
const INSTRUCTION_IN = [114, 134] as const;
const INSTRUCTION_OUT = [352, 370] as const;

// Keputusan item: tap di T, tombol berubah di T + DECISION_DELAY.
const DECISION_DELAY = 6;
const DECISION_EVENTS: { tap: number; decision: PriceDecision }[] = [
  { tap: 140, decision: "approved" },
  { tap: 170, decision: "rejected" },
  { tap: 222, decision: "approved" },
  { tap: 248, decision: "approved" },
  { tap: 298, decision: "rejected" },
];

// Scroll isi halaman (koordinat layar HP): mengikuti item yang sedang diputuskan.
const SCROLL_KEYS = [
  { frame: 0, y: 0 },
  { frame: 190, y: 0 },
  { frame: 212, y: 460 },
  { frame: 268, y: 460 },
  { frame: 290, y: 720 },
  { frame: 322, y: 720 },
  { frame: 362, y: 1112 },
  { frame: 494, y: 1112 },
  { frame: 514, y: 1112 },
];
const SUMMARY_SCROLL_Y = 1112;

// Order summary melayang di tengah halaman, sekitarnya blur (bokeh).
const FLOAT_IN = [372, 398] as const;
const FLOAT_OUT = [470, 494] as const;
const SUMMARY_TEXT_IN = [384, 404] as const;
const SUMMARY_TEXT_OUT = [458, 474] as const;
const FLOAT_SCALE = 2.3;
const FLOAT_CENTER_Y = 1120;
const BLUR_MAX_PX = 9; // di ruang lokal HP; tampil sekitar 16 px setelah scale 1.8

// Submit lalu sheet konfirmasi.
const SUBMIT_TAP = 520;
const SHEET_IN = [530, 552] as const;
const CONFIRM_TAP = 580;
const SUBMITTING = [586, 612] as const;
const SHEET_OUT = [612, 634] as const;
const SUBMITTED = [616, 640] as const;
const SUBMIT_TEXT_IN = [494, 514] as const;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cubic = Easing.inOut(Easing.cubic);

const getDecisions = (frame: number): PriceDecision[] =>
  PRICE_ITEMS.map((_, i) => {
    const ev = DECISION_EVENTS[i];
    return ev && frame >= ev.tap + DECISION_DELAY ? ev.decision : "pending";
  });

const press = (frame: number, tap: number) =>
  interpolate(frame, [tap, tap + 3, tap + 8], [0, 1, 0], { ...CLAMP, easing: [Easing.out(Easing.cubic), cubic] });
const ripple = (frame: number, tap: number, len = 14) =>
  interpolate(frame, [tap, tap + len], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

// Posisi kartu Order summary di dalam HP (koordinat video) pada scroll tertentu.
const cardCenterVideoY = (scrollY: number) =>
  PHONE_TOP + (SCREEN_OFFSET + SUMMARY_Y - scrollY + SUMMARY_H / 2) * PHONE_SCALE;

const BOKEH = [
  { x: 120, y: 760, size: 300, color: "rgba(0,176,240,0.20)" },
  { x: 900, y: 880, size: 240, color: "rgba(22,30,89,0.16)" },
  { x: 260, y: 1480, size: 360, color: "rgba(22,30,89,0.14)" },
  { x: 880, y: 1560, size: 300, color: "rgba(0,176,240,0.18)" },
  { x: 560, y: 700, size: 200, color: "rgba(22,30,89,0.12)" },
  { x: 700, y: 1750, size: 220, color: "rgba(0,176,240,0.16)" },
  { x: 90, y: 1130, size: 180, color: "rgba(46,125,50,0.14)" },
] as const;

const WordLines: React.FC<{ lines: readonly string[]; frame: number; fps: number; startSec: number }> = ({
  lines,
  frame,
  fps,
  startSec,
}) => {
  let wordIndex = 0;
  return (
    <>
      {lines.map((line) => (
        <div key={line} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "0.24em" }}>
          {line.split(" ").map((word) => {
            const at = startSec + wordIndex * 0.09;
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
    </>
  );
};

const textBoxStyle = (top: number, height: number, fontSize: number, opacity: number): React.CSSProperties => ({
  position: "absolute",
  zIndex: 6,
  top,
  left: 70,
  right: 70,
  height,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  fontFamily: FONTS.headline,
  fontSize,
  lineHeight: 1.15,
  fontWeight: 700,
  color: COLORS.vwBlue,
  opacity,
});

export const PriceTransparencyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ----- Judul: tengah dulu, naik setelah HP mulai muncul -----
  const titleTop = interpolate(
    frame,
    [0, 8, TITLE_MOVE[0], TITLE_MOVE[1]],
    [TITLE_CENTER_TOP + 24, TITLE_CENTER_TOP, TITLE_CENTER_TOP, TITLE_ZONE_TOP],
    { ...CLAMP, easing: [Easing.out(Easing.cubic), Easing.linear, cubic] },
  );
  const titleOpacity = Math.min(
    tween(frame, TITLE_START_SEC, TITLE_START_SEC + 0.3, 0, 1, EASE.out),
    interpolate(frame, TITLE_FADE_OUT, [1, 0], { ...CLAMP, easing: cubic }),
  );

  // ----- Teks instruksi, ringkasan, dan kirim (di atas HP) -----
  const instructionOpacity = Math.min(
    interpolate(frame, INSTRUCTION_IN, [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) }),
    interpolate(frame, INSTRUCTION_OUT, [1, 0], { ...CLAMP, easing: cubic }),
  );
  const summaryTextOpacity = Math.min(
    interpolate(frame, SUMMARY_TEXT_IN, [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) }),
    interpolate(frame, SUMMARY_TEXT_OUT, [1, 0], { ...CLAMP, easing: cubic }),
  );
  // Teks ini tetap tampil sampai scene selesai.
  const submitTextOpacity = interpolate(frame, SUBMIT_TEXT_IN, [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // ----- HP: langsung setengah, hanya naik dari bawah -----
  // Easing tetap (bukan spring) supaya HP tidak sampai di tempatnya sebelum judul selesai naik.
  const phoneTranslateY = interpolate(frame, PHONE_RISE, [900, 0], { ...CLAMP, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const phoneOpacity = interpolate(frame, PHONE_FADE, [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // ----- Keputusan item -----
  const decisions = getDecisions(frame);
  const stampProgress = PRICE_ITEMS.map((_, i) => {
    const ev = DECISION_EVENTS[i];
    if (!ev || frame < ev.tap + DECISION_DELAY) return 0;
    return spring({
      frame: frame - (ev.tap + DECISION_DELAY),
      fps,
      durationInFrames: 16,
      config: { damping: 18, mass: 0.65 },
    });
  });
  const pressApprove = PRICE_ITEMS.map((_, i) =>
    DECISION_EVENTS[i]?.decision === "approved" ? press(frame, DECISION_EVENTS[i].tap) : 0,
  );
  const pressReject = PRICE_ITEMS.map((_, i) =>
    DECISION_EVENTS[i]?.decision === "rejected" ? press(frame, DECISION_EVENTS[i].tap) : 0,
  );
  const rippleApprove = PRICE_ITEMS.map((_, i) =>
    DECISION_EVENTS[i]?.decision === "approved" ? ripple(frame, DECISION_EVENTS[i].tap) : 0,
  );
  const rippleReject = PRICE_ITEMS.map((_, i) =>
    DECISION_EVENTS[i]?.decision === "rejected" ? ripple(frame, DECISION_EVENTS[i].tap) : 0,
  );

  // ----- Scroll -----
  const scrollBeforeSubmit = interpolate(
    frame,
    SCROLL_KEYS.map((k) => k.frame),
    SCROLL_KEYS.map((k) => k.y),
    {
      ...CLAMP,
      easing: [
        Easing.linear, cubic, Easing.linear, cubic, Easing.linear, cubic, Easing.linear, Easing.linear,
      ],
    },
  );
  // Setelah submit: layout "Already decided" kembali ke atas.
  const submittedProgress = interpolate(frame, SUBMITTED, [0, 1], { ...CLAMP, easing: cubic });
  const scrollY = scrollBeforeSubmit * (1 - submittedProgress);

  // ----- Order summary melayang (bokeh) -----
  const floatIn = interpolate(frame, FLOAT_IN, [0, 1], { ...CLAMP, easing: cubic });
  const floatOut = interpolate(frame, FLOAT_OUT, [0, 1], { ...CLAMP, easing: cubic });
  const floatP = floatIn * (1 - floatOut); // 0 = di halaman, 1 = melayang
  const floating = frame >= FLOAT_IN[0] && frame < FLOAT_OUT[1];
  const bokehOpacity = floatP;
  const startY = cardCenterVideoY(SUMMARY_SCROLL_Y);
  const overlayCenterY = interpolate(floatP, [0, 1], [startY, FLOAT_CENTER_Y], CLAMP);
  const overlayScale = interpolate(floatP, [0, 1], [PHONE_SCALE, FLOAT_SCALE], CLAMP);
  const highlight = interpolate(frame, [FLOAT_IN[1] + 8, FLOAT_IN[1] + 22, FLOAT_IN[1] + 40], [0, 1, 0.35], {
    ...CLAMP,
    easing: cubic,
  });
  const cardShadow = `0 ${Math.round(8 + floatP * 36)}px ${Math.round(24 + floatP * 70)}px -${Math.round(16 - floatP * 4)}px rgba(22,27,89,${(0.22 + floatP * 0.3).toFixed(2)})`;

  // ----- Submit dan sheet -----
  const barProgress = interpolate(frame, [SUBMITTED[1] - 6, SUBMITTED[1] + 12], [1, 0], { ...CLAMP, easing: cubic });
  const sheetProgress = Math.min(
    interpolate(frame, SHEET_IN, [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) }),
    interpolate(frame, SHEET_OUT, [1, 0], { ...CLAMP, easing: cubic }),
  );
  const submitting = frame >= SUBMITTING[0] && frame < SUBMITTING[1];

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.white, color: COLORS.vwBlue, fontFamily }}>
      {/* Judul */}
      <div style={{ ...textBoxStyle(titleTop, 380, 70, titleOpacity), zIndex: 4 }}>
        <WordLines lines={TITLE_LINES} frame={frame} fps={fps} startSec={TITLE_START_SEC} />
      </div>

      {/* Instruksi approve / reject */}
      <div
        style={{
          ...textBoxStyle(TITLE_ZONE_TOP + 40, 300, 66, instructionOpacity),
          transform: `translateY(${(1 - instructionOpacity) * 14}px)`,
        }}
      >
        {INSTRUCTION_LINES.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {/* Teks saat Order summary melayang */}
      <div
        style={{
          ...textBoxStyle(300, 360, 70, summaryTextOpacity),
          transform: `translateY(${(1 - summaryTextOpacity) * 18}px)`,
        }}
      >
        {SUMMARY_LINES.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {/* Teks saat submit */}
      <div
        style={{
          ...textBoxStyle(TITLE_ZONE_TOP + 40, 300, 66, submitTextOpacity),
          transform: `translateY(${(1 - submitTextOpacity) * 14}px)`,
        }}
      >
        {SUBMIT_LINES.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {/* HP setengah (langsung scale 1.8) */}
      <div
        style={{
          position: "absolute",
          left: PHONE_LEFT,
          top: PHONE_TOP,
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          zIndex: 2,
          transformOrigin: "50% 0%",
          opacity: phoneOpacity,
          scale: PHONE_SCALE,
          translate: `0 ${phoneTranslateY}px`,
          filter: floatP > 0.001 ? `blur(${(floatP * BLUR_MAX_PX).toFixed(2)}px)` : undefined,
        }}
      >
        <PhoneFrame>
          <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.white }}>
            <PriceDecisionMock
              decisions={decisions}
              stampProgress={stampProgress}
              pressApprove={pressApprove}
              pressReject={pressReject}
              rippleApprove={rippleApprove}
              rippleReject={rippleReject}
              scrollY={scrollY}
              summaryHidden={floating}
              submittedProgress={submittedProgress}
              barProgress={barProgress}
              submitPress={press(frame, SUBMIT_TAP)}
              submitRipple={ripple(frame, SUBMIT_TAP, 16)}
              sheetProgress={sheetProgress}
              confirmPress={press(frame, CONFIRM_TAP)}
              confirmRipple={ripple(frame, CONFIRM_TAP, 16)}
              submitting={submitting}
              spinnerAngle={frame * 22}
            />
          </div>
        </PhoneFrame>
      </div>

      {/* Bokeh + kerudung putih tipis di belakang kartu yang melayang */}
      <AbsoluteFill style={{ zIndex: 3, pointerEvents: "none", opacity: bokehOpacity }}>
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.28)" }} />
        {BOKEH.map((b, i) => {
          const drift = Math.sin((frame / 30 + i * 1.7) * 0.9) * 10;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x - b.size / 2,
                top: b.y - b.size / 2 + drift,
                width: b.size,
                height: b.size,
                borderRadius: 999,
                background: `radial-gradient(circle, ${b.color} 0%, ${b.color} 38%, transparent 72%)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Order summary melayang di tengah halaman */}
      {floating ? (
        <div
          style={{
            position: "absolute",
            zIndex: 5,
            left: 540 - SUMMARY_W / 2,
            top: overlayCenterY - SUMMARY_H / 2,
            width: SUMMARY_W,
            height: SUMMARY_H,
            transformOrigin: "50% 50%",
            scale: overlayScale,
          }}
        >
          <OrderSummaryCard decisions={decisions} shadow={cardShadow} highlight={highlight} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
