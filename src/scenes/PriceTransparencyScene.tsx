import React from "react";
import { Easing, interpolate, spring } from "remotion";
import {
  ESTIMATE_ITEMS,
  EstimateApprovalMock,
  type EstimateDecision,
} from "../components/EstimateApprovalMock";
import { SceneShell } from "../components/SceneShell";

// ---------- Konten dan timeline (frame lokal scene, 30 fps) ----------
export const PRICE_TRANSPARENCY_SCENE_FRAMES = 11 * 30;
export const PRICE_TRANSPARENCY_TITLE = "Transparansi Harga, Anda yang Memutuskan";
const ITEM_DECISION_EVENTS = [
  { frame: 145, itemIndex: 0, decision: "approved" },
  { frame: 180, itemIndex: 1, decision: "rejected" },
  { frame: 215, itemIndex: 2, decision: "approved" },
] as const;
const SUBMIT_TAP_FRAME = 255;
const SUBMITTED_FRAME = 267;
const BUTTON_PRESS_END = 260;
const RIPPLE_END = 273;
const DECISION_FEEDBACK_FRAMES = 16;
const TOTAL_EASE_FRAMES = 18;
const CONTENT_SCROLL_DISTANCE = 260;
const CONTENT_SCROLL_DOWN = [145, 215] as const;
const CONTENT_SCROLL_HOLD_END = 225;
const CONTENT_SCROLL_RESET_END = 255;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const getDecisions = (frame: number): EstimateDecision[] =>
  ESTIMATE_ITEMS.map((_, itemIndex) => {
    const event = ITEM_DECISION_EVENTS.find(
      (candidate) => candidate.itemIndex === itemIndex && frame >= candidate.frame,
    );
    return event?.decision ?? "pending";
  });

const getApprovedTotalAtFrame = (frame: number) => {
  const approvedEvents = ITEM_DECISION_EVENTS.filter((event) => event.decision === "approved");
  const keyframes = [{ frame: 0, amount: 0 }];
  let amount = 0;
  for (const event of approvedEvents) {
    amount += ESTIMATE_ITEMS[event.itemIndex].price;
    keyframes.push({ frame: event.frame, amount });
  }

  const nextKeyframeIndex = keyframes.findIndex((point) => point.frame >= frame);
  if (nextKeyframeIndex === -1) return amount;
  const previous = keyframes[Math.max(0, nextKeyframeIndex - 1)];
  const next = keyframes[nextKeyframeIndex];
  if (frame >= next.frame) {
    return interpolate(
      frame,
      [next.frame, next.frame + TOTAL_EASE_FRAMES],
      [previous.amount, next.amount],
      { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
    );
  }
  return previous.amount;
};

export const PriceTransparencyScene: React.FC = () => (
  <SceneShell title={PRICE_TRANSPARENCY_TITLE} durationInFrames={PRICE_TRANSPARENCY_SCENE_FRAMES}>
    {({ frame, fps }) => {
      const decisions = getDecisions(frame);
      const approveProgress = ESTIMATE_ITEMS.map((_, index) => {
        const event = ITEM_DECISION_EVENTS.find((candidate) => candidate.itemIndex === index);
        return event?.decision === "approved" && frame >= event.frame
          ? spring({
              frame: frame - event.frame,
              fps,
              durationInFrames: DECISION_FEEDBACK_FRAMES,
              config: { damping: 18, mass: 0.65 },
            })
          : 0;
      });
      const rejectProgress = ESTIMATE_ITEMS.map((_, index) => {
        const event = ITEM_DECISION_EVENTS.find((candidate) => candidate.itemIndex === index);
        return event?.decision === "rejected" && frame >= event.frame
          ? spring({
              frame: frame - event.frame,
              fps,
              durationInFrames: DECISION_FEEDBACK_FRAMES,
              config: { damping: 18, mass: 0.65 },
            })
          : 0;
      });
      const checkProgress = approveProgress.map((progress) => interpolate(progress, [0, 1], [0, 1], CLAMP));
      const crossProgress = rejectProgress.map((progress) => interpolate(progress, [0, 1], [0, 1], CLAMP));
      const submitEnabled = decisions.some((decision) => decision !== "pending");
      const submitted = frame >= SUBMITTED_FRAME;
      const submitPressProgress = interpolate(
        frame,
        [SUBMIT_TAP_FRAME, SUBMIT_TAP_FRAME + 3, BUTTON_PRESS_END],
        [0, 1, 0],
        { ...CLAMP, easing: [Easing.out(Easing.cubic), Easing.inOut(Easing.cubic)] },
      );
      const submitRippleProgress = frame < SUBMIT_TAP_FRAME
        ? 0
        : interpolate(frame, [SUBMIT_TAP_FRAME, RIPPLE_END], [0, 1], {
            ...CLAMP,
            easing: Easing.out(Easing.cubic),
          });
      const totalChangeProgress = frame < 145
        ? 0
        : interpolate(frame, [145, 145 + TOTAL_EASE_FRAMES], [0, 1], CLAMP);
      const contentScrollProgress = interpolate(
        frame,
        [CONTENT_SCROLL_DOWN[0], CONTENT_SCROLL_DOWN[1], CONTENT_SCROLL_HOLD_END, CONTENT_SCROLL_RESET_END],
        [0, 1, 1, 0],
        {
          ...CLAMP,
          easing: [Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)],
        },
      );

      return (
        <EstimateApprovalMock
          decisions={decisions}
          submitEnabled={submitEnabled}
          submitted={submitted}
          total={getApprovedTotalAtFrame(frame)}
          approveProgress={approveProgress}
          rejectProgress={rejectProgress}
          submitPressProgress={submitPressProgress}
          submitRippleProgress={submitRippleProgress}
          checkProgress={checkProgress}
          crossProgress={crossProgress}
          totalChangeProgress={totalChangeProgress}
          contentScrollY={-CONTENT_SCROLL_DISTANCE * contentScrollProgress}
        />
      );
    }}
  </SceneShell>
);

