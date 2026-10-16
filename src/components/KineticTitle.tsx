import React from "react";
import { useCurrentFrame } from "remotion";
import { blurIn } from "../motion";
import { COLORS, FONTS, MOTION, TYPE } from "../theme";

type KineticTitleProps = {
  /** Baris pertama tebal (opsional), tampil di barisnya sendiri. */
  lead?: string;
  /** Frasa tebal (Poppins 800). */
  bold: string;
  /** Satu kata/frasa pendek serif italic, muncul 0.15 dtk setelah kata tebal. */
  accent?: string;
  /** Detik mulai, relatif ke scene. */
  startSec?: number;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
};

export const KineticTitle: React.FC<KineticTitleProps> = ({
  lead,
  bold,
  accent,
  startSec = 0,
  fontSize = 96,
  color = COLORS.white,
  style,
}) => {
  const frame = useCurrentFrame();
  const size = Math.min(TYPE.titleMax, Math.max(TYPE.titleMin, fontSize));
  const boldStart = startSec + (lead ? MOTION.lineStaggerSec : 0);
  return (
    <div
      style={{
        textAlign: "center",
        color,
        fontFamily: FONTS.headline,
        fontWeight: 800,
        fontSize: size,
        lineHeight: TYPE.titleLineHeight,
        ...style,
      }}
    >
      {lead ? (
        <div style={{ ...blurIn(frame, startSec) }}>{lead}</div>
      ) : null}
      <span style={{ display: "inline-block", ...blurIn(frame, boldStart) }}>{bold}</span>
      {accent ? (
        <>
          {" "}
          <span
            style={{
              display: "inline-block",
              fontFamily: FONTS.accent,
              fontStyle: "italic",
              fontWeight: 400,
              ...blurIn(frame, boldStart + MOTION.accentDelaySec),
            }}
          >
            {accent}
          </span>
        </>
      ) : null}
    </div>
  );
};
