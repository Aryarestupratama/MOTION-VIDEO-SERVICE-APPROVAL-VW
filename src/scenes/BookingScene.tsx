import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { tween } from "../motion";
import { PhoneFrame } from "../components/PhoneFrame";
import { WordLines } from "../components/WordLines";
import { BOOKING_CHAT, BOOKING_DEMO, BookingPageMock, GROUP_H, GROUP_W, GROUP_Y, ThankYouGroup } from "../components/BookingMock";
import { SCREEN_H, SCREEN_W } from "../components/ServiceAdvisorMock";
import { WhatsAppChatMock } from "../components/WhatsAppChatMock";
import { COLORS, EASE, FONTS, fontFamily } from "../theme";
import { sceneFrames } from "../timeline";

// Scene Booking. Urutannya mengikuti scene Contact Advisor (timing awal dibuat sama persis):
// judul -> HP naik -> kotak Thank You melayang di tengah (sekitar blur) -> tap "Book your next
// service" -> HP membesar jadi chat WhatsApp ke Admin VW PIK (ketik, kirim, centang, balasan)
// -> chat menghilang -> halaman putih dengan slogan di tengah.

const TITLE_LINES = ["Servis Berikutnya,", "Booking dengan Mudah"] as const;
const FLOAT_LINES = ["Satu Ketukan,", "Langsung Booking"] as const;

export const BOOKING_SCENE_FRAMES = sceneFrames("booking");

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

// Kotak Thank You melayang (zoom), sekitarnya blur.
const GROUP_FLOAT = { in: [132, 158], out: [218, 242] } as const;
const GROUP_TEXT = { in: [142, 162], out: [206, 226] } as const;
const PULSE_TIMELINE = [172, 176, 180, 184, 188, 192] as const;
const BOOK_TAP = 196;

// HP membesar jadi layar video penuh (WhatsApp).
const MORPH = [244, 284] as const;
const PAGE_FADE_OUT = [258, 270] as const;
const WA_FADE = [268, 284] as const;

// Chat: ketik pesan booking, kirim, balasan admin.
const TYPE_START = 298;
const TYPE_END = 382;
const CHAT_SEND_TAP = 396;
const BUBBLE_IN = 400;
const TICK_DELIVERED = 416;
const TICK_READ = 432;
const ADMIN_TYPING_START = 440;
const DOTS_IN = [446, 458] as const;
const REPLY_AT = 500;

// Chat menghilang, lalu slogan di halaman putih.
const WA_EXIT = [566, 588] as const;
const SLOGAN_START_SEC = 19.8; // detik lokal scene (frame 594)

const FLOAT_SCALE = 2.1;
const FLOAT_CENTER_Y = 1160;
const BLUR_MAX_PX = 9;

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

const textOutOf = (frame: number, w: { in: readonly [number, number]; out: readonly [number, number] }) =>
  interpolate(frame, w.out, [1, 0], { ...CLAMP, easing: cubic });

// Posisi tengah grup Thank You di dalam HP (koordinat video).
const groupCenterVideoY = PHONE_TOP + (SCREEN_OFFSET + GROUP_Y + GROUP_H / 2) * PHONE_SCALE;

// Layar HP (tanpa bezel) dalam koordinat video, titik awal animasi membesar.
const SCREEN_RECT = {
  x: 540 + (SCREEN_OFFSET - PHONE_WIDTH / 2) * PHONE_SCALE,
  y: PHONE_TOP + SCREEN_OFFSET * PHONE_SCALE,
  w: SCREEN_W * PHONE_SCALE,
  h: SCREEN_H * PHONE_SCALE,
  radius: 45 * PHONE_SCALE,
  bezel: SCREEN_OFFSET * PHONE_SCALE,
};

const BOKEH = [
  { x: 120, y: 760, size: 300, color: "rgba(0,176,240,0.20)" },
  { x: 900, y: 880, size: 240, color: "rgba(22,30,89,0.16)" },
  { x: 260, y: 1480, size: 360, color: "rgba(22,30,89,0.14)" },
  { x: 880, y: 1560, size: 300, color: "rgba(0,176,240,0.18)" },
  { x: 560, y: 700, size: 200, color: "rgba(22,30,89,0.12)" },
  { x: 700, y: 1750, size: 220, color: "rgba(0,176,240,0.16)" },
  { x: 90, y: 1130, size: 180, color: "rgba(46,125,50,0.14)" },
] as const;

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

export const BookingScene: React.FC = () => {
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
  const phoneTranslateY = interpolate(frame, PHONE_RISE, [900, 0], { ...CLAMP, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const phoneOpacity = interpolate(frame, PHONE_FADE, [0, 1], { ...CLAMP, easing: outCubic });

  // ----- Kotak Thank You melayang -----
  const group = floatOf(frame, GROUP_FLOAT);
  const pulseEase = [outCubic, cubic, outCubic, cubic, Easing.linear];
  const pulseScale = interpolate(frame, PULSE_TIMELINE, [1, 1.05, 1, 1.05, 1, 1], { ...CLAMP, easing: pulseEase });
  const pulseOpacity = interpolate(frame, PULSE_TIMELINE, [0, 0.65, 0, 0.65, 0, 0], { ...CLAMP, easing: pulseEase });
  const buttonPress = press(frame, BOOK_TAP);
  const buttonRipple = ripple(frame, BOOK_TAP, 18);
  const groupShadow = `0 ${Math.round(8 + group.p * 36)}px ${Math.round(24 + group.p * 70)}px -${Math.round(16 - group.p * 4)}px rgba(22,27,89,${(0.22 + group.p * 0.3).toFixed(2)})`;

  // ----- HP membesar jadi layar penuh -----
  const morphP = interpolate(frame, MORPH, [0, 1], { ...CLAMP, easing: cubic });
  const morphOn = frame >= MORPH[0];
  const waOpacity = interpolate(frame, WA_FADE, [0, 1], { ...CLAMP, easing: cubic });
  const pageOpacity = interpolate(frame, PAGE_FADE_OUT, [1, 0], { ...CLAMP, easing: cubic });
  const panelW = interpolate(morphP, [0, 1], [SCREEN_RECT.w, 1080]);
  const panelH = interpolate(morphP, [0, 1], [SCREEN_RECT.h, 1920]);
  const panelX = interpolate(morphP, [0, 1], [SCREEN_RECT.x, 0]);
  const panelY = interpolate(morphP, [0, 1], [SCREEN_RECT.y, 0]);
  const panelRadius = interpolate(morphP, [0, 1], [SCREEN_RECT.radius, 0]);
  const panelBezel = interpolate(morphP, [0, 1], [SCREEN_RECT.bezel, 0]);
  const panelScale = panelW / SCREEN_W;

  // ----- Chat WhatsApp (animasi sama dengan scene Contact) -----
  const typeT = interpolate(frame, [TYPE_START, TYPE_END], [0, 1], CLAMP);
  const typedRaw = Math.round((typeT + 0.015 * Math.sin(typeT * 40)) * BOOKING_CHAT.message.length);
  const typedChars = frame >= BUBBLE_IN ? 0 : Math.max(0, Math.min(BOOKING_CHAT.message.length, typedRaw));
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const sentProgress =
    frame < BUBBLE_IN ? 0 : spring({ frame: frame - BUBBLE_IN, fps, durationInFrames: 16, config: { damping: 16, mass: 0.7 } });
  const replyProgress =
    frame < REPLY_AT ? 0 : spring({ frame: frame - REPLY_AT, fps, durationInFrames: 16, config: { damping: 16, mass: 0.7 } });
  const dotsOpacity = interpolate(frame, DOTS_IN, [0, 1], { ...CLAMP, easing: outCubic });
  const tickState = frame >= TICK_READ ? 2 : frame >= TICK_DELIVERED ? 1 : 0;

  // ----- Chat menghilang -> halaman putih + slogan -----
  const exitP = interpolate(frame, WA_EXIT, [0, 1], { ...CLAMP, easing: cubic });
  const panelVisible = frame < WA_EXIT[1];

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.white, color: COLORS.vwBlue, fontFamily }}>
      {/* Judul */}
      <div style={{ ...textBoxStyle(titleTop, 380, 70, titleOpacity), zIndex: 4 }}>
        <WordLines lines={TITLE_LINES} startSec={TITLE_START_SEC} />
      </div>

      {/* Teks saat kotak melayang */}
      <div style={textBoxStyle(300, 360, 66, textOutOf(frame, GROUP_TEXT))}>
        <WordLines lines={FLOAT_LINES} startSec={GROUP_TEXT.in[0] / fps} />
      </div>

      {/* HP setengah (langsung scale 1.8) */}
      {frame < MORPH[1] ? (
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
            filter: group.p > 0.001 ? `blur(${(group.p * BLUR_MAX_PX).toFixed(2)}px)` : undefined,
          }}
        >
          <PhoneFrame>
            <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.white }}>
              <BookingPageMock
                hideGroup={group.on}
                buttonPressProgress={buttonPress}
                rippleProgress={buttonRipple}
                pulseScale={pulseScale}
                pulseOpacity={pulseOpacity}
              />
            </div>
          </PhoneFrame>
        </div>
      ) : null}

      {/* Bokeh + kerudung putih tipis di belakang kotak yang melayang */}
      <AbsoluteFill style={{ zIndex: 3, pointerEvents: "none", opacity: group.p }}>
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

      {/* Kotak Thank You + tombol booking melayang di tengah halaman */}
      {group.on ? (
        <div
          style={{
            position: "absolute",
            zIndex: 5,
            left: 540 - GROUP_W / 2,
            top: interpolate(group.p, [0, 1], [groupCenterVideoY, FLOAT_CENTER_Y], CLAMP) - GROUP_H / 2,
            width: GROUP_W,
            height: GROUP_H,
            transformOrigin: "50% 50%",
            scale: interpolate(group.p, [0, 1], [PHONE_SCALE, FLOAT_SCALE], CLAMP),
          }}
        >
          <ThankYouGroup
            shadow={groupShadow}
            buttonPressProgress={buttonPress}
            rippleProgress={buttonRipple}
            pulseScale={pulseScale}
            pulseOpacity={pulseOpacity}
          />
        </div>
      ) : null}

      {/* HP membesar menjadi layar penuh: halaman -> WhatsApp, lalu menghilang */}
      {morphOn && panelVisible ? (
        <div
          style={{
            position: "absolute",
            zIndex: 8,
            left: panelX,
            top: panelY,
            width: panelW,
            height: panelH,
            overflow: "hidden",
            borderRadius: panelRadius,
            boxShadow: `0 0 0 ${panelBezel}px #08090B`,
            backgroundColor: "#F8F9FC",
            opacity: 1 - exitP,
            scale: 1 - exitP * 0.05,
          }}
        >
          {pageOpacity > 0 ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: SCREEN_H, transformOrigin: "0 0", scale: panelScale, opacity: pageOpacity }}>
              <BookingPageMock />
            </div>
          ) : null}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: SCREEN_W,
              height: panelH / panelScale,
              transformOrigin: "0 0",
              scale: panelScale,
              opacity: waOpacity,
            }}
          >
            <WhatsAppChatMock
              content={BOOKING_CHAT}
              height={panelH / panelScale}
              typedChars={typedChars}
              caretOn={caretOn}
              sendPress={press(frame, CHAT_SEND_TAP)}
              sentProgress={sentProgress}
              tickState={tickState}
              headerTyping={frame >= ADMIN_TYPING_START && frame < REPLY_AT}
              dotsOpacity={frame >= ADMIN_TYPING_START ? dotsOpacity : 0}
              frame={frame}
              replyProgress={replyProgress}
            />
          </div>
        </div>
      ) : null}

      {/* Slogan penutup di halaman putih */}
      {frame >= WA_EXIT[1] ? (
        <div style={{ ...textBoxStyle(0, 1920, 88, 1), zIndex: 9 }}>
          <WordLines lines={BOOKING_DEMO.captionLines} startSec={SLOGAN_START_SEC} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
