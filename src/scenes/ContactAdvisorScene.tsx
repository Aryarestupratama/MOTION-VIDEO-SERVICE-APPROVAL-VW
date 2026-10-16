import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { ServiceAdvisorMock } from "../components/ServiceAdvisorMock";
import { SceneShell } from "../components/SceneShell";

// ---------- Teks dan timing (frame lokal scene; 30 fps) ----------
export const CONTACT_ADVISOR_SCENE_FRAMES = 8 * 30;
export const CONTACT_ADVISOR_TITLE = "Hubungi Service Advisor Kapan Saja";
const CARD_ENTER = [115, 140] as const;
const CONTACT_TAP_FRAME = 150;
const CONTACT_PRESS_TIMELINE = [CONTACT_TAP_FRAME, 153, 160] as const;
const CONTACT_RIPPLE_END = 168;
const PULSE_TIMELINE = [150, 154, 158, 162, 166, 170] as const;
const CHAT_ENTER_FRAME = 165;
const CHAT_SPRING_DURATION = 20;
const CARD_SPRING_CONFIG = { damping: 18, mass: 0.7 } as const;
const CHAT_SPRING_CONFIG = { damping: 17, mass: 0.65 } as const;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ContactAdvisorScene: React.FC = () => (
  <SceneShell title={CONTACT_ADVISOR_TITLE} durationInFrames={CONTACT_ADVISOR_SCENE_FRAMES}>
    {({ frame, fps }) => {
      const cardSpring = frame < CARD_ENTER[0] ? 0 : spring({
        frame: frame - CARD_ENTER[0],
        fps,
        durationInFrames: CARD_ENTER[1] - CARD_ENTER[0],
        config: CARD_SPRING_CONFIG,
      });
      const chatSpring = frame < CHAT_ENTER_FRAME ? 0 : spring({
        frame: frame - CHAT_ENTER_FRAME,
        fps,
        durationInFrames: CHAT_SPRING_DURATION,
        config: CHAT_SPRING_CONFIG,
      });
      const pulseScale = interpolate(frame, PULSE_TIMELINE, [1, 1.1, 1, 1.1, 1, 1], {
        ...CLAMP,
        easing: [Easing.out(Easing.cubic), Easing.inOut(Easing.cubic), Easing.out(Easing.cubic), Easing.inOut(Easing.cubic), Easing.linear],
      });
      const pulseOpacity = interpolate(frame, PULSE_TIMELINE, [0, 0.65, 0, 0.65, 0, 0], {
        ...CLAMP,
        easing: [Easing.out(Easing.cubic), Easing.inOut(Easing.cubic), Easing.out(Easing.cubic), Easing.inOut(Easing.cubic), Easing.linear],
      });
      const buttonPressProgress = interpolate(frame, CONTACT_PRESS_TIMELINE, [0, 1, 0], {
        ...CLAMP,
        easing: [Easing.out(Easing.cubic), Easing.inOut(Easing.cubic)],
      });
      const rippleProgress = frame < CONTACT_TAP_FRAME
        ? 0
        : interpolate(frame, [CONTACT_TAP_FRAME, CONTACT_RIPPLE_END], [0, 1], {
            ...CLAMP,
            easing: Easing.out(Easing.cubic),
          });

      return (
        <ServiceAdvisorMock
          cardOpacity={interpolate(cardSpring, [0, 1], [0, 1], CLAMP)}
          cardTranslateY={interpolate(cardSpring, [0, 1], [54, 0], CLAMP)}
          buttonPressProgress={buttonPressProgress}
          rippleProgress={rippleProgress}
          pulseScale={pulseScale}
          pulseOpacity={pulseOpacity}
          chatOpacity={interpolate(chatSpring, [0, 1], [0, 1], CLAMP)}
          chatTranslateY={interpolate(chatSpring, [0, 1], [26, 0], CLAMP)}
          chatScale={interpolate(chatSpring, [0, 1], [0.92, 1], CLAMP)}
        />
      );
    }}
  </SceneShell>
);

