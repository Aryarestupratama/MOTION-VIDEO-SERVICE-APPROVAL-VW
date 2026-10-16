import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { EASE, FONTS, SPRING } from "../theme";

const WORD_STAGGER_SEC = 0.09;
const PHRASE_FADE_SEC = 0.32;

const PHRASES = [
  { lines: ["Selama ini servis terasa", "tidak transparan"], startSec: 0.3, exitSec: 1.65, fontSize: 78, weight: 700 },
  { lines: ["Pelanggan menunggu", "tanpa kabar"], startSec: 1.95, exitSec: 3.2, fontSize: 68, weight: 600 },
  { lines: ["Persetujuan biaya hanya", "lewat telepon"], startSec: 3.5, exitSec: 4.8, fontSize: 68, weight: 600 },
  { lines: ["Tidak tahu servis sudah", "sampai tahap mana"], startSec: 5.1, exitSec: 6.75, fontSize: 68, weight: 600 },
] as const;

type AnimatedPhraseProps = {
  lines: readonly string[];
  startSec: number;
  exitSec: number;
  fontSize: number;
  weight: number;
};

const AnimatedPhrase: React.FC<AnimatedPhraseProps> = ({ lines, startSec, exitSec, fontSize, weight }) => {
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
        color: "#161E59",
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

export const ProblemScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFFFFF", color: "#161E59", fontFamily: FONTS.headline }}>
    {PHRASES.map((phrase) => (
      <AnimatedPhrase key={phrase.lines.join(" ")} {...phrase} />
    ))}
  </AbsoluteFill>
);
