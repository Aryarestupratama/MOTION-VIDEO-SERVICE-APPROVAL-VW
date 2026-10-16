import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { PaymentUploadMock, type PaymentUploadState } from "../components/PaymentUploadMock";
import { SceneShell } from "../components/SceneShell";

// ---------- Teks dan timing (frame lokal scene; 30 fps) ----------
export const PAYMENT_UPLOAD_SCENE_FRAMES = 9 * 30;
export const PAYMENT_UPLOAD_TITLE = "Upload Bukti Bayar dengan Mudah";
const SELECT_FILE_FRAME = 140;
const UPLOAD_TAP_FRAME = 165;
const UPLOAD_PRESS_END = 175;
const UPLOAD_PROGRESS_START = 170;
const UPLOAD_PROGRESS_END = 195;
const UPLOAD_SUCCESS_FRAME = 200;
const FILE_SPRING_DURATION = 18;
const SUCCESS_SPRING_DURATION = 17;
const RIPPLE_DURATION = 20;
const RECEIPT_FOCUS_SCROLL = 82;
const RECEIPT_FOCUS_TIMELINE = [SELECT_FILE_FRAME, UPLOAD_TAP_FRAME, 220, 250] as const;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const getState = (frame: number): PaymentUploadState => {
  if (frame >= UPLOAD_SUCCESS_FRAME) return "success";
  if (frame >= UPLOAD_TAP_FRAME) return "uploading";
  if (frame >= SELECT_FILE_FRAME) return "file-selected";
  return "empty";
};

export const PaymentUploadScene: React.FC = () => (
  <SceneShell title={PAYMENT_UPLOAD_TITLE} durationInFrames={PAYMENT_UPLOAD_SCENE_FRAMES}>
    {({ frame, fps }) => {
      const state = getState(frame);
      const fileSpring = frame < SELECT_FILE_FRAME ? 0 : spring({
        frame: frame - SELECT_FILE_FRAME,
        fps,
        durationInFrames: FILE_SPRING_DURATION,
        config: { damping: 18, mass: 0.65 },
      });
      const successSpring = frame < UPLOAD_SUCCESS_FRAME ? 0 : spring({
        frame: frame - UPLOAD_SUCCESS_FRAME,
        fps,
        durationInFrames: SUCCESS_SPRING_DURATION,
        config: { damping: 17, mass: 0.7 },
      });
      const uploadProgress = interpolate(
        frame,
        [UPLOAD_PROGRESS_START, UPLOAD_PROGRESS_END],
        [0, 100],
        { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
      );
      const uploadPressProgress = interpolate(
        frame,
        [UPLOAD_TAP_FRAME, UPLOAD_TAP_FRAME + 3, UPLOAD_PRESS_END],
        [0, 1, 0],
        { ...CLAMP, easing: [Easing.out(Easing.cubic), Easing.inOut(Easing.cubic)] },
      );
      const selectRippleProgress = frame < SELECT_FILE_FRAME
        ? 0
        : interpolate(frame, [SELECT_FILE_FRAME, SELECT_FILE_FRAME + RIPPLE_DURATION], [0, 1], {
            ...CLAMP,
            easing: Easing.out(Easing.cubic),
          });
      const uploadRippleProgress = frame < UPLOAD_TAP_FRAME
        ? 0
        : interpolate(frame, [UPLOAD_TAP_FRAME, UPLOAD_TAP_FRAME + RIPPLE_DURATION], [0, 1], {
            ...CLAMP,
            easing: Easing.out(Easing.cubic),
          });
      const contentScrollProgress = interpolate(
        frame,
        RECEIPT_FOCUS_TIMELINE,
        [0, 1, 1, 0],
        { ...CLAMP, easing: [Easing.inOut(Easing.cubic), Easing.linear, Easing.inOut(Easing.cubic)] },
      );

      return (
        <PaymentUploadMock
          state={state}
          uploadProgress={uploadProgress}
          fileProgress={interpolate(fileSpring, [0, 1], [0, 1], CLAMP)}
          selectRippleProgress={selectRippleProgress}
          uploadPressProgress={uploadPressProgress}
          uploadRippleProgress={uploadRippleProgress}
          successProgress={interpolate(successSpring, [0, 1], [0, 1], CLAMP)}
          contentScrollY={-RECEIPT_FOCUS_SCROLL * contentScrollProgress}
        />
      );
    }}
  </SceneShell>
);

