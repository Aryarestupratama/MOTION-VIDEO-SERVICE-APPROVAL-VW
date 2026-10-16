import React from "react";
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
  status: StatusKey;
  progress: number;
  isIncoming: boolean;
};

export const StatusHeroMock: React.FC<StatusHeroMockProps> = ({
  status,
  progress,
  isIncoming,
}) => {
  const stepIndex = STATUS_ITEMS.findIndex((item) => item.key === status);
  const current = STATUS_ITEMS[stepIndex];
  const previous = STATUS_ITEMS[stepIndex - 1];
  const next = STATUS_ITEMS[stepIndex + 1];
  const illustrationScale = isIncoming ? 1.05 - 0.05 * progress : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 400,
        height: 600,
        overflow: "hidden",
        color: "#111827",
        fontFamily,
        opacity: progress,
        pointerEvents: "none",
      }}
    >
      <header style={{ padding: "18px 18px 8px", background: "#FFFFFF" }}>
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
            <Img
              src={staticFile("images/vw-logo-navy.jpeg")}
              alt="Volkswagen"
              style={{ width: 38, height: 38, objectFit: "contain", padding: 2 }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: COLORS.vwBlue, fontSize: 14, fontWeight: 700 }}>VW PIK Service</p>
            <p style={{ margin: 0, color: "#4B5563", fontSize: 12 }}>Service Inspection Report</p>
          </div>
        </div>
        <div
          style={{
            height: 288,
            margin: "12px -18px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(`images/stages/${current.key}.jpg`)}
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              mixBlendMode: "multiply",
              scale: illustrationScale,
            }}
          />
        </div>
      </header>

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
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 12 }}>
              Step {stepIndex + 1} of {STATUS_ITEMS.length}
            </p>
          </div>
          <span
            style={{
              borderRadius: 999,
              padding: "7px 11px",
              background: "rgba(255,255,255,.14)",
              color: COLORS.white,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {current.label}
          </span>
        </div>

        <p style={{ margin: "12px 0 0", color: "#FFFFFF", fontSize: 20, lineHeight: 1.2, fontWeight: 700 }}>
          {current.label}
        </p>
        <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,.76)", fontSize: 12, lineHeight: 1.35 }}>
          {current.description}
        </p>

        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {STATUS_ITEMS.map((item, index) => (
            <div
              key={item.key}
              style={{
                height: 6,
                flex: 1,
                borderRadius: 999,
                background: index <= stepIndex ? "#FFFFFF" : "rgba(255,255,255,.25)",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, minHeight: 31 }}>
          <div>
            {previous ? (
              <>
                <p style={{ margin: 0, color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>{previous.label}</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 12 }}>Done</p>
              </>
            ) : null}
          </div>
          <div style={{ textAlign: "right" }}>
            {next ? (
              <>
                <p style={{ margin: 0, color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>{next.label}</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 12 }}>Next</p>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};
