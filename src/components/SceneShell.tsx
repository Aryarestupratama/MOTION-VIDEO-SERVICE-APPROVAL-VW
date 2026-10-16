import React, { type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PhoneFrame } from "./PhoneFrame";
import { COLORS, fontFamily } from "../theme";

export const TITLE_ZONE_HEIGHT = 380;
export const GAP = 80;
export const PHONE_WIDTH = 418;
export const PHONE_HEIGHT = 1060;
export const CAMERA_FULL_SCALE = 1.25;
export const CAMERA_ZOOM_SCALE = 2.33;
export const PHONE_TOP = TITLE_ZONE_HEIGHT + GAP;

export type SceneShellPhase = {
  frame: number;
  fps: number;
  actionStart: number;
  actionEnd: number;
  actionFrame: number;
};

type SceneShellProps = {
  title: string;
  durationInFrames: number;
  children: ReactNode | ((phase: SceneShellPhase) => ReactNode);
};

const TITLE_FADE_IN = [0, 20] as const;
const TITLE_HOLD = [20, 40] as const;
const TITLE_MOVE = [40, 65] as const;
const PHONE_ENTRANCE = [55, 90] as const;
const TITLE_FADE_OUT = [90, 115] as const;
const CAMERA_ZOOM_IN = [90, 115] as const;
const CAMERA_ZOOM_OUT_DURATION = 30;
const END_HOLD_DURATION = 20;
const CAMERA_ZOOM_TRANSLATE_Y = -120;
const TITLE_CENTER_TOP = 770;
const TITLE_ZONE_TOP = 96;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SceneShell: React.FC<SceneShellProps> = ({
  title,
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const actionStart = TITLE_FADE_OUT[1];
  const zoomOutStart = durationInFrames - END_HOLD_DURATION - CAMERA_ZOOM_OUT_DURATION;
  const actionEnd = zoomOutStart;
  const zoomOutEnd = durationInFrames - END_HOLD_DURATION;

  const titleOpacity = Math.min(
    interpolate(frame, TITLE_FADE_IN, [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(frame, TITLE_FADE_OUT, [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  );
  const titleTop = interpolate(
    frame,
    [0, TITLE_FADE_IN[1], TITLE_HOLD[1], TITLE_MOVE[1], TITLE_FADE_OUT[0], TITLE_FADE_OUT[1]],
    [TITLE_CENTER_TOP + 24, TITLE_CENTER_TOP, TITLE_CENTER_TOP, TITLE_ZONE_TOP, TITLE_ZONE_TOP, TITLE_ZONE_TOP - 30],
    {
      ...clamp,
      easing: [Easing.out(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)],
    }
  );
  const entrance = spring({
    frame: frame - PHONE_ENTRANCE[0],
    fps,
    durationInFrames: PHONE_ENTRANCE[1] - PHONE_ENTRANCE[0],
    config: { damping: 180, mass: 0.9 },
  });
  const entranceTranslateY = interpolate(entrance, [0, 1], [960, 0], clamp);
  const phoneOpacity = interpolate(frame, [PHONE_ENTRANCE[0], PHONE_ENTRANCE[0] + 12], [0, 1], clamp);
  const cameraScale = interpolate(
    frame,
    [0, CAMERA_ZOOM_IN[0], CAMERA_ZOOM_IN[1], zoomOutStart, zoomOutEnd, durationInFrames],
    [CAMERA_FULL_SCALE, CAMERA_FULL_SCALE, CAMERA_ZOOM_SCALE, CAMERA_ZOOM_SCALE, CAMERA_FULL_SCALE, CAMERA_FULL_SCALE],
    {
      ...clamp,
      easing: [Easing.linear, Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic), Easing.linear],
    }
  );
  const zoomTranslateY = interpolate(
    frame,
    [CAMERA_ZOOM_IN[0], CAMERA_ZOOM_IN[1], zoomOutStart, zoomOutEnd],
    [0, CAMERA_ZOOM_TRANSLATE_Y, CAMERA_ZOOM_TRANSLATE_Y, 0],
    { ...clamp, easing: [Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)] }
  );
  const floatingFrames = Array.from(
    { length: Math.ceil((durationInFrames - PHONE_ENTRANCE[1]) / 30) + 1 },
    (_, index) => PHONE_ENTRANCE[1] + index * 30
  );
  const floatingOffsets = floatingFrames.map((_, index) => (index % 2 === 0 ? 0 : -6));
  const floatingY = interpolate(frame, floatingFrames, floatingOffsets, {
    ...clamp,
    easing: Array(floatingFrames.length - 1).fill(Easing.inOut(Easing.cubic)),
  });
  const rotateX = interpolate(frame, PHONE_ENTRANCE, [7, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const rotateY = interpolate(frame, PHONE_ENTRANCE, [-5, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const phase: SceneShellPhase = {
    frame,
    fps,
    actionStart,
    actionEnd,
    actionFrame: frame - actionStart,
  };
  const screenContent = typeof children === "function" ? children(phase) : children;

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
        <span>{title}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: (1080 - PHONE_WIDTH) / 2,
          top: PHONE_TOP,
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
        <PhoneFrame>{screenContent}</PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
