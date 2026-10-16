import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";

// ---------- Konten dummy (mudah diganti) ----------
const TITLE = "Selama Ini, Servis Terasa Tidak Transparan";
const PROBLEMS = [
  { text: "Customer menunggu tanpa kabar", startFrame: 25, direction: -1 },
  { text: "Persetujuan biaya hanya lewat telepon", startFrame: 45, direction: 1 },
  { text: "Tidak tahu servis sudah sampai tahap mana", startFrame: 65, direction: -1 },
] as const;

const SCENE_DURATION = 120;
const TRANSITION_FRAMES = 8;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ProblemIcon: React.FC<{ index: number }> = ({ index }) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 4,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      width={96}
      height={96}
      style={{ flexShrink: 0 }}
    >
      {index === 0 ? (
        <g {...common}>
          <path d="M16 22h64a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8H46L28 87V74h-4a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8Z" />
          <circle cx="36" cy="48" r="2" fill="currentColor" />
          <circle cx="48" cy="48" r="2" fill="currentColor" />
          <circle cx="60" cy="48" r="2" fill="currentColor" />
        </g>
      ) : index === 1 ? (
        <g {...common}>
          <rect x="22" y="10" width="52" height="76" rx="9" />
          <path d="M38 22h20M42 72h12" />
          <circle cx="69" cy="58" r="16" fill={COLORS.offWhite} />
          <path d="M73 50c-2-3-11-3-11 2 0 6 12 2 12 8 0 5-9 7-13 3m6-18v26" />
        </g>
      ) : (
        <g {...common}>
          <path d="M15 26h66M15 48h66M15 70h66" />
          <circle cx="31" cy="26" r="8" fill={COLORS.offWhite} />
          <circle cx="57" cy="48" r="8" fill={COLORS.offWhite} />
          <circle cx="39" cy="70" r="8" fill={COLORS.offWhite} />
          <path d="m28 26 2 2 4-5m20 25 2 2 4-5m-17 25 2 2 4-5" />
        </g>
      )}
    </svg>
  );
};

const ProblemCard: React.FC<{
  text: string;
  index: number;
  direction: number;
}> = ({ text, index, direction }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: 620 + index * 300,
        left: 100,
        right: 100,
        height: 232,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "36px 42px",
        borderRadius: 32,
        backgroundColor: COLORS.white,
        color: COLORS.vwBlue,
        boxShadow: "0 12px 36px rgba(22, 30, 89, 0.12)",
        opacity: interpolate(frame, [0, 18], [0, 1], clamp),
        translate: `${direction * (1 - spring({
          frame,
          fps,
          durationInFrames: 22,
          config: { damping: 180 },
        })) * 120}px 0px`,
      }}
    >
      <div
        style={{
          width: 132,
          height: 132,
          borderRadius: 28,
          backgroundColor: COLORS.offWhite,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ProblemIcon index={index} />
      </div>
      <div
        style={{
          fontSize: 42,
          lineHeight: 1.25,
          fontWeight: 600,
          color: COLORS.vwBlue,
        }}
      >
        {text}
      </div>
    </div>
  );
};

type ProblemSceneProps = { fontFamily: string };

export const ProblemScene: React.FC<ProblemSceneProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.offWhite,
        color: COLORS.vwBlue,
        fontFamily,
        opacity: interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], clamp),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 100,
          right: 100,
          textAlign: "center",
          fontSize: 72,
          lineHeight: 1.16,
          fontWeight: 700,
          opacity: interpolate(frame, [0, 20], [0, 1], clamp),
          translate: `0 ${24 * (1 - spring({
            frame,
            fps,
            durationInFrames: 20,
            config: { damping: 200 },
          }))}px`,
        }}
      >
        {TITLE}
      </div>

      {PROBLEMS.map((problem, index) => (
        <Sequence
          key={problem.text}
          name={`Problem ${index + 1}`}
          from={problem.startFrame}
          durationInFrames={SCENE_DURATION - problem.startFrame}
          premountFor={fps}
        >
          <ProblemCard
            text={problem.text}
            index={index}
            direction={problem.direction}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
