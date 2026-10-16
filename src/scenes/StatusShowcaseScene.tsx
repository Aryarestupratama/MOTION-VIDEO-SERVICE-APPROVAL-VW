import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { PhoneFrame } from "../components/PhoneFrame";
import { STATUS_ITEMS, StatusHeroMock } from "../components/StatusHeroMock";
import type { StatusKey } from "../components/StatusHeroMock";
import { COLORS, EASE, FONTS, SPRING, fontFamily } from "../theme";

const TITLE_LINES = ["4 Status,", "Terpantau Real-Time"] as const;
export const STATUS_SHOWCASE_FRAMES = 390;
const PHONE_ENTERS = [92, 116] as const;
const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const PHONE_SCALE = 1.8;
// CSS scale grows around the element center, so center the unscaled box first.
const PHONE_LEFT = (1080 - PHONE_WIDTH) / 2;
const PHONE_TOP = 480;
const TITLE_START_SEC = 0.28;
const TITLE_EXIT_SEC = 2.95;
const STATUS_START = 160;
const STATUS_INTERVAL = 45;
const STATUS_CROSSFADE = 20;
const LABEL_FADE_IN = [145, 162] as const;
const LABEL_FADE_OUT = [354, 372] as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const statusStarts = STATUS_ITEMS.map((_, index) => STATUS_START + index * STATUS_INTERVAL);
const STATUS_LABELS: Record<StatusKey, string> = {
  work_in_progress: "Sedang Dikerjakan",
  quality_control: "Kontrol Kualitas",
  invoice_preparation: "Persiapan Tagihan",
  completed: "Selesai",
};

export const StatusShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;
  const titleFadeOut = 1 - tween(frame, TITLE_EXIT_SEC, TITLE_EXIT_SEC + 0.32, 0, 1, EASE.inOut);
  const titleFadeIn = tween(frame, TITLE_START_SEC, TITLE_START_SEC + 0.3, 0, 1, EASE.out);
  const titleOpacity = Math.min(titleFadeIn, titleFadeOut);
  const titleTop = interpolate(
    frame,
    [0, 8, 50, 80, TITLE_EXIT_SEC * fps, (TITLE_EXIT_SEC + 0.32) * fps],
    [402, 402, 402, 95, 95, 65],
    { ...clamp, easing: [Easing.linear, Easing.linear, Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)] },
  );

  const phoneEntrance = spring({
    frame: frame - PHONE_ENTERS[0],
    fps,
    durationInFrames: PHONE_ENTERS[1] - PHONE_ENTERS[0],
    config: { damping: 180, mass: 0.9 },
  });
  const entranceTranslateY = interpolate(phoneEntrance, [0, 1], [740, 0], clamp);
  const phoneOpacity = interpolate(frame, [PHONE_ENTERS[0], PHONE_ENTERS[0] + 10], [0, 1], clamp);

  const currentIndex = Math.max(0, Math.min(STATUS_ITEMS.length - 1, Math.floor((frame - STATUS_START) / STATUS_INTERVAL)));
  const transitionStart = statusStarts[currentIndex];
  const transitionProgress = interpolate(frame, [transitionStart, transitionStart + STATUS_CROSSFADE], [0, 1], clamp);
  const currentStatus = STATUS_ITEMS[currentIndex];
  const previousStatus = currentIndex > 0 ? STATUS_ITEMS[currentIndex - 1] : null;
  const labelOpacity = Math.min(
    interpolate(frame, LABEL_FADE_IN, [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(frame, LABEL_FADE_OUT, [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) }),
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.white, color: COLORS.vwBlue, fontFamily }}>
      <div
        style={{
          position: "absolute",
          top: titleTop,
          left: 70,
          right: 70,
          height: 230,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: FONTS.headline,
          fontSize: 70,
          lineHeight: 1.15,
          fontWeight: 700,
          color: COLORS.vwBlue,
          opacity: titleOpacity,
        }}
      >
        {TITLE_LINES.map((line) => (
          <div key={line} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "0.24em" }}>
            {line.split(" ").map((word) => {
              const at = TITLE_START_SEC + wordIndex * 0.09;
              wordIndex += 1;
              const bounce = springIn(frame, fps, at, SPRING.pop);
              const fadeIn = tween(frame, at, at + 0.24, 0, 1, EASE.out);
              return (
                <span key={`${word}-${wordIndex}`} style={{ display: "inline-block", opacity: fadeIn, transform: `translateY(${(1 - bounce) * 34}px) scale(${0.96 + bounce * 0.04})`, transformOrigin: "50% 100%" }}>
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
          zIndex: 3,
          top: 270,
          left: 80,
          right: 80,
          textAlign: "center",
          fontFamily: FONTS.headline,
          fontSize: 72,
          fontWeight: 700,
          color: COLORS.vwBlue,
          opacity: labelOpacity,
          transform: `translateY(${(1 - labelOpacity) * 14}px)`,
        }}
      >
        {STATUS_LABELS[currentStatus.key]}
      </div>

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
          translate: `0 ${entranceTranslateY}px`,
        }}
      >
        <PhoneFrame>
          {frame >= STATUS_START && previousStatus ? (
            <>
              <StatusHeroMock status={previousStatus.key as StatusKey} progress={1 - transitionProgress} isIncoming={false} />
              <StatusHeroMock status={currentStatus.key as StatusKey} progress={transitionProgress} isIncoming />
            </>
          ) : (
            <StatusHeroMock status="work_in_progress" progress={1} isIncoming={false} />
          )}
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
