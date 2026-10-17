import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { PhoneFrame } from "../components/PhoneFrame";
import { VideoSectionMock } from "../components/VideoSectionMock";
import { COLORS, EASE, FONTS, SPRING, fontFamily } from "../theme";

const VIDEO_TITLE_LINES = ["Lihat Video Kendala", "Mobil Anda"] as const;
export const VIDEO_SHOWCASE_FRAMES = 8 * 30;
const TITLE_START_SEC = 0.28;
const TITLE_MOVE = [48, 78] as const;
const PHONE_REVEAL = [94, 110] as const;
const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const PHONE_SCALE = 1.8;
const PHONE_TOP = 480;
const SCREEN_TOP_PADDING = 32;
const PLAY_PRESS_FRAME = 117;
const PLAY_RIPPLE_END = 140;
const VIDEO_PLAY_END = 188;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const VideoShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;

  const titleFadeIn = tween(frame, TITLE_START_SEC, TITLE_START_SEC + 0.3, 0, 1, EASE.out);
  const titleOpacity = titleFadeIn;
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
  const pressSpring = spring({
    frame: frame - PLAY_PRESS_FRAME,
    fps,
    config: { damping: 14, stiffness: 210, mass: 0.35 },
  });
  const pressPulse = interpolate(pressSpring, [0, 0.45, 1], [0, 1, 0], CLAMP);
  const rippleProgress = interpolate(frame, [PLAY_PRESS_FRAME, PLAY_RIPPLE_END], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const actionStart = 115;
  const actionEnd = VIDEO_SHOWCASE_FRAMES - 20;
  const videoProgress = interpolate(frame, [actionStart + 7, Math.min(VIDEO_PLAY_END, actionEnd)], [0, 0.84], {
    ...CLAMP,
    easing: Easing.linear,
  });

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
          opacity: titleOpacity,
        }}
      >
        {VIDEO_TITLE_LINES.map((line) => (
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
            <div
              style={{
                position: "absolute",
                top: SCREEN_TOP_PADDING,
                left: 0,
                width: 400,
                height: 1042,
              }}
            >
              <VideoSectionMock progress={videoProgress} pressProgress={pressPulse} rippleProgress={rippleProgress} />
            </div>
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
