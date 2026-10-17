import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { WordLines } from "../components/WordLines";
import { EASE, FONTS, SPRING } from "../theme";

const LOGO_AT = 0.2;
const TITLE_AT = 1.45;
const SUBTITLE_AT = 2.7;
const LOGO_SIZE = 260;

type TextLineProps = {
  text: string;
  startSec: number;
  fontSize: number;
  fontWeight: number;
  color: string;
};

// Animasi teks sama dengan scene lain: kata demi kata, bounce, rata tengah.
const TextLine: React.FC<TextLineProps> = ({ text, startSec, fontSize, fontWeight, color }) => (
  <div style={{ fontSize, fontWeight, lineHeight: 1.2, color, textAlign: "center" }}>
    <WordLines lines={[text]} startSec={startSec} nowrap />
  </div>
);

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = 0.55 + springIn(frame, fps, LOGO_AT, SPRING.smooth) * 0.45;
  const logoOpacity = tween(frame, LOGO_AT, LOGO_AT + 0.28, 0, 1, EASE.out);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        fontFamily: FONTS.headline,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            overflow: "hidden",
            marginBottom: 54,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile("images/vw-logo-navy.jpeg")}
            style={{
              position: "absolute",
              width: LOGO_SIZE * 1.5,
              height: LOGO_SIZE * 1.5,
              left: -LOGO_SIZE * 0.25,
              top: -LOGO_SIZE * 0.25,
              maxWidth: "none",
            }}
          />
        </div>

        <TextLine
          text="New Service Process"
          startSec={TITLE_AT}
          fontSize={72}
          fontWeight={700}
          color="#161E59"
        />
        <TextLine
          text="VW PIK"
          startSec={SUBTITLE_AT}
          fontSize={48}
          fontWeight={500}
          color="#161E59"
        />
      </div>
    </AbsoluteFill>
  );
};
