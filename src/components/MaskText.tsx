import React from "react";
import { useCurrentFrame } from "remotion";
import { tween } from "../motion";
import { EASE } from "../theme";

type MaskTextProps = {
  /** Satu baris teks. Tiap kata naik dari balik garis potong, satu per satu. */
  text: string;
  /** Detik mulai kata pertama, relatif ke scene. */
  startSec: number;
  staggerSec?: number;
  durationSec?: number;
  /** Jarak naik awal, dalam persen tinggi baris. */
  risePercent?: number;
  blurPx?: number;
  style?: React.CSSProperties;
};

export const MaskText: React.FC<MaskTextProps> = ({
  text,
  startSec,
  staggerSec = 0.09,
  durationSec = 0.7,
  risePercent = 115,
  blurPx = 8,
  style,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        columnGap: "0.28em",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const at = startSec + i * staggerSec;
        const rise = tween(frame, at, at + durationSec, 0, 1, EASE.out);
        const fade = tween(frame, at, at + durationSec * 0.45, 0, 1, EASE.out);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              padding: "0.16em 0.06em",
              margin: "-0.16em -0.06em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - rise) * risePercent}%)`,
                opacity: fade,
                filter: `blur(${(1 - rise) * blurPx}px)`,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};
