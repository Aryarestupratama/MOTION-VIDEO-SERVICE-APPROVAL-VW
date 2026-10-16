import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { IntroScene } from "./scenes/IntroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { StatusShowcaseScene } from "./scenes/StatusShowcaseScene";
import { VideoShowcaseScene } from "./scenes/VideoShowcaseScene";
import { RepairPhotoScene } from "./scenes/RepairPhotoScene";
import { PriceTransparencyScene } from "./scenes/PriceTransparencyScene";
import { PaymentUploadScene } from "./scenes/PaymentUploadScene";
import { ContactAdvisorScene } from "./scenes/ContactAdvisorScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { SfxCue } from "./components/SfxCue";
import { COLORS, FPS, fontFamily } from "./theme";
import {
  SCENE_ORDER,
  SCENE_START,
  TRANSITION_FRAMES,
  sceneFrames,
  type SceneKey,
} from "./timeline";
import { fadeScale, sweep } from "./transitions";

type AnyPresentation = TransitionPresentation<Record<string, unknown>>;

const SCENES: Record<SceneKey, React.FC> = {
  intro: IntroScene,
  problem: ProblemScene,
  solution: SolutionScene,
  status: StatusShowcaseScene,
  video: VideoShowcaseScene,
  repair: RepairPhotoScene,
  price: PriceTransparencyScene,
  payment: PaymentUploadScene,
  contact: ContactAdvisorScene,
  closing: ClosingScene,
};

// Transisi SETELAH scene tersebut. Hanya dua jenis: sweep (ganti latar
// gelap/terang) dan fadeScale (perpindahan tenang).
const TRANSITION_AFTER: Partial<Record<SceneKey, "sweep" | "fadeScale">> = {
  intro: "sweep",
  problem: "sweep",
  solution: "fadeScale",
  status: "fadeScale",
  video: "fadeScale",
  repair: "fadeScale",
  price: "fadeScale",
  payment: "fadeScale",
  contact: "fadeScale",
};

const presentationFor = (kind: "sweep" | "fadeScale"): AnyPresentation =>
  (kind === "sweep" ? sweep() : fadeScale()) as unknown as AnyPresentation;

// Satu whoosh pendek tepat di awal tiap transisi.
// Puncak whoosh ada 0.35 dtk setelah mulai; dimajukan supaya jatuh di tengah
// transisi (saat panel menutup layar / scene lama habis memudar).
const WHOOSH_LEAD_SEC = 0.15;

const WHOOSH_VOLUME: Record<"sweep" | "fadeScale", number> = {
  sweep: 0.35,
  fadeScale: 0.28,
};

export const ServiceFlow: React.FC = () => {
  const children: React.ReactElement[] = [];
  SCENE_ORDER.forEach((key, i) => {
    const Scene = SCENES[key];
    children.push(
      <TransitionSeries.Sequence key={`scene-${key}`} name={key} durationInFrames={sceneFrames(key)}>
        <Scene />
      </TransitionSeries.Sequence>,
    );
    const kind = TRANSITION_AFTER[key];
    if (kind && i < SCENE_ORDER.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`transition-${key}`}
          presentation={presentationFor(kind)}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />,
      );
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.vwBlue, fontFamily }}>
      <TransitionSeries
        style={{
          translate: "-1px 0px"
        }}
      >{children}</TransitionSeries>

      {SCENE_ORDER.slice(0, -1).map((key, i) => {
        const kind = TRANSITION_AFTER[key];
        if (!kind) return null;
        const next = SCENE_ORDER[i + 1];
        return (
          <SfxCue
            key={`whoosh-${key}`}
            name="whoosh"
            at={SCENE_START[next] / FPS - WHOOSH_LEAD_SEC}
            volume={WHOOSH_VOLUME[kind]}
          />
        );
      })}
    </AbsoluteFill>
  );
};
