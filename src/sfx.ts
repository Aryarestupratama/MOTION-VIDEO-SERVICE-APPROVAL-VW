// Katalog efek suara. File dibuat oleh tools/make-sfx.py (sintesis sendiri).
// Volume default 0.25-0.6, seimbang satu sama lain.
export const SFX = {
  whoosh: { file: "audio/sfx/whoosh.wav", volume: 0.35, durationSec: 0.7 },
  swipe: { file: "audio/sfx/swipe.wav", volume: 0.3, durationSec: 0.4 },
  tap: { file: "audio/sfx/tap.wav", volume: 0.4, durationSec: 0.2 },
  tick: { file: "audio/sfx/tick.wav", volume: 0.25, durationSec: 0.1 },
  pop: { file: "audio/sfx/pop.wav", volume: 0.4, durationSec: 0.25 },
  chime: { file: "audio/sfx/chime.wav", volume: 0.5, durationSec: 1.2 },
  thud: { file: "audio/sfx/thud.wav", volume: 0.5, durationSec: 0.6 },
  ding: { file: "audio/sfx/ding.wav", volume: 0.4, durationSec: 0.9 },
} as const;

export type SfxName = keyof typeof SFX;
