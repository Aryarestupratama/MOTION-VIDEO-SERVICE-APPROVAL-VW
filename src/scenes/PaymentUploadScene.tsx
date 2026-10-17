import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { PhoneFrame } from "../components/PhoneFrame";
import {
  BANK_H,
  BANK_Y,
  BankAccountsCard,
  CARD_W,
  DETAILS_H,
  DETAILS_Y,
  PaymentDetailsCard,
  PaymentReceiptCard,
  PaymentUploadMock,
  RECEIPT_H,
  RECEIPT_Y,
  type PaymentUploadState,
} from "../components/PaymentUploadMock";
import { COLORS, EASE, FONTS, SPRING, fontFamily } from "../theme";

// ---------- Konten ----------
const TITLE_LINES = ["Upload Bukti Bayar", "dengan Mudah"] as const;
const DETAILS_LINES = ["Cek Detail Pembayaran,", "Jelas dan Transparan"] as const;
const BANK_LINES = ["Salin Nomor Rekening", "dengan Satu Ketukan"] as const;
const RECEIPT_LINES = ["Upload Bukti", "Pembayaran Anda"] as const;

// ---------- Timeline (frame lokal scene, 30 fps) ----------
export const PAYMENT_UPLOAD_SCENE_FRAMES = 22 * 30;

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

// Kartu melayang: [mulai masuk, selesai masuk], [mulai keluar, selesai keluar].
const DETAILS_FLOAT = { in: [132, 158], out: [226, 250] } as const;
const DETAILS_TEXT = { in: [142, 162], out: [212, 230] } as const;
const BANK_FLOAT = { in: [256, 282], out: [352, 376] } as const;
const BANK_TEXT = { in: [266, 286], out: [338, 356] } as const;
const RECEIPT_FLOAT = { in: [420, 446], out: [612, 638] } as const;
const RECEIPT_TEXT = { in: [430, 450], out: [600, 616] } as const;

const AMOUNT_PULSE = [170, 184, 200] as const;
const COPY_TAP = 306;
const COPIED_UNTIL = COPY_TAP + 5 + 36;

// Scroll halaman: ke kartu receipt supaya terlihat sebelum melayang.
const SCROLL_TO_RECEIPT = [380, 414] as const;
const RECEIPT_SCROLL_Y = 312;

// Upload: gambar terbang masuk, lalu ketuk Upload, progres, berhasil.
const FLY = [462, 494] as const;
const UPLOAD_TAP = 524;
const UPLOADING_FROM = 528;
const PROGRESS = [530, 564] as const;
const SUCCESS_AT = 568;

const FLOAT_SCALE = 2.3;
const FLOAT_CENTER_Y = 1120;
const BLUR_MAX_PX = 9; // di ruang lokal HP; tampil sekitar 16 px setelah scale 1.8

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cubic = Easing.inOut(Easing.cubic);
const outCubic = Easing.out(Easing.cubic);

const press = (frame: number, tap: number) =>
  interpolate(frame, [tap, tap + 3, tap + 8], [0, 1, 0], { ...CLAMP, easing: [outCubic, cubic] });
const ripple = (frame: number, tap: number, len = 14) =>
  interpolate(frame, [tap, tap + len], [0, 1], { ...CLAMP, easing: outCubic });

const floatOf = (frame: number, w: { in: readonly [number, number]; out: readonly [number, number] }) => {
  const fin = interpolate(frame, w.in, [0, 1], { ...CLAMP, easing: cubic });
  const fout = interpolate(frame, w.out, [0, 1], { ...CLAMP, easing: cubic });
  return { p: fin * (1 - fout), on: frame >= w.in[0] && frame < w.out[1] };
};

const textOf = (frame: number, w: { in: readonly [number, number]; out: readonly [number, number] }) =>
  Math.min(
    interpolate(frame, w.in, [0, 1], { ...CLAMP, easing: outCubic }),
    interpolate(frame, w.out, [1, 0], { ...CLAMP, easing: cubic }),
  );

// Posisi tengah kartu di dalam HP (koordinat video) pada scroll tertentu.
const cardCenterVideoY = (cardY: number, cardH: number, scrollY: number) =>
  PHONE_TOP + (SCREEN_OFFSET + cardY - scrollY + cardH / 2) * PHONE_SCALE;

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

const FloatText: React.FC<{ lines: readonly string[]; opacity: number }> = ({ lines, opacity }) => (
  <div style={{ ...textBoxStyle(300, 360, 66, opacity), transform: `translateY(${(1 - opacity) * 18}px)` }}>
    {lines.map((line) => (
      <div key={line}>{line}</div>
    ))}
  </div>
);

export const PaymentUploadScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ----- Judul: tengah dulu, naik setelah HP mulai muncul -----
  const titleTop = interpolate(
    frame,
    [0, 8, TITLE_MOVE[0], TITLE_MOVE[1]],
    [TITLE_CENTER_TOP + 24, TITLE_CENTER_TOP, TITLE_CENTER_TOP, TITLE_ZONE_TOP],
    { ...CLAMP, easing: [outCubic, Easing.linear, cubic] },
  );
  const titleOpacity = Math.min(
    tween(frame, TITLE_START_SEC, TITLE_START_SEC + 0.3, 0, 1, EASE.out),
    interpolate(frame, TITLE_FADE_OUT, [1, 0], { ...CLAMP, easing: cubic }),
  );

  // ----- HP: langsung setengah, hanya naik dari bawah -----
  // Easing tetap (bukan spring) supaya HP tidak sampai di tempatnya sebelum judul selesai naik.
  const phoneTranslateY = interpolate(frame, PHONE_RISE, [900, 0], { ...CLAMP, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const phoneOpacity = interpolate(frame, PHONE_FADE, [0, 1], { ...CLAMP, easing: outCubic });

  // ----- Scroll -----
  const scrollY = interpolate(frame, SCROLL_TO_RECEIPT, [0, RECEIPT_SCROLL_Y], { ...CLAMP, easing: cubic });

  // ----- Kartu melayang -----
  const details = floatOf(frame, DETAILS_FLOAT);
  const bank = floatOf(frame, BANK_FLOAT);
  const receiptFloat = floatOf(frame, RECEIPT_FLOAT);
  const floatMax = Math.max(details.p, bank.p, receiptFloat.p);
  const hidden = details.on ? "details" : bank.on ? "bank" : receiptFloat.on ? "receipt" : null;

  const shadowFor = (p: number) =>
    `0 ${Math.round(8 + p * 36)}px ${Math.round(24 + p * 70)}px -${Math.round(16 - p * 4)}px rgba(22,27,89,${(0.22 + p * 0.3).toFixed(2)})`;

  const amountHighlight = interpolate(frame, AMOUNT_PULSE, [0, 1, 0.35], { ...CLAMP, easing: cubic });
  const copyPress = press(frame, COPY_TAP);
  const copyRipple = ripple(frame, COPY_TAP, 16);
  const copied = frame >= COPY_TAP + 5 && frame < COPIED_UNTIL;

  // ----- Upload -----
  const state: PaymentUploadState =
    frame >= SUCCESS_AT ? "success" : frame >= UPLOADING_FROM ? "uploading" : frame >= FLY[1] ? "file-selected" : "empty";
  const fly = interpolate(frame, FLY, [0, 1], { ...CLAMP, easing: outCubic });
  const successProgress =
    frame < SUCCESS_AT ? 0 : spring({ frame: frame - SUCCESS_AT, fps, durationInFrames: 17, config: { damping: 17, mass: 0.7 } });
  const receiptProps = {
    state,
    uploadProgress: interpolate(frame, PROGRESS, [0, 100], { ...CLAMP, easing: cubic }),
    fly,
    fileProgress: 1,
    uploadPress: press(frame, UPLOAD_TAP),
    uploadRipple: ripple(frame, UPLOAD_TAP, 18),
    successProgress,
    spinnerAngle: frame * 22,
  };

  const overlays = [
    { key: "details", f: details, y: DETAILS_Y, h: DETAILS_H, scroll: 0 },
    { key: "bank", f: bank, y: BANK_Y, h: BANK_H, scroll: 0 },
    { key: "receipt", f: receiptFloat, y: RECEIPT_Y, h: RECEIPT_H, scroll: RECEIPT_SCROLL_Y },
  ] as const;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.white, color: COLORS.vwBlue, fontFamily }}>
      {/* Judul */}
      <div style={{ ...textBoxStyle(titleTop, 380, 70, titleOpacity), zIndex: 4 }}>
        <WordLines lines={TITLE_LINES} frame={frame} fps={fps} startSec={TITLE_START_SEC} />
      </div>

      {/* Teks saat kartu melayang */}
      <FloatText lines={DETAILS_LINES} opacity={textOf(frame, DETAILS_TEXT)} />
      <FloatText lines={BANK_LINES} opacity={textOf(frame, BANK_TEXT)} />
      <FloatText lines={RECEIPT_LINES} opacity={textOf(frame, RECEIPT_TEXT)} />

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
          filter: floatMax > 0.001 ? `blur(${(floatMax * BLUR_MAX_PX).toFixed(2)}px)` : undefined,
        }}
      >
        <PhoneFrame>
          <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.white }}>
            <PaymentUploadMock
              scrollY={scrollY}
              hidden={hidden}
              amountHighlight={amountHighlight}
              copyPress={copyPress}
              copyRipple={copyRipple}
              copied={copied}
              receipt={receiptProps}
            />
          </div>
        </PhoneFrame>
      </div>

      {/* Bokeh + kerudung putih tipis di belakang kartu yang melayang */}
      <AbsoluteFill style={{ zIndex: 3, pointerEvents: "none", opacity: floatMax }}>
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

      {/* Kartu melayang di tengah halaman */}
      {overlays.map(({ key, f, y, h, scroll }) => {
        if (!f.on) return null;
        const startY = cardCenterVideoY(y, h, scroll);
        const centerY = interpolate(f.p, [0, 1], [startY, FLOAT_CENTER_Y], CLAMP);
        const scale = interpolate(f.p, [0, 1], [PHONE_SCALE, FLOAT_SCALE], CLAMP);
        const shadow = shadowFor(f.p);
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              zIndex: 5,
              left: 540 - CARD_W / 2,
              top: centerY - h / 2,
              width: CARD_W,
              height: h,
              transformOrigin: "50% 50%",
              scale,
            }}
          >
            {key === "details" ? <PaymentDetailsCard shadow={shadow} highlight={amountHighlight} /> : null}
            {key === "bank" ? (
              <BankAccountsCard shadow={shadow} copyPress={copyPress} copyRipple={copyRipple} copied={copied} />
            ) : null}
            {key === "receipt" ? <PaymentReceiptCard shadow={shadow} {...receiptProps} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
