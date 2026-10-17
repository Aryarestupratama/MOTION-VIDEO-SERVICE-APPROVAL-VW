import React from "react";
import { Easing } from "remotion";
import { ArrowDown, Clock } from "lucide-react";
import { Img, staticFile } from "remotion";
import { COLORS, fontFamily } from "../theme";

export const STATUS_ITEMS = [
  {
    key: "work_in_progress",
    label: "Work In Process",
    shortLabel: "Process",
    description: "Our technicians are working on your vehicle.",
  },
  {
    key: "quality_control",
    label: "Quality Control",
    shortLabel: "QC",
    description: "Your vehicle is being checked and washed before handover.",
  },
  {
    key: "invoice_preparation",
    label: "Invoice",
    shortLabel: "Invoice",
    description: "Your invoice is ready. Please review it and proceed with payment.",
  },
  {
    key: "completed",
    label: "Completed",
    shortLabel: "Done",
    description: "Your service is complete. Thank you for choosing us.",
  },
] as const;

export type StatusKey = (typeof STATUS_ITEMS)[number]["key"];

type StatusHeroMockProps = {
  /** Status yang sedang tampil (0..3). */
  index: number;
  /** Perpindahan dari status sebelumnya ke `index`: 0 = masih status lama, 1 = selesai. Abaikan untuk index 0. */
  changeProgress: number;
};

const smooth = Easing.inOut(Easing.cubic);

/** Dua lapis teks: yang lama memudar naik, yang baru muncul dari bawah. Lapis baru menentukan ukuran. */
const Swap: React.FC<{
  t: number;
  previous: React.ReactNode;
  current: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ t, previous, current, style }) => (
  <div style={{ position: "relative", ...style }}>
    {previous !== null && t < 1 ? (
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 1 - t, transform: `translateY(${-6 * t}px)` }}>{previous}</div>
    ) : null}
    <div style={{ opacity: previous === null ? 1 : t, transform: previous === null ? undefined : `translateY(${(1 - t) * 6}px)` }}>{current}</div>
  </div>
);

export const StatusHeroMock: React.FC<StatusHeroMockProps> = ({ index, changeProgress }) => {
  const current = STATUS_ITEMS[index];
  const previous = index > 0 ? STATUS_ITEMS[index - 1] : null;
  const t = previous ? smooth(Math.max(0, Math.min(1, changeProgress))) : 1;
  const heroT = previous ? Math.max(0, Math.min(1, changeProgress)) : 1;
  const next = STATUS_ITEMS[index + 1];
  const previousNext = previous ? STATUS_ITEMS[index] : null; // "next" pada status lama = status sekarang
  const previousPrev = previous && index > 1 ? STATUS_ITEMS[index - 2] : null;

  const line = (title: string, sub: string, align: "left" | "right") => (
    <div style={{ textAlign: align, minHeight: 36 }}>
      <p style={{ margin: 0, color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>{title}</p>
      <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 12 }}>{sub}</p>
    </div>
  );

  const heroImage = (key: string, translatePercent: number) => (
    <Img
      key={key}
      src={staticFile(`images/stages/${key}.jpg`)}
      alt=""
      style={{
        display: "block",
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        mixBlendMode: "multiply",
        transform: `translateX(${translatePercent}%)`,
      }}
    />
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 400,
        overflow: "hidden",
        color: "#111827",
        fontFamily,
        pointerEvents: "none",
      }}
    >
      <header style={{ padding: "46px 18px 8px", background: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 8,
              background: "#FFFFFF",
              boxShadow: "0 0 0 1px rgba(75,85,99,.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img src={staticFile("images/vw-logo-navy.jpeg")} alt="Volkswagen" style={{ width: 38, height: 38, objectFit: "contain", padding: 2 }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: COLORS.vwBlue, fontSize: 14, fontWeight: 700 }}>VW PIK Service</p>
            <p style={{ margin: 0, color: "#4B5563", fontSize: 12 }}>Service Inspection Report</p>
          </div>
        </div>
        <div style={{ height: 272, margin: "12px -18px 0", position: "relative", overflow: "hidden" }}>
          {previous ? heroImage(previous.key, -heroT * 100) : null}
          {heroImage(current.key, (1 - heroT) * 100)}
        </div>
      </header>

      {/* Kartu progress: PATEN. Hanya teks status dan progress bar yang berubah. */}
      <section
        style={{
          margin: "16px 16px 0",
          borderRadius: 24,
          padding: 16,
          color: COLORS.white,
          background: COLORS.vwBlue,
          boxShadow: "0 10px 22px rgba(22,30,89,.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ margin: 0, color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>Current progress</p>
            <Swap
              t={t}
              previous={previous ? <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 12, whiteSpace: "nowrap" }}>Step {index} of {STATUS_ITEMS.length}</p> : null}
              current={<p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 12, whiteSpace: "nowrap" }}>Step {index + 1} of {STATUS_ITEMS.length}</p>}
              style={{ minHeight: 18, minWidth: 80 }}
            />
          </div>
          <span
            style={{
              width: 128,
              flexShrink: 0,
              borderRadius: 999,
              padding: "7px 0",
              background: "rgba(255,255,255,.14)",
              color: COLORS.white,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            <Swap t={t} previous={previous ? <span>{previous.label}</span> : null} current={<span>{current.label}</span>} />
          </span>
        </div>

        <Swap
          t={t}
          previous={previous ? <p style={{ margin: 0, color: "#FFFFFF", fontSize: 20, lineHeight: "24px", fontWeight: 700 }}>{previous.label}</p> : null}
          current={<p style={{ margin: 0, color: "#FFFFFF", fontSize: 20, lineHeight: "24px", fontWeight: 700 }}>{current.label}</p>}
          style={{ marginTop: 12, minHeight: 24 }}
        />
        <Swap
          t={t}
          previous={previous ? <p style={{ margin: 0, color: "rgba(255,255,255,.76)", fontSize: 12, lineHeight: 1.35 }}>{previous.description}</p> : null}
          current={<p style={{ margin: 0, color: "rgba(255,255,255,.76)", fontSize: 12, lineHeight: 1.35 }}>{current.description}</p>}
          style={{ marginTop: 4, minHeight: 33 }}
        />

        {/* Progress bar: segmen status baru terisi pelan-pelan. */}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {STATUS_ITEMS.map((item, i) => {
            const fill = i < index ? 1 : i === index ? t : 0;
            return (
              <div key={item.key} style={{ height: 6, flex: 1, borderRadius: 999, background: "rgba(255,255,255,.25)", overflow: "hidden" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 999, background: "#FFFFFF" }} />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, minHeight: 36 }}>
          <Swap
            t={t}
            previous={previous ? (previousPrev ? line(previousPrev.label, "Done", "left") : <div style={{ minHeight: 36 }} />) : null}
            current={previous ? line(previous.label, "Done", "left") : <div style={{ minHeight: 36 }} />}
            style={{ minWidth: 120 }}
          />
          <Swap
            t={t}
            previous={previous && previousNext ? line(previousNext.label, "Next", "right") : null}
            current={next ? line(next.label, "Next", "right") : <div style={{ minHeight: 36 }} />}
            style={{ minWidth: 120 }}
          />
        </div>
      </section>

      {/* Lanjutan halaman asli di bawah kartu progress (tidak berubah antar status). */}
      <div style={{ margin: "16px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          ["License Number", "B 1234 VW"],
          ["Customer", "Dina Pratama (Demo)"],
        ].map(([label, value]) => (
          <div key={label} style={{ minWidth: 0, borderRadius: 12, background: "rgba(242,242,242,.7)", padding: "12px 16px" }}>
            <p style={{ margin: 0, color: "#767676", fontSize: 12, lineHeight: "16px" }}>{label}</p>
            <p style={{ margin: "2px 0 0", color: "#111827", fontSize: 14, lineHeight: "20px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          margin: "24px 16px 0",
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderRadius: 12,
          border: "1px solid #FCD34D",
          background: "#FFFBEB",
          padding: "8px 12px",
          color: "#78350F",
          fontSize: 13,
          fontWeight: 600,
          boxShadow: "0 1px 2px rgba(0,0,0,.05)",
        }}
      >
        <span style={{ width: 28, height: 28, flexShrink: 0, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Clock size={16} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>5 items to decide</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, minHeight: 34, borderRadius: 999, background: "#B45309", padding: "0 12px", color: "#FFFFFF", fontSize: 13, fontWeight: 700 }}>
          Review <ArrowDown size={16} />
        </span>
      </div>

      <div style={{ margin: "32px 16px 0", fontSize: 16, fontWeight: 700, color: "#111827" }}>Inspection video</div>
    </div>
  );
};
