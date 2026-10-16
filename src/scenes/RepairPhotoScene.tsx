import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { RepairImageMock, REPAIR_PHOTOS } from "../components/RepairImageMock";
import { SceneShell } from "../components/SceneShell";

// ---------- Teks dan timing (frame lokal scene; 30 fps) ----------
export const REPAIR_PHOTO_SCENE_FRAMES = 10 * 30;
const TITLE = "Foto Hasil Reparasi Mobil Anda";
const STACK_START = 115;
const STACK_STAGGER = 6;
const STACK_ENTRY_DURATION = 18;
const TAP_FRAME = 135;
const VIEWER_OPEN_DURATION = 20;
const FIRST_SWIPE_FRAME = 145;
const SWIPE_INTERVAL = 30;
const SWIPE_DURATION = 20;
const VIEWER_PHOTO_WIDTH = 368;
const TAP_RIPPLE_END = 151;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const RepairPhotoScene: React.FC = () => (
  <SceneShell title={TITLE} durationInFrames={REPAIR_PHOTO_SCENE_FRAMES}>
    {({ frame, fps, actionStart }) => {
      const stackProgress = REPAIR_PHOTOS.map((_, index) => {
        const start = Math.max(actionStart, STACK_START + index * STACK_STAGGER);
        if (frame < start) return 0;
        return spring({
          frame: frame - start,
          fps,
          durationInFrames: STACK_ENTRY_DURATION,
          config: { damping: 18, mass: 0.7 },
        });
      });

      const viewerSpring = frame < TAP_FRAME ? 0 : spring({
        frame: frame - TAP_FRAME,
        fps,
        durationInFrames: VIEWER_OPEN_DURATION,
        config: { damping: 22, mass: 0.8 },
      });
      const viewerProgress = interpolate(viewerSpring, [0, 1], [0, 1], clamp);

      const slideIndex = frame < FIRST_SWIPE_FRAME
        ? 0
        : Math.min(REPAIR_PHOTOS.length - 1, 1 + Math.floor((frame - FIRST_SWIPE_FRAME) / SWIPE_INTERVAL));
      const slideStart = FIRST_SWIPE_FRAME + Math.max(0, slideIndex - 1) * SWIPE_INTERVAL;
      const isSliding = slideIndex > 0 && frame >= slideStart && frame < slideStart + SWIPE_DURATION;
      const slideSpring = isSliding
        ? spring({
            frame: frame - slideStart,
            fps,
            durationInFrames: SWIPE_DURATION,
            config: { damping: 20, mass: 0.75 },
          })
        : 1;
      const slideOffset = isSliding
        ? interpolate(slideSpring, [0, 1], [VIEWER_PHOTO_WIDTH, 0], clamp)
        : 0;

      const tapRippleProgress = frame < TAP_FRAME
        ? -1
        : interpolate(frame, [TAP_FRAME, TAP_RIPPLE_END], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });

      return (
        <RepairImageMock
          stackProgress={stackProgress}
          viewerProgress={viewerProgress}
          slideIndex={slideIndex}
          slideOffset={slideOffset}
          isSliding={isSliding}
          tapRippleProgress={tapRippleProgress}
        />
      );
    }}
  </SceneShell>
);
