import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { tween } from "../motion";
import { PhoneFrame } from "../components/PhoneFrame";
import { WordLines } from "../components/WordLines";
import { STATUS_ITEMS, StatusHeroMock } from "../components/StatusHeroMock";
import type { StatusKey } from "../components/StatusHeroMock";
import { COLORS, EASE, FONTS, fontFamily } from "../theme";

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
const TITLE_BOX_HEIGHT = 230;
// Judul mulai tepat di tengah layar (seperti Solution), lalu naik setelah selesai dibaca.
const TITLE_CENTER_TOP = (1920 - TITLE_BOX_HEIGHT) / 2;
const TITLE_EXIT_SEC = 2.95;
const STATUS_START = 160;
const STATUS_INTERVAL = 45;
const STATUS_CROSSFADE = 20;
// Label status: tiap status punya teks sendiri yang muncul kata demi kata.
const LABEL_FIRST_SEC = 4.8;
const LABEL_EXIT_SEC = 11.8;
const LABEL_FADE_SEC = 0.25;
const LABEL_TOP = 270;
const LABEL_BOX_HEIGHT = 110;
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
  const titleFadeOut = 1 - tween(frame, TITLE_EXIT_SEC, TITLE_EXIT_SEC + 0.32, 0, 1, EASE.inOut);
  const titleFadeIn = tween(frame, TITLE_START_SEC, TITLE_START_SEC + 0.3, 0, 1, EASE.out);
  const titleOpacity = Math.min(titleFadeIn, titleFadeOut);
  const titleTop = interpolate(
    frame,
    [0, 8, 50, 80, TITLE_EXIT_SEC * fps, (TITLE_EXIT_SEC + 0.32) * fps],
    [TITLE_CENTER_TOP, TITLE_CENTER_TOP, TITLE_CENTER_TOP, 95, 95, 65],
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
  // Tiap label: mulai saat statusnya mulai, hilang cepat saat status berikutnya datang.
  const labelStarts = statusStarts.map((start, index) => (index === 0 ? LABEL_FIRST_SEC : start / fps));
  const labelEnds = statusStarts.map((_, index) => (index < STATUS_ITEMS.length - 1 ? labelStarts[index + 1] - LABEL_FADE_SEC : LABEL_EXIT_SEC));

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.white, color: COLORS.vwBlue, fontFamily }}>
      <div
        style={{
          position: "absolute",
          top: titleTop,
          left: 70,
          right: 70,
          height: TITLE_BOX_HEIGHT,
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
        <WordLines lines={TITLE_LINES} startSec={TITLE_START_SEC} />
      </div>

      {STATUS_ITEMS.map((item, index) => {
        const fadeOut = 1 - tween(frame, labelEnds[index], labelEnds[index] + LABEL_FADE_SEC, 0, 1, EASE.inOut);
        if (frame < labelStarts[index] * fps - 1 || fadeOut <= 0) return null;
        return (
          <div
            key={item.key}
            style={{
              position: "absolute",
              zIndex: 3,
              top: LABEL_TOP,
              left: 80,
              right: 80,
              height: LABEL_BOX_HEIGHT,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: FONTS.headline,
              fontSize: 72,
              lineHeight: 1.15,
              fontWeight: 700,
              color: COLORS.vwBlue,
              opacity: fadeOut,
            }}
          >
            <WordLines lines={[STATUS_LABELS[item.key as StatusKey]]} startSec={labelStarts[index]} />
          </div>
        );
      })}

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
          <StatusHeroMock index={currentIndex} changeProgress={frame >= STATUS_START ? transitionProgress : 1} />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
