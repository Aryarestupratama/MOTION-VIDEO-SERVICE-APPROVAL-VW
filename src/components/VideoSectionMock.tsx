import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { RepairImageMock } from "./RepairImageMock";

export const VIDEO_COPY = {
  sectionTitle: "Inspection video",
  duration: "00:38",
  technicianMessage: "Kami menemukan kendala pada kendaraan Anda. Tonton video inspeksi untuk melihat kondisi mobil dengan lebih jelas.",
  technicianName: "Raka (Demo)",
  technicianRole: "Chief Technician",
  repairTitle: "Repair results",
  repairCaption: "See how the issues shown in the video above have been fixed.",
} as const;

type VideoSectionMockProps = {
  progress: number;
  pressProgress: number;
  rippleProgress: number;
};

export const VideoSectionMock: React.FC<VideoSectionMockProps> = ({
  progress,
  pressProgress,
  rippleProgress,
}) => {
  const playButtonScale = 1 - 0.08 * pressProgress;
  const rippleOpacity = Math.max(0, 1 - rippleProgress);
  const playLabel = progress > 0.02 ? "Pause demo video" : "Play demo video";

  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        left: 16,
        width: 368,
        color: "#111827",
        fontFamily,
      }}
    >
      <section>
        <h2 style={{ margin: 0, color: "#111827", fontSize: 16, lineHeight: 1.35, fontWeight: 700 }}>
          {VIDEO_COPY.sectionTitle}
        </h2>

        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            marginTop: 12,
            overflow: "hidden",
            borderRadius: 16,
            backgroundColor: "#090B14",
          }}
        >
          <Img
            src={staticFile("images/stages/work_in_progress.jpg")}
            alt="Ilustrasi video inspeksi kendaraan"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(9,11,20,.38) 0%, transparent 35%, transparent 55%, rgba(9,11,20,.78) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 66,
              height: 66,
              marginLeft: -33,
              marginTop: -33,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,.72)",
              scale: 1 + rippleProgress * 1.4,
              opacity: rippleOpacity * 0.55,
            }}
          />
          <div
            aria-label={playLabel}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 58,
              height: 58,
              marginLeft: -29,
              marginTop: -29,
              borderRadius: "50%",
              background: "rgba(255,255,255,.96)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,.28)",
              scale: playButtonScale,
            }}
          >
            {progress > 0.02 ? (
              <svg viewBox="0 0 24 24" width="24" height="24" fill={COLORS.vwBlue} aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" fill={COLORS.vwBlue} aria-hidden="true">
                <path d="M8 5.8c0-.8.9-1.3 1.6-.9l9.3 6.2a1.1 1.1 0 0 1 0 1.8l-9.3 6.2c-.7.5-1.6-.1-1.6-.9V5.8z" />
              </svg>
            )}
          </div>

          <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, display: "flex", alignItems: "center", gap: 9 }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="white" aria-hidden="true">
              {progress > 0.02 ? (
                <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>
              ) : <path d="M8 5.8c0-.8.9-1.3 1.6-.9l9.3 6.2a1.1 1.1 0 0 1 0 1.8l-9.3 6.2c-.7.5-1.6-.1-1.6-.9V5.8z" />}
            </svg>
            <div style={{ height: 4, flex: 1, borderRadius: 999, background: "rgba(255,255,255,.42)", overflow: "hidden" }}>
              <div style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%`, height: "100%", borderRadius: 999, background: COLORS.lightBlue }} />
            </div>
            <span style={{ color: COLORS.white, fontSize: 10, fontWeight: 600 }}>00:{String(Math.round(progress * 38)).padStart(2, "0")}</span>
            <span style={{ color: "rgba(255,255,255,.78)", fontSize: 10 }}>{VIDEO_COPY.duration}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 20 }}>
          <div
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: "50%",
              background: COLORS.vwBlue,
              color: COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            RD
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.55 }}>{VIDEO_COPY.technicianMessage}</p>
            <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: 12 }}>
              {VIDEO_COPY.technicianName} · {VIDEO_COPY.technicianRole}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <h2 style={{ margin: 0, color: "#111827", fontSize: 16, lineHeight: 1.35, fontWeight: 700 }}>
            {VIDEO_COPY.repairTitle}
          </h2>
          <p style={{ margin: "4px 0 0", color: "#4B5563", fontSize: 14, lineHeight: 1.45 }}>
            {VIDEO_COPY.repairCaption}
          </p>
        </div>

        {/* Lanjutan halaman asli: foto hasil reparasi tepat di bawah teks, jadi layar HP tidak kosong. */}
        <div style={{ marginTop: 16 }}>
          <RepairImageMock stackProgress={[1, 1, 1, 1]} embedded />
        </div>
      </section>
    </div>
  );
};
