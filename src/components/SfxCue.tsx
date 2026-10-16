import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { SFX, type SfxName } from "../sfx";
import { sec } from "../theme";

type SfxCueProps = {
  name: SfxName;
  /** Detik kejadian visual, relatif ke Sequence/scene induk. Tulis sebagai konstanta di samping animasinya. */
  at: number;
  /** Menimpa volume default katalog (0.25-0.6). */
  volume?: number;
  /** Fade in/out dalam detik (0.1-0.3) untuk efek panjang. */
  fadeInSec?: number;
  fadeOutSec?: number;
};

export const SfxCue: React.FC<SfxCueProps> = ({
  name,
  at,
  volume,
  fadeInSec = 0,
  fadeOutSec = 0,
}) => {
  const def = SFX[name];
  const base = volume ?? def.volume;
  const total = sec(def.durationSec);
  const fadeIn = sec(fadeInSec);
  const fadeOut = sec(fadeOutSec);

  const volumeAt = (f: number): number => {
    const inGain = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
    const outGain =
      fadeOut > 0
        ? interpolate(f, [total - fadeOut, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        : 1;
    return base * inGain * outGain;
  };

  return (
    <Sequence from={sec(at)} durationInFrames={total} layout="none" name={`SFX ${name}`}>
      <Audio src={staticFile(def.file)} volume={volumeAt} />
    </Sequence>
  );
};
