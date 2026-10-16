import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// ---------- Konten dan timing (frame lokal scene; 30 fps) ----------
export const CLOSING_SCENE_FRAMES = 4 * 30;
export const CLOSING_TITLE = "VW PIK Service Approval";
export const CLOSING_TAGLINE = "Servis transparan, langsung dari HP Anda";
const LOGO_FADE = [0, 25] as const;
const LOGO_SPRING_DURATION = 25;
const TITLE_ENTER = [15, 45] as const;
const TAGLINE_ENTER = [35, 65] as const;
const GLOW_BREATHE = [65, 82, 100] as const;
const CONTENT_FADE_OUT = [100, 120] as const;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({
    frame,
    fps,
    durationInFrames: LOGO_SPRING_DURATION,
    config: { damping: 18, mass: 0.75 },
  });
  const contentOpacity = interpolate(frame, CONTENT_FADE_OUT, [1, 0], CLAMP);
  const titleProgress = interpolate(frame, TITLE_ENTER, [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const taglineOpacity = interpolate(frame, TAGLINE_ENTER, [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const glowOpacity = interpolate(frame, GLOW_BREATHE, [0.34, 0.52, 0.34], {
    ...CLAMP,
    easing: [Easing.inOut(Easing.cubic), Easing.inOut(Easing.cubic)],
  }) * interpolate(frame, CONTENT_FADE_OUT, [1, 0], CLAMP);
  const gradientOpacity = interpolate(frame, CONTENT_FADE_OUT, [0.8, 0], CLAMP);

  return (
    <AbsoluteFill style={{ overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.vwBlue, color: COLORS.white, fontFamily, textAlign: "center" }}>
      <AbsoluteFill
        aria-hidden="true"
        style={{
          opacity: gradientOpacity,
          background: "linear-gradient(145deg, #1B286F 0%, #161E59 52%, #101743 100%)",
        }}
      />
      <AbsoluteFill
        aria-hidden="true"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(ellipse 660px 540px at 50% 45%, rgba(0,176,240,0.28) 0%, rgba(0,176,240,0.11) 44%, transparent 76%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 90px", opacity: contentOpacity }}>
        <Img
          src={staticFile("vw-logo-white.png")}
          style={{
            width: 540,
            height: 260,
            objectFit: "contain",
            opacity: interpolate(frame, LOGO_FADE, [0, 1], CLAMP),
            scale: interpolate(logoSpring, [0, 1], [0.88, 1], CLAMP),
            marginBottom: 60,
          }}
        />

        <div
          style={{
            maxWidth: 900,
            fontSize: 72,
            lineHeight: 1.15,
            fontWeight: 700,
            opacity: titleProgress,
            translate: `0 ${interpolate(titleProgress, [0, 1], [62, 0], CLAMP)}px`,
          }}
        >
          {CLOSING_TITLE}
        </div>

        <div style={{ maxWidth: 860, marginTop: 28, fontSize: 42, lineHeight: 1.35, fontWeight: 400, opacity: taglineOpacity }}>
          {CLOSING_TAGLINE}
        </div>
      </div>
    </AbsoluteFill>
  );
};

