import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { springIn, tween } from "../motion";
import {
  InspectionReportMock,
  REPORT_SCROLL_DISTANCE,
  REPORT_SCROLL_END_FRAME,
  REPORT_SCROLL_START_FRAME,
} from "../components/InspectionReportMock";
import { PhoneFrame } from "../components/PhoneFrame";
import { COLORS, EASE, FONTS, SPRING, fontFamily } from "../theme";

// ---------- Konten dan timing (frame lokal scene, 30 fps) ----------
const SCENE_FRAMES = 870;
const TITLE_ZONE_HEIGHT = 380;
const GAP = 80;
const PHONE_ENTERS = [104, 116] as const;
const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const CAMERA_LEFT = (1080 - PHONE_WIDTH) / 2;
const CAMERA_TOP = TITLE_ZONE_HEIGHT + GAP;
const CAMERA_FULL_SCALE = 1.25;
const CAMERA_ZOOM_SCALE = 2.33;
const CAMERA_ZOOM_IN = [116, 138] as const;
const CAMERA_ZOOM_OUT = [820, 850] as const;
const CAMERA_ZOOM_TRANSLATE_Y = -120;
// Berhenti saat sisi bawah workshop location mencapai sisi bawah layar ponsel.
const SCROLL_DISTANCE = REPORT_SCROLL_DISTANCE;
const REPORT_SCROLL = [REPORT_SCROLL_START_FRAME, REPORT_SCROLL_END_FRAME] as const;
const FLOATING_FRAMES = [125, 155, 185, 215, 245, 275, 305, 335, 365, 390, 420] as const;
const FLOATING_Y = [0, -6, 0, -6, 0, -6, 0, -6, 0, -6, 0] as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
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

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEntrance = spring({
    frame: frame - PHONE_ENTERS[0],
    fps,
    durationInFrames: PHONE_ENTERS[1] - PHONE_ENTERS[0],
    config: { damping: 180, mass: 0.9 },
  });
  const cameraScale = interpolate(
    frame,
    [0, CAMERA_ZOOM_IN[0], CAMERA_ZOOM_IN[1], CAMERA_ZOOM_OUT[0], CAMERA_ZOOM_OUT[1], SCENE_FRAMES],
    [CAMERA_FULL_SCALE, CAMERA_FULL_SCALE, CAMERA_ZOOM_SCALE, CAMERA_ZOOM_SCALE, CAMERA_FULL_SCALE, CAMERA_FULL_SCALE],
    {
      ...clamp,
      easing: [
        Easing.linear,
        Easing.inOut(Easing.cubic),
        Easing.linear,
        Easing.inOut(Easing.cubic),
        Easing.linear,
      ],
    }
  );
  const zoomTranslateY = interpolate(
    frame,
    [CAMERA_ZOOM_IN[0], CAMERA_ZOOM_IN[1], CAMERA_ZOOM_OUT[0], CAMERA_ZOOM_OUT[1]],
    [0, CAMERA_ZOOM_TRANSLATE_Y, CAMERA_ZOOM_TRANSLATE_Y, 0],
    {
      ...clamp,
      easing: [Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)],
    }
  );
  const entranceTranslateY = interpolate(phoneEntrance, [0, 1], [960, 0], clamp);
  const floatingY = interpolate(frame, FLOATING_FRAMES, FLOATING_Y, {
    ...clamp,
    easing: Array(FLOATING_FRAMES.length - 1).fill(Easing.inOut(Easing.cubic)),
  });
  const rotateX = interpolate(frame, PHONE_ENTERS, [7, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const rotateY = interpolate(frame, PHONE_ENTERS, [-5, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const phoneOpacity = interpolate(frame, [PHONE_ENTERS[0], PHONE_ENTERS[0] + 12], [0, 1], clamp);
  const scrollY = interpolate(frame, REPORT_SCROLL, [0, SCROLL_DISTANCE], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

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
          <InspectionReportMock
            scrollY={scrollY}
          />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
