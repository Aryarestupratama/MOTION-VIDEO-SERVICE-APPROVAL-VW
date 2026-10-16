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
  viewerProgress: number;
  slideIndex: number;
  slideOffset: number;
  isSliding: boolean;
  tapRippleProgress: number;
};

const STACK_WIDTH = 360;
const STACK_HEIGHT = 270;
const VIEWER_WIDTH = 368;
const clampIndex = (index: number) => Math.max(0, Math.min(REPAIR_PHOTOS.length - 1, index));

const ArrowIcon: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === "left" ? <path d="m15 18-6-6 6-6M9 12h12" /> : <path d="m9 18 6-6-6-6m6 6H3" />}
  </svg>
);

const ZoomIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 5 5M10.8 7.5v6.6M7.5 10.8h6.6" />
  </svg>
);

const ZoomOutIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 5 5M7.5 10.8h6.6" />
  </svg>
);

const ExternalLinkIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3h7v7M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

export const RepairImageMock: React.FC<RepairImageMockProps> = ({
  stackProgress,
  viewerProgress,
  slideIndex,
  slideOffset,
  isSliding,
  tapRippleProgress,
}) => {
  const selectedIndex = clampIndex(slideIndex);
  const selectedPhoto = REPAIR_PHOTOS[selectedIndex];
  const previousPhoto = REPAIR_PHOTOS[Math.max(0, selectedIndex - 1)];
  const safeRippleProgress = Math.max(0, Math.min(1, tapRippleProgress));
  const showTapRipple = tapRippleProgress >= 0 && tapRippleProgress < 1;

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

        <div
          style={{
            position: "relative",
            width: STACK_WIDTH,
            height: STACK_HEIGHT,
            margin: "0 auto",
            overflow: "visible",
            borderRadius: 24,
          }}
        >
          {REPAIR_PHOTOS.map((photo, index) => {
            const depth = Math.min(index, 3);
            const entered = Math.max(0, Math.min(1, stackProgress[index] ?? 0));
            const lift = 0;
            const baseScale = 1 - depth * 0.05 + lift * 0.05;
            const y = depth * 12 - lift * 12;
            const rotation = depth === 0 ? 0 : (depth % 2 === 1 ? 2.2 : -2.2);
            const entryScale = 0.84 + entered * 0.16;
            const isTop = index === 0;

            return (
              <div
                key={photo.file}
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
                  translate: `0 ${y + (1 - entered) * 48}px`,
                  rotate: `${rotation}deg`,
                  scale: baseScale * entryScale,
                  opacity: entered * (depth > 3 ? 0 : 1),
                }}
              >
                <Img
                  src={staticFile(`images/repair/${photo.file}`)}
                  alt={isTop ? photo.description : ""}
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                />
                {!isTop ? (
                  <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "#000000", opacity: depth * 0.07 }} />
                ) : null}
                {isTop && showTapRipple ? (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 92,
                      height: 92,
                      marginLeft: -46,
                      marginTop: -46,
                      borderRadius: "50%",
                      border: "3px solid rgba(255,255,255,.92)",
                      boxShadow: "0 2px 18px rgba(22,30,89,.35)",
                      scale: 0.25 + 1.1 * safeRippleProgress,
                      opacity: 1 - safeRippleProgress,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        <div style={{ width: 368, margin: "16px auto 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#FFFFFF", color: COLORS.vwBlue, boxShadow: "0 0 0 1px rgba(0,0,0,.08)" }}>
            <ArrowIcon direction="left" />
          </div>
          <div style={{ minWidth: 0, textAlign: "center", color: "#4B5563", fontSize: 11, lineHeight: 1.35 }}>
            <p style={{ margin: 0 }}>↔ Swipe to see the next photo</p>
            <p style={{ margin: "4px 0 0" }}><ZoomIcon /> Tap a photo to enlarge</p>
          </div>
          <div style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#FFFFFF", color: COLORS.vwBlue, boxShadow: "0 0 0 1px rgba(0,0,0,.08)" }}>
            <ArrowIcon direction="right" />
          </div>
        </div>

        <div style={{ width: 368, margin: "16px auto 0", display: "grid", textAlign: "center" }}>
          {REPAIR_PHOTOS.map((photo, index) => (
            <p key={photo.file} style={{ gridArea: "1 / 1", margin: 0, visibility: index === selectedIndex ? "visible" : "hidden", color: "#111827", fontSize: 14, lineHeight: 1.35 }}>
              {photo.description}
            </p>
          ))}
        </div>
      </section>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background: "#E5E7EB",
          opacity: viewerProgress,
          scale: 0.92 + viewerProgress * 0.08,
          transformOrigin: "50% 50%",
          pointerEvents: "none",
        }}
      >
        <header style={{ height: 62, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid rgba(75,85,99,.15)", background: "#FFFFFF", padding: "0 8px", boxShadow: "0 2px 7px rgba(0,0,0,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, height: 44, padding: "0 8px", flexShrink: 0, borderRadius: 8, color: COLORS.vwBlue, fontSize: 13, fontWeight: 600 }}>
            <ArrowIcon direction="left" /> Back
          </div>
          <p style={{ minWidth: 0, flex: 1, margin: 0, padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center", color: "#111827", fontSize: 13, fontWeight: 600 }}>
            {selectedPhoto.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0, color: COLORS.vwBlue }}>
            <div style={{ width: 32, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><ZoomOutIcon /></div>
            <div style={{ width: 32, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><ZoomIcon /></div>
            <div style={{ width: 32, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><ExternalLinkIcon /></div>
          </div>
        </header>

        <div style={{ position: "relative", width: VIEWER_WIDTH, height: 730, margin: "0 auto", overflow: "hidden", padding: 8, boxSizing: "border-box" }}>
          {isSliding ? (
            <Img
              src={staticFile(`images/repair/${previousPhoto.file}`)}
              alt=""
              style={{ position: "absolute", top: 8, left: 8, width: VIEWER_WIDTH - 16, height: 276, objectFit: "cover", borderRadius: 6, background: "#FFFFFF", boxShadow: "0 3px 9px rgba(0,0,0,.16)", translate: `${slideOffset - VIEWER_WIDTH}px 0` }}
            />
          ) : null}
          <Img
            src={staticFile(`images/repair/${selectedPhoto.file}`)}
            alt={selectedPhoto.description}
            style={{ position: "absolute", top: 8, left: 8, width: VIEWER_WIDTH - 16, height: 276, objectFit: "cover", borderRadius: 6, background: "#FFFFFF", boxShadow: "0 3px 9px rgba(0,0,0,.16)", translate: `${isSliding ? slideOffset : 0}px 0` }}
          />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
            {REPAIR_PHOTOS.map((photo, index) => (
              <div key={photo.file} aria-label={`Photo ${index + 1}`} style={{ width: 7, height: 7, borderRadius: "50%", background: index === selectedIndex ? COLORS.vwBlue : "rgba(75,85,99,.28)", scale: index === selectedIndex ? 1.25 : 1 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
