import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  InspectionReportMock,
  REPORT_TOTAL_HEIGHT,
} from "../components/InspectionReportMock";
import { PhoneFrame } from "../components/PhoneFrame";
import { COLORS, fontFamily } from "../theme";

// ---------- Konten dan timing (frame lokal scene, 30 fps) ----------
const TITLE = "Solusinya: Pantau Servis dari HP Anda";
const SCENE_FRAMES = 420;
const TITLE_ZONE_HEIGHT = 380;
const GAP = 80;
const TITLE_CENTER_TOP = 875;
const TITLE_ZONE_TOP = 96;
const TITLE_ENTER = [0, 25] as const;
const TITLE_HOLD_END = 60;
const TITLE_MOVE = [60, 95] as const;
const TITLE_EXIT = [150, 180] as const;
const PHONE_ENTERS = [80, 125] as const;
const PHONE_WIDTH = 418;
const PHONE_HEIGHT = 1060;
const CAMERA_LEFT = (1080 - PHONE_WIDTH) / 2;
const CAMERA_TOP = TITLE_ZONE_HEIGHT + GAP;
const CAMERA_FULL_SCALE = 1.25;
const CAMERA_ZOOM_SCALE = 2.33;
const CAMERA_ZOOM_IN = [150, 180] as const;
const CAMERA_ZOOM_OUT = [355, 390] as const;
const CAMERA_ZOOM_TRANSLATE_Y = -120;
// Ukuran nyata pada komponen yang sudah ada: mock 3480px, layar PhoneFrame
// 1060px dikurangi inset 9px atas dan bawah. Padding 24px memberi ruang dasar.
const PHONE_SCREEN_HEIGHT = PHONE_HEIGHT - 9 - 9;
const BOTTOM_PADDING = 24;
const SCROLL_DISTANCE = REPORT_TOTAL_HEIGHT - PHONE_SCREEN_HEIGHT + BOTTOM_PADDING;
const REPORT_SCROLL = [180, 340] as const;
const FLOATING_FRAMES = [125, 155, 185, 215, 245, 275, 305, 335, 365, 390, 420] as const;
const FLOATING_Y = [0, -6, 0, -6, 0, -6, 0, -6, 0, -6, 0] as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = Math.min(
    interpolate(frame, TITLE_ENTER, [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
    interpolate(frame, TITLE_EXIT, [1, 0], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    })
  );
  const titleTop = interpolate(
    frame,
    [0, TITLE_ENTER[1], TITLE_HOLD_END, TITLE_MOVE[1], TITLE_EXIT[0], TITLE_EXIT[1]],
    [TITLE_CENTER_TOP + 24, TITLE_CENTER_TOP, TITLE_CENTER_TOP, TITLE_ZONE_TOP, TITLE_ZONE_TOP, TITLE_ZONE_TOP - 30],
    {
      ...clamp,
      easing: [
        Easing.out(Easing.cubic),
        Easing.linear,
        Easing.inOut(Easing.cubic),
        Easing.linear,
        Easing.inOut(Easing.cubic),
      ],
    }
  );

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
    easing: Easing.linear,
  });

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
          alignItems: "flex-start",
          justifyContent: "center",
          textAlign: "center",
          color: COLORS.white,
          fontSize: 70,
          lineHeight: 1.12,
          fontWeight: 700,
          opacity: titleOpacity,
          translate: "0 0",
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
          <InspectionReportMock
            scrollY={scrollY}
            buttonScale={1}
            rippleScale={0}
            rippleOpacity={0}
            approvedProgress={0}
            checkProgress={0}
            photoStartFrame={180}
          />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
