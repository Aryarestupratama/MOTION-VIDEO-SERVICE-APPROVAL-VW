import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { InspectionItemsPreview } from "./PriceDecisionMock";

export const REPAIR_PHOTOS = [
  { file: "repair-placeholder-1.jpg", description: "Pemeriksaan area depan kendaraan" },
  { file: "repair-placeholder-2.jpg", description: "Pemeriksaan panel dan sisi kendaraan" },
  { file: "repair-placeholder-3.jpg", description: "Pengecekan bagian belakang kendaraan" },
  { file: "repair-placeholder-4.jpg", description: "Pemeriksaan akhir oleh teknisi" },
] as const;

type RepairImageMockProps = {
  /** Progres masuk tiap kartu saat tumpukan pertama kali muncul (0..1). */
  stackProgress: number[];
  /** Jumlah swipe yang SUDAH selesai (foto teratas = cycle % jumlah foto). */
  cycle?: number;
  /** Progres swipe yang sedang berjalan: 0 = diam, 0..1 = foto teratas terbang keluar lalu masuk ke belakang. */
  swipeProgress?: number;
  /** Dipakai di bawah bagian video: tanpa judul "Repair results" (sudah ada di atasnya), tinggi mengikuti isi. */
  embedded?: boolean;
};

const STACK_WIDTH = 368;
const STACK_HEIGHT = 276; // aspect 4:3 seperti web asli
const MAX_VISIBLE_DEPTH = 2; // web asli: maksimal 3 lapis terlihat
const FLY_X = 470;
const FLY_ROT = 16;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outCubic = Easing.out(Easing.cubic);
const inOutCubic = Easing.inOut(Easing.cubic);
const rotationAt = (v: number) => interpolate(v, [0, 1, 2], [0, 2.2, -2.2], CLAMP);
const span = (p: number, from: number, to: number) => interpolate(p, [from, to], [0, 1], CLAMP);

const ArrowIcon: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
  </svg>
);

const HintIcon: React.FC<{ kind: "move" | "zoom" }> = ({ kind }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "move" ? (
      <path d="m18 8 4 4-4 4M6 8l-4 4 4 4M2 12h20" />
    ) : (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
      </>
    )}
  </svg>
);

export const RepairImageMock: React.FC<RepairImageMockProps> = ({
  stackProgress,
  cycle = 0,
  swipeProgress = 0,
  embedded = false,
}) => {
  const count = REPAIR_PHOTOS.length;
  const p = swipeProgress;
  const top = ((cycle % count) + count) % count;
  const next = (top + 1) % count;
  const displayIndex = p >= 0.5 ? next : top;

  // Keterangan foto: yang lama memudar, yang baru muncul setelah foto berpindah.
  const captionOpacity = (index: number): number => {
    if (p <= 0) return index === top ? 1 : 0;
    if (index === top) return 1 - span(p, 0.3, 0.5);
    if (index === next) return span(p, 0.5, 0.72);
    return 0;
  };

  const renderCard = (photoIndex: number) => {
    const photo = REPAIR_PHOTOS[photoIndex];
    const d = (photoIndex - top + count) % count;
    const flying = p > 0 && d === 0;

    let x = 0;
    let flyRot = 0;
    let v: number;
    let z: number;
    if (flying) {
      if (p < 0.5) {
        // Fase 1: foto teratas dilempar ke samping (seperti dilepas setelah digeser).
        const t = outCubic(span(p, 0, 0.5));
        x = FLY_X * t;
        flyRot = FLY_ROT * t;
        v = 0;
        z = count + 2;
      } else {
        // Fase 2: meluncur kembali, masuk ke PALING BELAKANG tumpukan.
        const t = inOutCubic(span(p, 0.5, 1));
        x = FLY_X * (1 - t);
        flyRot = FLY_ROT * (1 - t);
        v = Math.min(MAX_VISIBLE_DEPTH, (count - 1) * t);
        z = 0;
      }
    } else {
      // Kartu lain naik satu lapis ke depan.
      const promote = p > 0 ? inOutCubic(span(p, 0.15, 0.85)) : 0;
      v = Math.min(MAX_VISIBLE_DEPTH, Math.max(0, d - promote));
      z = count - d;
    }

    const entered = Math.max(0, Math.min(1, stackProgress[photoIndex] ?? 1));
    return (
      <div
        key={photo.file}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: z,
          overflow: "hidden",
          borderRadius: 24,
          background: "#FFFFFF",
          boxShadow: "0 14px 36px -14px rgba(22,27,89,.38)",
          outline: "1px solid rgba(0,0,0,.06)",
          transformOrigin: "50% 100%",
          translate: `${x}px ${v * 12 + (1 - entered) * 48}px`,
          rotate: `${rotationAt(v) + flyRot}deg`,
          scale: (1 - v * 0.05) * (0.84 + entered * 0.16),
          opacity: entered,
        }}
      >
        <Img
          src={staticFile(`images/repair/${photo.file}`)}
          alt={photo.description}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "#000000", opacity: v * 0.07 }} />
      </div>
    );
  };

  const arrowStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#FFFFFF",
    color: COLORS.vwBlue,
    boxShadow: "0 0 0 1px rgba(0,0,0,.08)",
  };

  return (
    <div
      style={
        embedded
          ? { position: "relative", width: 368, fontFamily, color: "#111827" }
          : { position: "absolute", inset: 0, width: 400, height: 1042, overflow: "hidden", background: "#FFFFFF", fontFamily, color: "#111827" }
      }
    >
      <section style={embedded ? { position: "relative", width: 368 } : { position: "absolute", top: 24, left: 16, width: 368 }}>
        {embedded ? null : (
          <>
            <h2 style={{ margin: 0, color: "#111827", fontSize: 16, lineHeight: 1.35, fontWeight: 700 }}>Repair results</h2>
            <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 14, lineHeight: 1.45 }}>
              See how the issues shown in the video above have been fixed.
            </p>
          </>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: embedded ? 0 : 12, marginBottom: 12 }}>
          <span style={{ borderRadius: 999, padding: "4px 12px", background: "rgba(22,30,89,.1)", color: COLORS.vwBlue, fontSize: 12, lineHeight: 1.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            Photo {displayIndex + 1}/{count}
          </span>
        </div>

        {/* Tumpukan kartu: tidak di-clip supaya kartu belakang menyembul ke bawah dan kartu yang dilempar terlihat. */}
        <div style={{ position: "relative", width: STACK_WIDTH, height: STACK_HEIGHT, margin: "0 auto 56px" }}>
          {REPAIR_PHOTOS.map((_, photoIndex) => renderCard(photoIndex))}
        </div>

        <div style={{ width: STACK_WIDTH, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={arrowStyle}>
            <ArrowIcon direction="left" />
          </div>
          <div style={{ minWidth: 0, textAlign: "center", color: "#767676", fontSize: 12, lineHeight: 1.35 }}>
            <p style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <HintIcon kind="move" /> Swipe to see the next photo
            </p>
            <p style={{ margin: "4px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <HintIcon kind="zoom" /> Tap a photo to enlarge
            </p>
          </div>
          <div style={arrowStyle}>
            <ArrowIcon direction="right" />
          </div>
        </div>

        <div style={{ position: "relative", width: STACK_WIDTH, height: 22, margin: "16px auto 0", color: "#111827", fontSize: 14, lineHeight: 1.35, textAlign: "center" }}>
          {REPAIR_PHOTOS.map((photo, index) => (
            <p key={photo.file} style={{ position: "absolute", inset: 0, margin: 0, opacity: captionOpacity(index) }}>
              {photo.description}
            </p>
          ))}
        </div>

        {/* Lanjutan halaman asli: daftar "Inspection items" di bawah foto, supaya layar HP tidak kosong. */}
        {embedded ? null : (
          <div style={{ position: "relative", width: 390, height: 360, marginLeft: -16, marginTop: 30 }}>
            <InspectionItemsPreview />
          </div>
        )}
      </section>
    </div>
  );
};
