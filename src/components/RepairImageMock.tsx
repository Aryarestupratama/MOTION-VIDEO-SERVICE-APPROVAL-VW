import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, fontFamily } from "../theme";

export const REPAIR_PHOTOS = [
  { file: "repair-placeholder-1.jpg", description: "Pemeriksaan area depan kendaraan" },
  { file: "repair-placeholder-2.jpg", description: "Pemeriksaan panel dan sisi kendaraan" },
  { file: "repair-placeholder-3.jpg", description: "Pengecekan bagian belakang kendaraan" },
  { file: "repair-placeholder-4.jpg", description: "Pemeriksaan akhir oleh teknisi" },
] as const;

type RepairImageMockProps = {
  stackProgress: number[];
  slideIndex: number;
  slideOffset: number;
  isSliding: boolean;
};

const STACK_WIDTH = 360;
const STACK_HEIGHT = 270;
const VIEWPORT_WIDTH = 368;

const ArrowIcon: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === "left" ? <path d="m15 18-6-6 6-6M9 12h12" /> : <path d="m9 18 6-6-6-6m6 6H3" />}
  </svg>
);

export const RepairImageMock: React.FC<RepairImageMockProps> = ({
  stackProgress,
  slideIndex,
  slideOffset,
  isSliding,
}) => {
  const selectedIndex = ((slideIndex % REPAIR_PHOTOS.length) + REPAIR_PHOTOS.length) % REPAIR_PHOTOS.length;
  const previousIndex = (selectedIndex - 1 + REPAIR_PHOTOS.length) % REPAIR_PHOTOS.length;
  const selectedPhoto = REPAIR_PHOTOS[selectedIndex];

  const renderStack = (topIndex: number, offset: number, entering = false) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: STACK_WIDTH,
        height: STACK_HEIGHT,
        translate: `${offset}px 0`,
      }}
    >
      {REPAIR_PHOTOS.map((_, depth) => {
        const photoIndex = (topIndex + depth) % REPAIR_PHOTOS.length;
        const photo = REPAIR_PHOTOS[photoIndex];
        const entered = entering ? Math.max(0, Math.min(1, stackProgress[depth] ?? 0)) : 1;
        const rotation = depth === 0 ? 0 : (depth % 2 === 1 ? 2.2 : -2.2);

        return (
          <div
            key={`${topIndex}-${photo.file}`}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: REPAIR_PHOTOS.length - depth,
              overflow: "hidden",
              borderRadius: 24,
              background: "#FFFFFF",
              boxShadow: "0 14px 36px -14px rgba(22,27,89,.38)",
              outline: "1px solid rgba(0,0,0,.06)",
              transformOrigin: "50% 100%",
              translate: `0 ${depth * 12 + (1 - entered) * 48}px`,
              rotate: `${rotation}deg`,
              scale: (1 - depth * 0.05) * (0.84 + entered * 0.16),
              opacity: entered,
            }}
          >
            <Img
              src={staticFile(`images/repair/${photo.file}`)}
              alt={depth === 0 ? photo.description : ""}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
            {depth > 0 ? (
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "#000000", opacity: depth * 0.07 }} />
            ) : null}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, width: 400, height: 1042, overflow: "hidden", background: "#FFFFFF", fontFamily, color: "#111827" }}>
      <section style={{ position: "absolute", top: 24, left: 16, width: 368 }}>
        <h2 style={{ margin: 0, color: "#111827", fontSize: 18, lineHeight: 1.35, fontWeight: 700 }}>
          Repair results
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 12, marginBottom: 12 }}>
          <span style={{ borderRadius: 999, padding: "5px 12px", background: "rgba(22,30,89,.1)", color: COLORS.vwBlue, fontSize: 12, lineHeight: 1.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            Photo {selectedIndex + 1}/{REPAIR_PHOTOS.length}
          </span>
        </div>

        <div style={{ position: "relative", width: VIEWPORT_WIDTH, height: STACK_HEIGHT, margin: "0 auto", overflow: "hidden", borderRadius: 24 }}>
          {isSliding ? renderStack(previousIndex, slideOffset - VIEWPORT_WIDTH) : null}
          {renderStack(selectedIndex, isSliding ? slideOffset : 0, selectedIndex === 0 && !isSliding)}
        </div>

        <div style={{ width: VIEWPORT_WIDTH, margin: "16px auto 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#FFFFFF", color: COLORS.vwBlue, boxShadow: "0 0 0 1px rgba(0,0,0,.08)" }}>
            <ArrowIcon direction="left" />
          </div>
          <div style={{ minWidth: 0, textAlign: "center", color: "#4B5563", fontSize: 11, lineHeight: 1.35 }}>
            <p style={{ margin: 0 }}>↔ Swipe untuk melihat foto berikutnya</p>
          </div>
          <div style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#FFFFFF", color: COLORS.vwBlue, boxShadow: "0 0 0 1px rgba(0,0,0,.08)" }}>
            <ArrowIcon direction="right" />
          </div>
        </div>

        <p style={{ width: VIEWPORT_WIDTH, margin: "16px auto 0", textAlign: "center", color: "#111827", fontSize: 14, lineHeight: 1.35 }}>
          {selectedPhoto.description}
        </p>
      </section>
    </div>
  );
};
