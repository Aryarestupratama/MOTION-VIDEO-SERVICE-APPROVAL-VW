import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { PhoneFrame } from "../components/PhoneFrame";
import { RepairImageMock, REPAIR_PHOTOS } from "../components/RepairImageMock";
import { COLORS, EASE, FONTS, SPRING, fontFamily } from "../theme";

const TITLE_LINES = ["Foto Hasil Reparasi", "Mobil Anda"] as const;
export const REPAIR_PHOTO_SCENE_FRAMES = 10 * 30;
const TITLE_START_SEC = 0.28;
const TITLE_MOVE = [48, 78] as const;
const PHONE_REVEAL = [94, 110] as const;
const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const PHONE_SCALE = 1.8;
const PHONE_TOP = 480;
const SCREEN_TOP_PADDING = 32;
const STACK_START = 115;
const STACK_STAGGER = 6;
const STACK_ENTRY_DURATION = 18;
// Swipe: foto teratas dilempar keluar, lalu masuk ke paling belakang tumpukan (seperti web asli).
const FIRST_SWIPE_FRAME = 150;
const SWIPE_INTERVAL = 36;
const SWIPE_DURATION = 28;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const RepairPhotoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;

  const titleFadeIn = tween(frame, TITLE_START_SEC, TITLE_START_SEC + 0.3, 0, 1, EASE.out);
  const titleTop = interpolate(
    frame,
    [0, 8, TITLE_MOVE[0], TITLE_MOVE[1]],
    [770, 770, 770, 96],
    { ...CLAMP, easing: [Easing.linear, Easing.linear, Easing.inOut(Easing.cubic)] },
  );
  const phoneOpacity = interpolate(frame, PHONE_REVEAL, [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const stackProgress = REPAIR_PHOTOS.map((_, index) => {
    const start = STACK_START + index * STACK_STAGGER;
    if (frame < start) return 0;
    return spring({
      frame: frame - start,
      fps,
      durationInFrames: STACK_ENTRY_DURATION,
      config: { damping: 18, mass: 0.7 },
    });
  });

  // Swipe ke-n mulai di FIRST_SWIPE_FRAME + n * SWIPE_INTERVAL. Setelah selesai, cycle bertambah dan progres kembali 0.
  const swipeIndex = frame < FIRST_SWIPE_FRAME ? -1 : Math.floor((frame - FIRST_SWIPE_FRAME) / SWIPE_INTERVAL);
  const swipeLocal = swipeIndex < 0 ? 0 : (frame - (FIRST_SWIPE_FRAME + swipeIndex * SWIPE_INTERVAL)) / SWIPE_DURATION;
  const swipeDone = swipeLocal >= 1;
  const cycle = swipeIndex < 0 ? 0 : swipeDone ? swipeIndex + 1 : swipeIndex;
  const swipeProgress = swipeIndex < 0 || swipeDone ? 0 : swipeLocal;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.white, color: COLORS.vwBlue, fontFamily }}>
      <div
        style={{
          position: "absolute",
          zIndex: 4,
          top: titleTop,
          left: 80,
          right: 80,
          height: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: COLORS.vwBlue,
          fontFamily: FONTS.headline,
          fontSize: 76,
          lineHeight: 1.15,
          fontWeight: 700,
          opacity: titleFadeIn,
        }}
      >
        {TITLE_LINES.map((line) => (
          <div key={line} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "0.24em" }}>
            {line.split(" ").map((word) => {
              const startSec = TITLE_START_SEC + wordIndex * 0.09;
              wordIndex += 1;
              const bounce = springIn(frame, fps, startSec, SPRING.pop);
              const wordFade = tween(frame, startSec, startSec + 0.24, 0, 1, EASE.out);
              return (
                <span
                  key={`${word}-${wordIndex}`}
                  style={{
                    display: "inline-block",
                    opacity: wordFade,
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

      <div
        style={{
          position: "absolute",
          top: PHONE_TOP,
          left: (1080 - PHONE_WIDTH) / 2,
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          zIndex: 2,
          transformOrigin: "50% 0%",
          opacity: phoneOpacity,
          scale: PHONE_SCALE,
        }}
      >
        <PhoneFrame>
          <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.white }}>
            <div style={{ position: "absolute", top: SCREEN_TOP_PADDING, left: 0, width: 400, height: 1042 }}>
              <RepairImageMock
                stackProgress={stackProgress}
                cycle={cycle}
                swipeProgress={swipeProgress}
              />
            </div>
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
