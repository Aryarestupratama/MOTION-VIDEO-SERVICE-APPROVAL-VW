import React from "react";
import { Check, ClipboardCheck, X } from "lucide-react";
import { COLORS, fontFamily } from "../theme";

export type EstimateDecision = "pending" | "approved" | "rejected";

export type EstimateItem = {
  name: string;
  description: string;
  price: number;
};

export const ESTIMATE_ITEMS: EstimateItem[] = [
  { name: "Ganti kampas rem depan", description: "Kampas rem depan sudah aus dan perlu diganti.", price: 1850000 },
  { name: "Servis dan isi refrigerant AC", description: "Performa pendinginan AC perlu dipulihkan.", price: 1250000 },
  { name: "Ganti filter udara mesin", description: "Filter kotor dan aliran udara berkurang.", price: 475000 },
];

export const formatEstimateIDR = (amount: number) =>
  `Rp${Math.round(amount).toLocaleString("id-ID")}`;

type EstimateApprovalMockProps = {
  decisions: EstimateDecision[];
  submitEnabled: boolean;
  submitted: boolean;
  total: number;
  approveProgress: number[];
  rejectProgress: number[];
  submitPressProgress: number;
  submitRippleProgress: number;
  checkProgress: number[];
  crossProgress: number[];
  totalChangeProgress: number;
  contentScrollY: number;
};

const GREEN = COLORS.approved;
const AnimatedCheck: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 * (1 - progress)} />
  </svg>
);

const AnimatedCross: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="34" strokeDashoffset={34 * (1 - progress)} />
  </svg>
);

export const EstimateApprovalMock: React.FC<EstimateApprovalMockProps> = ({
  decisions,
  submitEnabled,
  submitted,
  total,
  approveProgress,
  rejectProgress,
  submitPressProgress,
  submitRippleProgress,
  checkProgress,
  crossProgress,
  totalChangeProgress,
  contentScrollY,
}) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#F8F9FC", color: "#111827", fontFamily }}>
    <div style={{ height: 72, padding: "24px 20px 12px", boxSizing: "border-box", background: "#FFFFFF", borderBottom: "1px solid rgba(75,85,99,0.12)" }}>
      <div style={{ fontSize: 19, lineHeight: "24px", fontWeight: 700, color: COLORS.vwBlue }}>Inspection report</div>
      <div style={{ marginTop: 2, fontSize: 11, color: "#4B5563" }}>Order VWPIK-2026-0042 · Estimasi servis</div>
    </div>

    <div style={{ position: "absolute", inset: "72px 0 88px", padding: "16px 14px 20px", overflow: "hidden" }}>
      <div style={{ transform: `translateY(${contentScrollY}px)` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Inspection items</span>
        <span style={{ borderRadius: 999, padding: "5px 10px", background: "#FFFBEB", color: "#B45309", boxShadow: "inset 0 0 0 1px #FDE68A", fontSize: 10, fontWeight: 700 }}>Estimated Price</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ESTIMATE_ITEMS.map((item, index) => {
          const decision = decisions[index] ?? "pending";
          const settled = decision !== "pending";
          const activeProgress = decision === "approved" ? approveProgress[index] : rejectProgress[index];
          const green = decision === "approved";
          const actionProgress = settled ? Math.max(0, Math.min(1, activeProgress)) : 0;
          const scale = 1 - (green ? 0.05 : 0.035) * actionProgress;

          return (
            <div key={item.name} style={{ position: "relative", overflow: "hidden", padding: 12, borderRadius: 22, background: green ? "#F5FBF5" : "#FFFFFF", boxShadow: `inset 0 0 0 1px ${green ? "rgba(46,125,50,0.4)" : "rgba(0,0,0,0.04)"}, 0 8px 22px -12px rgba(22,27,89,0.22)`, transform: `scale(${scale})` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 12, lineHeight: "16px", fontWeight: 700 }}>{item.name}</div>
                <span style={{ flexShrink: 0, borderRadius: 999, padding: "4px 7px", background: decision === "pending" ? "#FFFBEB" : green ? "rgba(46,125,50,0.1)" : "#F3F4F6", color: decision === "pending" ? "#B45309" : green ? GREEN : "#374151", boxShadow: `inset 0 0 0 1px ${decision === "pending" ? "#FDE68A" : green ? "rgba(46,125,50,0.25)" : "#D1D5DB"}`, fontSize: 9, fontWeight: 700 }}>
                  {decision === "pending" ? "Waiting" : green ? "Approved" : "Rejected"}
                </span>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 10, lineHeight: "14px", color: "#4B5563" }}>{item.description}</p>
              <div style={{ margin: "9px 0 8px", borderTop: "1px dashed rgba(75,85,99,0.3)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.vwBlue }}>{formatEstimateIDR(item.price)}</span>
              </div>
              <div style={{ marginTop: 2, textAlign: "right", fontSize: 9, color: "#6B7280" }}>Price excludes VAT</div>

              {decision === "pending" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 9 }}>
                  <div style={{ position: "relative", overflow: "hidden", height: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 999, color: GREEN, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(46,125,50,0.6)", fontSize: 11, fontWeight: 700, transform: `scale(${1 - 0.05 * (approveProgress[index] ?? 0)})` }}>
                    {approveProgress[index] > 0 && <span style={{ position: "absolute", width: 12 + approveProgress[index] * 50, height: 12 + approveProgress[index] * 50, borderRadius: 999, background: "rgba(46,125,50,0.18)", opacity: 1 - approveProgress[index], pointerEvents: "none" }} />}
                    <Check size={13} strokeWidth={3} />Approve
                  </div>
                  <div style={{ position: "relative", overflow: "hidden", height: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 999, color: "#374151", background: "#FFFFFF", boxShadow: "inset 0 0 0 1px #9CA3AF", fontSize: 11, fontWeight: 700, transform: `scale(${1 - 0.05 * (rejectProgress[index] ?? 0)})` }}>
                    {rejectProgress[index] > 0 && <span style={{ position: "absolute", width: 12 + rejectProgress[index] * 50, height: 12 + rejectProgress[index] * 50, borderRadius: 999, background: "rgba(55,65,81,0.16)", opacity: 1 - rejectProgress[index], pointerEvents: "none" }} />}
                    <X size={13} strokeWidth={3} />Reject
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 9 }}>
                  <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 999, color: "white", background: green ? GREEN : "#374151", fontSize: 10, fontWeight: 700 }}>
                    {green ? <AnimatedCheck progress={checkProgress[index]} /> : <AnimatedCross progress={crossProgress[index]} />}{green ? "Approved" : "Rejected"}
                  </div>
                  <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, color: "#374151", background: "white", boxShadow: "inset 0 0 0 1px rgba(75,85,99,0.3)", fontSize: 10, fontWeight: 700 }}>↶ Change</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, padding: 14, borderRadius: 22, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 22px -12px rgba(22,27,89,0.22)" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Order summary</div>
        <div style={{ marginTop: 9, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4B5563" }}><span>Subtotal approved items</span><span>{formatEstimateIDR(total)}</span></div>
        <div style={{ marginTop: 5, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4B5563" }}><span>VAT (11%)</span><span>{formatEstimateIDR(total * 0.11)}</span></div>
        <div style={{ margin: "10px 0 8px", borderTop: "1px dashed rgba(75,85,99,0.3)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 11, fontWeight: 700 }}>Estimated total</span><span style={{ fontSize: 17, fontWeight: 700, color: COLORS.vwBlue, opacity: 0.55 + totalChangeProgress * 0.45 }}>{formatEstimateIDR(total * 1.11)}</span></div>
      </div>
      </div>
    </div>

    <div style={{ position: "absolute", inset: "auto 0 0", minHeight: 78, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 16px", borderTop: "1px solid rgba(75,85,99,0.15)", borderRadius: "20px 20px 0 0", background: "rgba(255,255,255,0.97)", boxShadow: "0 -8px 24px -12px rgba(0,0,0,0.25)" }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700 }}>{decisions.filter((decision) => decision !== "pending").length} of {ESTIMATE_ITEMS.length} decided</div>
        <div style={{ marginTop: 2, fontSize: 9, color: "#4B5563" }}>Estimated items total <b style={{ color: COLORS.vwBlue }}>{formatEstimateIDR(total)}</b></div>
      </div>
      <div style={{ position: "relative", overflow: "hidden", height: 42, minWidth: 104, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 999, padding: "0 14px", color: submitEnabled || submitted ? "#FFFFFF" : "#6B7280", background: submitted ? GREEN : submitEnabled ? COLORS.vwBlue : "#D1D5DB", boxShadow: submitEnabled && !submitted ? "0 5px 12px rgba(22,30,89,0.2)" : "none", fontSize: 11, fontWeight: 700, transform: `scale(${1 - 0.05 * submitPressProgress})` }}>
        {submitRippleProgress > 0 && <span style={{ position: "absolute", width: 12 + submitRippleProgress * 70, height: 12 + submitRippleProgress * 70, borderRadius: 999, background: "rgba(255,255,255,0.35)", opacity: 1 - submitRippleProgress, pointerEvents: "none" }} />}
        {submitted ? <Check size={14} strokeWidth={3} /> : <ClipboardCheck size={13} />}{submitted ? "Submitted" : `Submit (${decisions.filter((decision) => decision !== "pending").length})`}
      </div>
    </div>
  </div>
);

