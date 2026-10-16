import React from "react";
import { Composition } from "remotion";
import { ServiceFlow } from "./ServiceFlow";
import { FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./theme";
import { TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ServiceFlow"
      component={ServiceFlow}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
