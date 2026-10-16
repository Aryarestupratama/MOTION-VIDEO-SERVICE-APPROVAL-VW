import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { STATUS_ITEMS, StatusHeroMock } from "../components/StatusHeroMock";
import type { StatusKey } from "../components/StatusHeroMock";
import { COLORS, fontFamily } from "../theme";

// ---------- Teks, status, dan timing (frame lokal scene; 30 fps) ----------
const TITLE = "4 Status, Terpantau Real-Time";
export const STATUS_SHOWCASE_FRAMES = 390;
const TITLE_ZONE_HEIGHT = 380;
const GAP = 80;
const TITLE_CENTER_TOP = 770;
const TITLE_ZONE_TOP = 96;
const TITLE_FADE_IN = [0, 25] as const;
const TITLE_MOVE = [50, 80] as const;
const TITLE_FADE_OUT = [130, 160] as const;
const PHONE_ENTERS = [65, 105] as const;
const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const CAMERA_LEFT = (1080 - PHONE_WIDTH) / 2;
const CAMERA_TOP = TITLE_ZONE_HEIGHT + GAP;
const CAMERA_FULL_SCALE = 1.25;
const CAMERA_ZOOM_SCALE = 2.33;
const CAMERA_ZOOM_IN = [130, 160] as const;
const CAMERA_ZOOM_OUT = [340, 370] as const;
const CAMERA_ZOOM_TRANSLATE_Y = -120;
const STATUS_START = 160;
const STATUS_INTERVAL = 45;
const STATUS_CROSSFADE = 20;
const FLOATING_FRAMES = [105, 135, 165, 195, 225, 255, 285, 315, 345, 375, 390] as const;
const FLOATING_Y = [0, -6, 0, -6, 0, -6, 0, -6, 0, -6, 0] as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const statusStarts = STATUS_ITEMS.map((_, index) => STATUS_START + index * STATUS_INTERVAL);

export const StatusShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = Math.min(
    interpolate(frame, TITLE_FADE_IN, [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(frame, TITLE_FADE_OUT, [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  );
  const titleTop = interpolate(
    frame,
    [0, TITLE_FADE_IN[1], TITLE_MOVE[0], TITLE_MOVE[1], TITLE_FADE_OUT[0], TITLE_FADE_OUT[1]],
    [TITLE_CENTER_TOP + 24, TITLE_CENTER_TOP, TITLE_CENTER_TOP, TITLE_ZONE_TOP, TITLE_ZONE_TOP, TITLE_ZONE_TOP - 30],
    {
      ...clamp,
      easing: [Easing.out(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)],
    }
  );

  const phoneEntrance = spring({
    frame: frame - PHONE_ENTERS[0],
    fps,
    durationInFrames: PHONE_ENTERS[1] - PHONE_ENTERS[0],
    config: { damping: 180, mass: 0.9 },
  });
  const entranceTranslateY = interpolate(phoneEntrance, [0, 1], [960, 0], clamp);
  const floatingY = interpolate(frame, FLOATING_FRAMES, FLOATING_Y, {
    ...clamp,
    easing: Array(FLOATING_FRAMES.length - 1).fill(Easing.inOut(Easing.cubic)),
  });
  const cameraScale = interpolate(
    frame,
    [0, CAMERA_ZOOM_IN[0], CAMERA_ZOOM_IN[1], CAMERA_ZOOM_OUT[0], CAMERA_ZOOM_OUT[1], STATUS_SHOWCASE_FRAMES],
    [CAMERA_FULL_SCALE, CAMERA_FULL_SCALE, CAMERA_ZOOM_SCALE, CAMERA_ZOOM_SCALE, CAMERA_FULL_SCALE, CAMERA_FULL_SCALE],
    {
      ...clamp,
      easing: [Easing.linear, Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic), Easing.linear],
    }
  );
  const zoomTranslateY = interpolate(
    frame,
    [CAMERA_ZOOM_IN[0], CAMERA_ZOOM_IN[1], CAMERA_ZOOM_OUT[0], CAMERA_ZOOM_OUT[1]],
    [0, CAMERA_ZOOM_TRANSLATE_Y, CAMERA_ZOOM_TRANSLATE_Y, 0],
    { ...clamp, easing: [Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)] }
  );
  const rotateX = interpolate(frame, PHONE_ENTERS, [7, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const rotateY = interpolate(frame, PHONE_ENTERS, [-5, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const phoneOpacity = interpolate(frame, [PHONE_ENTERS[0], PHONE_ENTERS[0] + 12], [0, 1], clamp);

  const currentIndex = Math.max(0, Math.min(STATUS_ITEMS.length - 1, Math.floor((frame - STATUS_START) / STATUS_INTERVAL)));
  const isShowingStatuses = frame >= STATUS_START;
  const transitionStart = statusStarts[currentIndex];
  const transitionProgress = interpolate(
    frame,
    [transitionStart, transitionStart + STATUS_CROSSFADE],
    [0, 1],
    clamp
  );

  const currentStatus = STATUS_ITEMS[currentIndex];
  const previousStatus = currentIndex > 0 ? STATUS_ITEMS[currentIndex - 1] : null;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: `linear-gradient(145deg, ${COLORS.vwBlue} 0%, #101743 58%, #0C1238 100%)`,
        color: COLORS.white,
        fontFamily,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 760px 1000px at 50% 55%, rgba(0,176,240,0.27) 0%, rgba(0,176,240,0.08) 45%, transparent 76%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          zIndex: 4,
          top: titleTop,
          left: 80,
          right: 80,
          height: TITLE_ZONE_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: COLORS.white,
          fontSize: 70,
          lineHeight: 1.12,
          fontWeight: 700,
          opacity: titleOpacity,
        }}
      >
        <span>{TITLE}</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: CAMERA_LEFT,
          top: CAMERA_TOP,
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          zIndex: 2,
          transformOrigin: "50% 0%",
          opacity: phoneOpacity,
          scale: cameraScale,
          translate: `0 ${entranceTranslateY + zoomTranslateY + floatingY}px`,
          transform: `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <PhoneFrame>
          {isShowingStatuses ? (
            <>
              {previousStatus && transitionProgress < 1 ? (
                <StatusHeroMock
                  key={`out-${previousStatus.key}`}
                  status={previousStatus.key as StatusKey}
                  progress={1 - transitionProgress}
                  isIncoming={false}
                />
              ) : null}
              <StatusHeroMock
                key={`in-${currentStatus.key}`}
                status={currentStatus.key as StatusKey}
                progress={previousStatus ? transitionProgress : 1}
                isIncoming
              />
            </>
          ) : (
            <StatusHeroMock status="work_in_progress" progress={1} isIncoming={false} />
          )}
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
