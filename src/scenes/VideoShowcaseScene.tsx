import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { VideoSectionMock } from "../components/VideoSectionMock";

// ---------- Teks dan timing scene (frame lokal; 30 fps) ----------
export const VIDEO_SHOWCASE_FRAMES = 8 * 30;
const VIDEO_TITLE = "Lihat Video Kendala Mobil Anda";
const PLAY_PRESS_FRAME = 117;
const PLAY_RIPPLE_END = 140;
const VIDEO_PLAY_END = 188;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const VideoShowcaseScene: React.FC = () => (
  <SceneShell title={VIDEO_TITLE} durationInFrames={VIDEO_SHOWCASE_FRAMES}>
    {({ frame, fps, actionStart, actionEnd }) => {
      const pressSpring = spring({
        frame: frame - PLAY_PRESS_FRAME,
        fps,
        config: { damping: 14, stiffness: 210, mass: 0.35 },
      });
      const pressPulse = interpolate(pressSpring, [0, 0.45, 1], [0, 1, 0], clamp);
      const rippleProgress = interpolate(frame, [PLAY_PRESS_FRAME, PLAY_RIPPLE_END], [0, 1], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      });
      const videoProgress = interpolate(frame, [actionStart + 7, Math.min(VIDEO_PLAY_END, actionEnd)], [0, 0.84], {
        ...clamp,
        easing: Easing.linear,
      });

      return (
        <VideoSectionMock
          progress={videoProgress}
          pressProgress={pressPulse}
          rippleProgress={rippleProgress}
        />
      );
    }}
  </SceneShell>
);
