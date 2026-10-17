import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { springIn, tween } from "../motion";
import { EASE, SPRING } from "../theme";

export const WORD_STAGGER_SEC = 0.09;

type WordLinesProps = {
  /** Satu string = satu baris. Tiap kata muncul bergantian (bounce + fade). */
  lines: readonly string[];
  /** Detik mulai kata pertama, relatif ke scene. */
  startSec: number;
  staggerSec?: number;
  /** Paksa tiap baris tetap satu baris (tanpa wrap). */
  nowrap?: boolean;
  /** Jarak antar-kata dalam em. */
  gapEm?: number;
};

/**
 * Animasi teks standar seluruh video (sama dengan Solution scene):
 * kata demi kata, naik 34px dengan pantulan kecil (SPRING.pop) + fade, rata tengah.
 * Fade-out dikerjakan oleh pembungkusnya lewat opacity.
 */
export const WordLines: React.FC<WordLinesProps> = ({
  lines,
  startSec,
  staggerSec = WORD_STAGGER_SEC,
  nowrap = false,
  gapEm = 0.24,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;

  return (
    <>
      {lines.map((line, lineIndex) => (
        <div
          key={`${line}-${lineIndex}`}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: nowrap ? "nowrap" : "wrap",
            whiteSpace: nowrap ? "nowrap" : undefined,
            columnGap: `${gapEm}em`,
          }}
        >
          {line.split(" ").map((word) => {
            const at = startSec + wordIndex * staggerSec;
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
    </>
  );
};
