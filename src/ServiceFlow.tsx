import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { StatusShowcaseScene, STATUS_SHOWCASE_FRAMES } from "./scenes/StatusShowcaseScene";
import { VideoShowcaseScene, VIDEO_SHOWCASE_FRAMES } from "./scenes/VideoShowcaseScene";
import { RepairPhotoScene, REPAIR_PHOTO_SCENE_FRAMES } from "./scenes/RepairPhotoScene";
import { PriceTransparencyScene, PRICE_TRANSPARENCY_SCENE_FRAMES } from "./scenes/PriceTransparencyScene";
import { PaymentUploadScene, PAYMENT_UPLOAD_SCENE_FRAMES } from "./scenes/PaymentUploadScene";
import { ContactAdvisorScene, CONTACT_ADVISOR_SCENE_FRAMES } from "./scenes/ContactAdvisorScene";
import { ClosingScene, CLOSING_SCENE_FRAMES } from "./scenes/ClosingScene";
import { fontFamily } from "./theme";

// ---------- Pengaturan waktu (ubah di sini) ----------
export const FPS = 30;
export const INTRO_FRAMES = 2 * FPS; // 2 detik
export const PROBLEM_FRAMES = 4 * FPS; // 4 detik
export const SOLUTION_FRAMES = 14 * FPS; // 14 detik
export const STATUS_SHOWCASE_FRAMES_TOTAL = STATUS_SHOWCASE_FRAMES; // 13 detik
export const VIDEO_SHOWCASE_FRAMES_TOTAL = VIDEO_SHOWCASE_FRAMES; // 8 detik
export const REPAIR_PHOTO_FRAMES_TOTAL = REPAIR_PHOTO_SCENE_FRAMES; // 10 detik
export const PRICE_TRANSPARENCY_FRAMES_TOTAL = PRICE_TRANSPARENCY_SCENE_FRAMES; // 11 detik
export const PAYMENT_UPLOAD_FRAMES_TOTAL = PAYMENT_UPLOAD_SCENE_FRAMES; // 9 detik
export const CONTACT_ADVISOR_FRAMES_TOTAL = CONTACT_ADVISOR_SCENE_FRAMES; // 8 detik
export const CLOSING_FRAMES_TOTAL = CLOSING_SCENE_FRAMES; // 4 detik
const INTRO = INTRO_FRAMES;
const PROBLEM = PROBLEM_FRAMES;
const SOLUTION = SOLUTION_FRAMES;
const STATUS_SHOWCASE = STATUS_SHOWCASE_FRAMES_TOTAL;
const VIDEO_SHOWCASE = VIDEO_SHOWCASE_FRAMES_TOTAL;
const REPAIR_PHOTO = REPAIR_PHOTO_FRAMES_TOTAL;
const PRICE_TRANSPARENCY = PRICE_TRANSPARENCY_FRAMES_TOTAL;
const PAYMENT_UPLOAD = PAYMENT_UPLOAD_FRAMES_TOTAL;
const CONTACT_ADVISOR = CONTACT_ADVISOR_FRAMES_TOTAL;
const CLOSING = CLOSING_FRAMES_TOTAL;
const INTRO_TRANSITION = 8;
const STEP = 3 * FPS; // 3 detik per tahap
const OUTRO = 2 * FPS; // 2 detik

// ---------- Warna: diambil dari token Design.md ----------
const C = {
  blue: "#161E59", // vw-blue
  lightBlue: "#00B0F0", // vw-light-blue
  grey: "#4B5563", // setara gray-600 (teks bantu)
  greyLight: "#F2F2F2", // vw-grey-light (latar)
  approved: "#2E7D32", // approved
  todo: "#D1D5DB",
  white: "#FFFFFF",
};

// ---------- Isi 5 tahap (dummy, teks bebas diubah) ----------
// Urutan mengikuti FR-003 di PRD: appointment -> work_in_progress ->
// quality_control -> invoice_preparation -> completed
type Step = { status: string; title: string; desc: string; who: string };

const STEPS: Step[] = [
  {
    status: "Appointment",
    title: "Janji Servis",
    desc: "Mobil Anda dijadwalkan dan dicatat oleh Service Advisor kami.",
    who: "Service Advisor",
  },
  {
    status: "Work In Process",
    title: "Pemeriksaan & Persetujuan",
    desc: "Teknisi memeriksa mobil dan merekam video. Anda menyetujui atau menolak tiap biaya lewat link.",
    who: "Teknisi & Anda",
  },
  {
    status: "Quality Control",
    title: "Pemeriksaan Kualitas",
    desc: "Hasil pekerjaan dicek ulang sebelum mobil diserahkan.",
    who: "Tim Quality Control",
  },
  {
    status: "Invoice Preparation",
    title: "Invoice & Pembayaran",
    desc: "Invoice disiapkan. Anda bayar dan unggah bukti bayar di halaman yang sama.",
    who: "Kasir & Anda",
  },
  {
    status: "Completed",
    title: "Selesai",
    desc: "Mobil siap diambil. Terima kasih sudah mempercayakan mobil Anda kepada kami.",
    who: "Semua tim",
  },
];

const STATUS_SHOWCASE_START = INTRO + PROBLEM + SOLUTION;
const VIDEO_SHOWCASE_START = STATUS_SHOWCASE_START + STATUS_SHOWCASE;
const REPAIR_PHOTO_START = VIDEO_SHOWCASE_START + VIDEO_SHOWCASE;
const PRICE_TRANSPARENCY_START = REPAIR_PHOTO_START + REPAIR_PHOTO;
const PAYMENT_UPLOAD_START = PRICE_TRANSPARENCY_START + PRICE_TRANSPARENCY;
const CONTACT_ADVISOR_START = PAYMENT_UPLOAD_START + PAYMENT_UPLOAD;
const CLOSING_START = CONTACT_ADVISOR_START + CONTACT_ADVISOR;
const STEPS_START = CLOSING_START + CLOSING;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Penanda progres di atas (bagian yang paling diingat) ----------
const Tracker: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", alignItems: "center", width: 880 }}>
      {STEPS.map((_, i) => {
        const state =
          i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
        const pop =
          state === "active"
            ? spring({
                frame: frame - (INTRO + i * STEP),
                fps,
                config: { damping: 12 },
              })
            : 0;
        const bg =
          state === "done" ? C.approved : state === "active" ? C.blue : C.todo;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                background: bg,
                color: C.white,
                fontSize: 38,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${1 + 0.25 * pop})`,
                flexShrink: 0,
              }}
            >
              {state === "done" ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 8,
                  background: i < activeIndex ? C.approved : C.todo,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- Kartu satu tahap ----------
const StepScene: React.FC<{ step: Step; index: number }> = ({
  step,
  index,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], clamp);
  const fadeOut = interpolate(frame, [STEP - 10, STEP], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", paddingTop: 120 }}
    >
      <div
        style={{
          width: 880,
          background: C.white,
          borderRadius: 40,
          padding: 80,
          boxShadow: "0 8px 30px rgba(22,30,89,0.12)",
          opacity: Math.min(fadeIn, fadeOut),
        }}
      >
        <div style={{ fontSize: 40, color: C.grey, fontWeight: 600 }}>
          Tahap {index + 1} dari {STEPS.length}
        </div>
        <div
          style={{
            fontSize: 80,
            lineHeight: 1.15,
            color: C.blue,
            fontWeight: 700,
            marginTop: 24,
          }}
        >
          {step.title}
        </div>
        <div style={{ fontSize: 36, color: C.grey, marginTop: 12 }}>
          {step.status}
        </div>
        <div
          style={{
            fontSize: 46,
            lineHeight: 1.45,
            color: "#1F2937",
            marginTop: 56,
          }}
        >
          {step.desc}
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 38,
            color: C.blue,
            fontWeight: 600,
            borderTop: `4px solid ${C.lightBlue}`,
            paddingTop: 32,
          }}
        >
          Dikerjakan oleh {step.who}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Pembuka dan penutup ----------
const TitleCard: React.FC<{
  title: string;
  subtitle: string;
  duration: number;
}> = ({ title, subtitle, duration }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 12], [0, 1], clamp),
    interpolate(frame, [duration - 10, duration], [1, 0], clamp)
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 120,
        opacity,
      }}
    >
      <div style={{ width: 880 }}>
        <div
          style={{ fontSize: 96, lineHeight: 1.15, fontWeight: 700, color: C.blue }}
        >
          {title}
        </div>
        <div
          style={{ fontSize: 46, lineHeight: 1.45, color: C.grey, marginTop: 40 }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Komposisi utama ----------
export const ServiceFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stepsEnd = STEPS_START + STEPS.length * STEP;
  const activeIndex =
    frame < STEPS_START
      ? -1
      : frame >= stepsEnd
        ? STEPS.length
        : Math.floor((frame - INTRO) / STEP);

  return (
    <AbsoluteFill style={{ backgroundColor: C.greyLight, fontFamily }}>
      <div style={{ position: "absolute", top: 150, left: 100 }}>
        <Tracker activeIndex={activeIndex} />
      </div>

      <Sequence
        name="Intro"
        durationInFrames={INTRO + INTRO_TRANSITION}
        premountFor={fps}
      >
        <IntroScene fontFamily={fontFamily} />
      </Sequence>

      <Sequence
        name="Problem"
        from={INTRO}
        durationInFrames={PROBLEM}
        premountFor={fps}
      >
        <ProblemScene fontFamily={fontFamily} />
      </Sequence>

      <Sequence
        name="Solution"
        from={INTRO + PROBLEM}
        durationInFrames={SOLUTION}
        premountFor={fps}
      >
        <SolutionScene />
      </Sequence>

      <Sequence
        name="Status Showcase"
        from={STATUS_SHOWCASE_START}
        durationInFrames={STATUS_SHOWCASE}
        premountFor={fps}
      >
        <StatusShowcaseScene />
      </Sequence>

      <Sequence
        name="Video Showcase"
        from={VIDEO_SHOWCASE_START}
        durationInFrames={VIDEO_SHOWCASE}
        premountFor={fps}
      >
        <VideoShowcaseScene />
      </Sequence>

      <Sequence
        name="Repair Photos"
        from={REPAIR_PHOTO_START}
        durationInFrames={REPAIR_PHOTO}
        premountFor={fps}
      >
        <RepairPhotoScene />
      </Sequence>

      <Sequence
        name="Price Transparency"
        from={PRICE_TRANSPARENCY_START}
        durationInFrames={PRICE_TRANSPARENCY}
        premountFor={fps}
      >
        <PriceTransparencyScene />
      </Sequence>

      <Sequence
        name="Payment Upload"
        from={PAYMENT_UPLOAD_START}
        durationInFrames={PAYMENT_UPLOAD}
        premountFor={fps}
      >
        <PaymentUploadScene />
      </Sequence>

      <Sequence
        name="Contact Advisor"
        from={CONTACT_ADVISOR_START}
        durationInFrames={CONTACT_ADVISOR}
        premountFor={fps}
      >
        <ContactAdvisorScene />
      </Sequence>

      <Sequence
        name="Closing"
        from={CLOSING_START}
        durationInFrames={CLOSING}
        premountFor={fps}
      >
        <ClosingScene />
      </Sequence>

      {STEPS.map((step, i) => (
        <Sequence
          key={step.status}
          from={STEPS_START + i * STEP}
          durationInFrames={STEP}
        >
          <StepScene step={step} index={i} />
        </Sequence>
      ))}

      <Sequence from={stepsEnd} durationInFrames={OUTRO}>
        <TitleCard
          title="Semua dalam satu link WhatsApp"
          subtitle="Pantau video, biaya, dan pembayaran dari HP Anda. VW PIK."
          duration={OUTRO}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
