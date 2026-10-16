import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { EASE, FONTS, SPRING } from "../theme";

const LOGO_AT = 0.2;
const TITLE_AT = 1.45;
const SUBTITLE_AT = 2.7;
const LETTER_STAGGER_SEC = 0.045;
const LETTER_DURATION_SEC = 0.42;
const LOGO_SIZE = 260;

type CharacterLineProps = {
  text: string;
  startSec: number;
  fontSize: number;
  fontWeight: number;
  color: string;
};

const CharacterLine: React.FC<CharacterLineProps> = ({ text, startSec, fontSize, fontWeight, color }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        whiteSpace: "pre",
        fontSize,
        fontWeight,
        lineHeight: 1.2,
        color,
      }}
    >
      {Array.from(text).map((character, index) => {
        const at = startSec + index * LETTER_STAGGER_SEC;
        const rise = tween(frame, at, at + LETTER_DURATION_SEC, 0, 1, EASE.out);
        const fade = tween(frame, at, at + LETTER_DURATION_SEC * 0.7, 0, 1, EASE.out);

        return (
          <span
            key={`${character}-${index}`}
            style={{
              display: "inline-block",
              opacity: fade,
              transform: `translateY(${(1 - rise) * 28}px)`,
            }}
          >
            {character}
          </span>
        );
      })}
    </div>
  );
};

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

        <CharacterLine
          text="New Service Process"
          startSec={TITLE_AT}
          fontSize={72}
          fontWeight={700}
          color="#161E59"
        />
        <CharacterLine
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
