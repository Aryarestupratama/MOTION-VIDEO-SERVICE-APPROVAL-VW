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

// ---------- Teks intro (mudah diubah) ----------
const TITLE = "Proses Servis Kendaraan Anda";
const SUBTITLE = "5 tahap, dari appointment sampai selesai";

// ---------- Gaya intro ----------
const VW_BLUE = "#161E59";
const WHITE = "#FFFFFF";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type IntroSceneProps = { fontFamily: string };

export const IntroScene: React.FC<IntroSceneProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    durationInFrames: 20,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: VW_BLUE,
        color: WHITE,
        fontFamily,
        alignItems: "center",
        justifyContent: "center",
        padding: 100,
        textAlign: "center",
      }}
    >
      <Img
        src={staticFile("vw-logo-white.png")}
        style={{
          width: 540,
          height: 260,
          objectFit: "contain",
          opacity: interpolate(frame, [0, 20], [0, 1], clamp),
          scale: logoScale,
          marginBottom: 72,
        }}
      />
      <div
        style={{
          maxWidth: 880,
          fontSize: 76,
          lineHeight: 1.15,
          fontWeight: 700,
          opacity: interpolate(frame, [15, 40], [0, 1], clamp),
          translate: `0 ${interpolate(frame, [15, 40], [64, 0], {
            ...clamp,
            easing: Easing.spring({ damping: 200 }),
          })}px`,
        }}
      >
        {TITLE}
      </div>
      <div
        style={{
          maxWidth: 840,
          marginTop: 32,
          fontSize: 42,
          lineHeight: 1.4,
          fontWeight: 400,
          opacity: interpolate(frame, [30, 50], [0, 1], clamp),
        }}
      >
        {SUBTITLE}
      </div>
    </AbsoluteFill>
  );
};
