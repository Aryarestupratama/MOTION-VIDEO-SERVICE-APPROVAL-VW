import React from "react";
import { Check, ClipboardCheck, Loader2, Undo2, X } from "lucide-react";
import { COLORS, fontFamily } from "../theme";

// Layar HP untuk scene Price Transparency. Susunan, label, dan angka mengikuti
// InspectionReport.jsx asli (kartu item, Order summary, sticky bar, sheet
// "Confirm your decision", daftar "Already decided"). Semua inline style supaya
// tidak perlu membuat ulang tailwind.generated.css.

export type PriceDecision = "pending" | "approved" | "rejected";

export const PRICE_ITEMS = [
  { name: "Engine oil & oil filter replacement", description: "VW 504 00 / 507 00 spec 5W-30 synthetic oil with genuine oil filter", price: 1_895_000, discount: 19_000 },
  { name: "Cabin air filter replacement", description: "Clogged filter reduces airflow and A/C performance", price: 650_000, discount: 6_500 },
  { name: "Brake fluid replacement", description: "Replace brake fluid and bleed the braking system.", price: 1_200_000, discount: 12_000 },
  { name: "Front brake pad replacement", description: "Replace front brake pads and inspect brake discs.", price: 875_000, discount: 8_750 },
  { name: "Multi-point vehicle inspection", description: "Inspection of key vehicle safety and operating systems.", price: 565_000, discount: 5_750 },
] as const;

const VAT_PERCENT = 11;

// ---------- Geometri (koordinat layar HP, lebar 390) ----------
export const SCREEN_W = 390;
export const COVER_H = 44; // strip putih di bawah kamera
export const SCREEN_H = 1032; // tinggi area layar HP (1060 - 2*14)
export const VISIBLE_BOTTOM = 786; // batas bawah layar yang terlihat pada HP setengah (scale 1.8, top 480)
export const BAR_TOP = 700;
export const SIDE = 16;
export const HEADER_Y = 56;
export const BULK_Y = 96;
export const CARD_H = 236;
export const CARD_GAP = 12;
export const CARD_PITCH = CARD_H + CARD_GAP;
export const CARD0_Y = 152;
export const cardTop = (index: number) => CARD0_Y + index * CARD_PITCH;
export const SUMMARY_H = 262;
export const SUMMARY_Y = cardTop(PRICE_ITEMS.length - 1) + CARD_H + 32;
export const SUMMARY_W = SCREEN_W - SIDE * 2;
// Layout setelah submit ("Already decided")
const POST_LABEL_Y = 108;
const POST_ROWS_Y = 138;
const POST_ROW_H = 64;
const POST_ROW_GAP = 8;
const POST_SUMMARY_Y = POST_ROWS_Y + PRICE_ITEMS.length * (POST_ROW_H + POST_ROW_GAP) + 24;

// ---------- Hitungan uang (rumus sama dengan halaman asli) ----------
export const computeSummary = (decisions: PriceDecision[], onlyDecided = false) => {
  const included = PRICE_ITEMS.filter((_, i) => {
    const d = decisions[i] ?? "pending";
    return onlyDecided ? d === "approved" : d !== "rejected";
  });
  const listTotal = included.reduce((s, it) => s + it.price, 0);
  const discount = included.reduce((s, it) => s + it.discount, 0);
  const subtotal = listTotal - discount;
  const vat = Math.round((subtotal * VAT_PERCENT) / 100);
  return { listTotal, discount, subtotal, vat, total: subtotal + vat };
};

const formatNumber = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ---------- Warna ----------
const G900 = "#111827";
const G800 = "#1F2937";
const G700 = "#374151";
const G600 = "#4B5563";
const GREY = "#767676";
const GREEN = COLORS.approved;
const CARD_SHADOW = "0 12px 40px -16px rgba(22,27,89,0.22)";
const RESET: React.CSSProperties = { margin: 0, padding: 0, boxSizing: "border-box" };

const Rupiah: React.FC<{ value: number; style?: React.CSSProperties }> = ({ value, style }) => (
  <span style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", ...style }}>
    <span style={{ marginRight: 2, fontSize: "0.7em", fontWeight: 500, opacity: 0.6 }}>Rp</span>
    {formatNumber(value)}
  </span>
);

const Ripple: React.FC<{ progress: number; color: string; max?: number }> = ({ progress, color, max = 90 }) =>
  progress > 0 && progress < 1 ? (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 12 + progress * max,
        height: 12 + progress * max,
        marginLeft: -(12 + progress * max) / 2,
        marginTop: -(12 + progress * max) / 2,
        borderRadius: 999,
        background: color,
        opacity: 1 - progress,
        pointerEvents: "none",
      }}
    />
  ) : null;

const AnimatedCheck: React.FC<{ progress: number; size?: number }> = ({ progress, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 * (1 - progress)} />
  </svg>
);

const AnimatedCross: React.FC<{ progress: number; size?: number }> = ({ progress, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="34" strokeDashoffset={34 * (1 - progress)} />
  </svg>
);

// ---------- Kartu Order summary (dipakai di halaman dan di overlay "melayang") ----------
export const OrderSummaryCard: React.FC<{
  decisions: PriceDecision[];
  shadow?: string;
  highlight?: number;
}> = ({ decisions, shadow, highlight = 0 }) => {
  const s = computeSummary(decisions);
  const rows: [string, React.ReactNode][] = [
    ["Price before discount", <Rupiah key="a" value={s.listTotal} />],
    ["Discount", <span key="b" style={{ color: GREEN }}>−<Rupiah value={s.discount} /></span>],
    ["Subtotal", <Rupiah key="c" value={s.subtotal} />],
    [`VAT (${VAT_PERCENT}%)`, <Rupiah key="d" value={s.vat} />],
  ];
  return (
    <div
      style={{
        ...RESET,
        width: SUMMARY_W,
        height: SUMMARY_H,
        padding: 20,
        borderRadius: 24,
        background: "#FFFFFF",
        boxShadow: `0 0 0 1px rgba(0,0,0,0.04), ${shadow ?? CARD_SHADOW}`,
        fontFamily,
        color: G900,
      }}
    >
      <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 700 }}>Order summary</div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, fontSize: 14, lineHeight: "20px" }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ color: GREY }}>{label}</span>
            <span style={{ fontWeight: 600, color: G900 }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ margin: "16px 0", borderTop: "1px dashed rgba(118,118,118,0.3)" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>Estimated total</span>
        <span style={{ display: "inline-block", transform: `scale(${1 + highlight * 0.08})`, transformOrigin: "100% 50%" }}>
          <Rupiah value={s.total} style={{ fontSize: 24, lineHeight: "32px", fontWeight: 700, color: COLORS.vwBlue }} />
        </span>
      </div>
    </div>
  );
};

// ---------- Tombol kartu ----------
const OutlineButton: React.FC<{
  kind: "approve" | "reject";
  press: number;
  ripple: number;
}> = ({ kind, press, ripple }) => {
  const approve = kind === "approve";
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 999,
        background: "#FFFFFF",
        boxShadow: `inset 0 0 0 1px ${approve ? "rgba(46,125,50,0.6)" : "#9CA3AF"}`,
        color: approve ? GREEN : G700,
        fontSize: 13,
        fontWeight: 600,
        transform: `scale(${1 - 0.05 * press})`,
      }}
    >
      <Ripple progress={ripple} color={approve ? "rgba(46,125,50,0.2)" : "rgba(55,65,81,0.16)"} max={80} />
      {approve ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
      {approve ? "Approve" : "Reject"}
    </div>
  );
};

type Stamp = { label: string; bg: string; color: string; ring: string };
const STAMPS: Record<PriceDecision, Stamp> = {
  pending: { label: "Waiting", bg: "#FFFBEB", color: "#B45309", ring: "#FDE68A" },
  approved: { label: "Approved", bg: "rgba(46,125,50,0.1)", color: GREEN, ring: "rgba(46,125,50,0.25)" },
  rejected: { label: "Rejected", bg: "#F3F4F6", color: G700, ring: "#D1D5DB" },
};

const StatusStamp: React.FC<{ decision: PriceDecision }> = ({ decision }) => {
  const st = STAMPS[decision];
  return (
    <span
      style={{
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        gap: 4,
        borderRadius: 999,
        padding: "4px 10px",
        background: st.bg,
        color: st.color,
        boxShadow: `inset 0 0 0 1px ${st.ring}`,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: 600,
      }}
    >
      {decision === "approved" ? <Check size={12} strokeWidth={3} /> : decision === "rejected" ? <X size={12} strokeWidth={3} /> : <ClockIcon />}
      {st.label}
    </span>
  );
};

const ClockIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const ItemCard: React.FC<{
  index: number;
  decision: PriceDecision;
  stampProgress: number;
  pressApprove: number;
  pressReject: number;
  rippleApprove: number;
  rippleReject: number;
}> = ({ index, decision, stampProgress, pressApprove, pressReject, rippleApprove, rippleReject }) => {
  const item = PRICE_ITEMS[index];
  const approved = decision === "approved";
  const settle = decision === "pending" ? 0 : stampProgress;
  return (
    <div
      style={{
        ...RESET,
        position: "absolute",
        left: SIDE,
        right: SIDE,
        top: cardTop(index),
        height: CARD_H,
        padding: 16,
        borderRadius: 24,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: approved ? "rgba(46,125,50,0.05)" : "#FFFFFF",
        boxShadow: `0 0 0 1px ${approved ? "rgba(46,125,50,0.4)" : "rgba(0,0,0,0.04)"}, ${CARD_SHADOW}`,
        transform: `scale(${1 - 0.03 * Math.sin(Math.min(1, settle) * Math.PI)})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0, fontSize: 15, lineHeight: "20.6px", fontWeight: 700, color: G900 }}>{item.name}</div>
        <StatusStamp decision={decision} />
      </div>
      <div style={{ marginTop: 2, fontSize: 13, lineHeight: "17.9px", color: G600 }}>{item.description}</div>
      <div style={{ marginTop: "auto" }}>
        <div style={{ margin: "12px 0", borderTop: "1px dashed rgba(118,118,118,0.3)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: G900 }}>Total</span>
          <Rupiah value={item.price} style={{ fontSize: 20, lineHeight: "28px", fontWeight: 700, color: COLORS.vwBlue }} />
        </div>
        <div style={{ marginTop: 2, textAlign: "right", fontSize: 12, lineHeight: "16px", color: GREY }}>Price excludes VAT</div>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {decision === "pending" ? (
            <>
              <OutlineButton kind="approve" press={pressApprove} ripple={rippleApprove} />
              <OutlineButton kind="reject" press={pressReject} ripple={rippleReject} />
            </>
          ) : (
            <>
              <div
                style={{
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderRadius: 999,
                  background: approved ? GREEN : G700,
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {approved ? <AnimatedCheck progress={stampProgress} /> : <AnimatedCross progress={stampProgress} />}
                {approved ? "Approved" : "Rejected"}
              </div>
              <div
                style={{
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderRadius: 999,
                  background: "#FFFFFF",
                  boxShadow: "inset 0 0 0 1px rgba(118,118,118,0.3)",
                  color: G700,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Undo2 size={14} />
                Change
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC = () => (
  <div style={{ position: "absolute", left: SIDE, right: SIDE, top: HEADER_Y, height: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ fontSize: 16, fontWeight: 700, color: G900 }}>Inspection items</span>
    <span style={{ borderRadius: 999, padding: "4px 12px", background: "#FFFBEB", color: "#B45309", boxShadow: "inset 0 0 0 1px #FDE68A", fontSize: 12, lineHeight: "16px", fontWeight: 600 }}>
      Estimated Price
    </span>
  </div>
);

const DecidedRow: React.FC<{ index: number; decision: PriceDecision }> = ({ index, decision }) => {
  const item = PRICE_ITEMS[index];
  const ok = decision === "approved";
  return (
    <div
      style={{
        ...RESET,
        position: "absolute",
        left: SIDE,
        right: SIDE,
        top: POST_ROWS_Y + index * (POST_ROW_H + POST_ROW_GAP),
        height: POST_ROW_H,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 14px",
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 10px 30px -16px rgba(22,27,89,0.22)",
      }}
    >
      <span style={{ width: 28, height: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: ok ? GREEN : "rgba(118,118,118,0.2)", color: ok ? "#FFFFFF" : GREY }}>
        {ok ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 14, lineHeight: "19px", fontWeight: 500, color: ok ? G800 : G600, textDecoration: ok ? "none" : "line-through", textDecorationThickness: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.name}
        </div>
        {ok ? (
          <Rupiah value={item.price} style={{ display: "block", marginTop: 2, fontSize: 14, fontWeight: 600, color: G900 }} />
        ) : (
          <div style={{ marginTop: 2, fontSize: 12, fontWeight: 500, color: G600 }}>Rejected</div>
        )}
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: G600 }}>
        <Undo2 size={12} />
        Change
      </span>
    </div>
  );
};

export type PriceDecisionMockProps = {
  decisions: PriceDecision[];
  stampProgress: number[];
  pressApprove: number[];
  pressReject: number[];
  rippleApprove: number[];
  rippleReject: number[];
  scrollY: number;
  /** 1 = kartu Order summary di halaman disembunyikan (sedang melayang sebagai overlay). */
  summaryHidden: boolean;
  submittedProgress: number; // 0 = kartu keputusan, 1 = daftar "Already decided"
  barProgress: number; // 1 = bar terlihat
  submitPress: number;
  submitRipple: number;
  sheetProgress: number; // 0..1 naik dari bawah
  confirmPress: number;
  confirmRipple: number;
  submitting: boolean;
  spinnerAngle: number;
};

/**
 * Potongan statis halaman asli (judul "Inspection items", Approve all / Reject all, dua kartu item).
 * Dipakai scene lain sebagai lanjutan halaman di bawah bagian foto. Posisi atas = judul pada y = 0.
 */
export const InspectionItemsPreview: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: -HEADER_Y, width: SCREEN_W, height: 900 }}>
    <SectionHeader />
    <div style={{ position: "absolute", left: SIDE, right: SIDE, top: BULK_Y, height: 44, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 999, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(46,125,50,0.6)", color: GREEN, fontSize: 13, fontWeight: 600 }}>
        <Check size={14} strokeWidth={3} /> Approve all
      </div>
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 999, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px #9CA3AF", color: G700, fontSize: 13, fontWeight: 600 }}>
        <X size={14} strokeWidth={3} /> Reject all
      </div>
    </div>
    {[0, 1].map((i) => (
      <ItemCard key={i} index={i} decision="pending" stampProgress={0} pressApprove={0} pressReject={0} rippleApprove={0} rippleReject={0} />
    ))}
  </div>
);

export const PriceDecisionMock: React.FC<PriceDecisionMockProps> = (p) => {
  const decidedCount = p.decisions.filter((d) => d !== "pending").length;
  const hasPending = decidedCount < PRICE_ITEMS.length;
  const live = computeSummary(p.decisions);
  const sheet = computeSummary(p.decisions, true);
  const approvedCount = p.decisions.filter((d) => d === "approved").length;
  const rejectedCount = p.decisions.filter((d) => d === "rejected").length;
  const preOpacity = 1 - p.submittedProgress;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#FFFFFF", fontFamily, color: G900 }}>
      {/* Isi halaman yang bisa di-scroll */}
      <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: 2400, translate: `0 ${-p.scrollY}px` }}>
        {/* Layout sebelum submit */}
        <div style={{ position: "absolute", inset: 0, opacity: preOpacity, pointerEvents: "none" }}>
          <SectionHeader />
          <div style={{ position: "absolute", left: SIDE, right: SIDE, top: BULK_Y, height: 44, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, opacity: hasPending ? 1 : 0 }}>
            <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 999, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(46,125,50,0.6)", color: GREEN, fontSize: 13, fontWeight: 600 }}>
              <Check size={14} strokeWidth={3} /> Approve all
            </div>
            <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 999, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px #9CA3AF", color: G700, fontSize: 13, fontWeight: 600 }}>
              <X size={14} strokeWidth={3} /> Reject all
            </div>
          </div>
          {PRICE_ITEMS.map((_, i) => (
            <ItemCard
              key={i}
              index={i}
              decision={p.decisions[i] ?? "pending"}
              stampProgress={p.stampProgress[i] ?? 0}
              pressApprove={p.pressApprove[i] ?? 0}
              pressReject={p.pressReject[i] ?? 0}
              rippleApprove={p.rippleApprove[i] ?? 0}
              rippleReject={p.rippleReject[i] ?? 0}
            />
          ))}
          <div style={{ position: "absolute", left: SIDE, top: SUMMARY_Y, opacity: p.summaryHidden ? 0 : 1 }}>
            <OrderSummaryCard decisions={p.decisions} />
          </div>
          <div style={{ position: "absolute", left: SIDE, right: SIDE, top: SUMMARY_Y + SUMMARY_H + 10, fontSize: 12, lineHeight: "16px", fontStyle: "italic", color: GREY }}>
            These prices are estimates and may change until finalized after inspection review.
          </div>
        </div>

        {/* Layout sesudah submit: "Already decided" */}
        <div style={{ position: "absolute", inset: 0, opacity: p.submittedProgress, pointerEvents: "none" }}>
          <SectionHeader />
          <div style={{ position: "absolute", left: SIDE, top: POST_LABEL_Y, fontSize: 14, fontWeight: 700, color: G900 }}>Already decided</div>
          {PRICE_ITEMS.map((_, i) => (
            <DecidedRow key={i} index={i} decision={p.decisions[i] ?? "pending"} />
          ))}
          <div style={{ position: "absolute", left: SIDE, top: POST_SUMMARY_Y }}>
            <OrderSummaryCard decisions={p.decisions} />
          </div>
        </div>
      </div>

      {/* Strip putih di bawah kamera (konten tidak boleh tertutup notch) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: COVER_H, background: "#FFFFFF", zIndex: 30 }} />

      {/* Sticky bottom bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: BAR_TOP,
          height: 170,
          zIndex: 40,
          borderRadius: "24px 24px 0 0",
          borderTop: "1px solid rgba(118,118,118,0.15)",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 -8px 24px -12px rgba(0,0,0,0.25)",
          transform: `translateY(${(1 - p.barProgress) * 190}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, lineHeight: "16px", fontWeight: 600, color: G800 }}>
              {decidedCount} of {PRICE_ITEMS.length} decided
            </div>
            <div style={{ fontSize: 12, lineHeight: "16px", color: G600, whiteSpace: "nowrap" }}>Estimated items total</div>
            <Rupiah value={live.total} style={{ display: "block", fontSize: 15, lineHeight: "20px", fontWeight: 700, color: COLORS.vwBlue }} />
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: 48,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "0 24px",
              borderRadius: 999,
              background: decidedCount > 0 ? COLORS.vwBlue : "rgba(118,118,118,0.3)",
              color: decidedCount > 0 ? "#FFFFFF" : GREY,
              boxShadow: decidedCount > 0 ? "0 6px 14px -4px rgba(22,30,89,0.25)" : "none",
              fontSize: 14,
              fontWeight: 600,
              transform: `scale(${1 - 0.05 * p.submitPress})`,
            }}
          >
            <Ripple progress={p.submitRipple} color="rgba(255,255,255,0.35)" max={150} />
            <ClipboardCheck size={14} />
            {decidedCount > 0 ? `Submit (${decidedCount})` : "Submit"}
          </div>
        </div>
      </div>

      {/* Dim di belakang sheet */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.45)", opacity: p.sheetProgress, pointerEvents: "none" }} />

      {/* Sheet "Confirm your decision" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          // Menempel ke dasar area yang terlihat (VISIBLE_BOTTOM); tinggi mengikuti isi.
          bottom: 0,
          zIndex: 60,
          padding: `20px 20px ${SCREEN_H - VISIBLE_BOTTOM + 28}px`,
          borderRadius: "16px 16px 0 0",
          background: "#FFFFFF",
          boxShadow: "0 -12px 40px -12px rgba(0,0,0,0.3)",
          transform: `translateY(${(1 - p.sheetProgress) * 1000}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(22,30,89,0.1)", color: COLORS.vwBlue }}>
            <ClipboardCheck size={20} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, lineHeight: "24px", fontWeight: 600, color: G900 }}>Confirm your decision</div>
            <div style={{ marginTop: 2, fontSize: 12, lineHeight: "16px", color: GREY }}>You can still change a decision until your vehicle enters quality control.</div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ borderRadius: 12, padding: "10px 16px", background: "rgba(46,125,50,0.1)", color: GREEN }}>
            <div style={{ fontSize: 24, lineHeight: "24px", fontWeight: 700 }}>{approvedCount}</div>
            <div style={{ marginTop: 4, fontSize: 10, lineHeight: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Approved</div>
          </div>
          <div style={{ borderRadius: 12, padding: "10px 16px", background: "rgba(118,118,118,0.1)", color: GREY }}>
            <div style={{ fontSize: 24, lineHeight: "24px", fontWeight: 700 }}>{rejectedCount}</div>
            <div style={{ marginTop: 4, fontSize: 10, lineHeight: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Rejected</div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {PRICE_ITEMS.map((item, i) => {
            const ok = p.decisions[i] === "approved";
            if (p.decisions[i] === "pending") return null;
            return (
              <div key={item.name} style={{ height: 42, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderRadius: 16, background: "#FFFFFF", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 10px 30px -16px rgba(22,27,89,0.22)" }}>
                <span style={{ width: 24, height: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: ok ? GREEN : "rgba(118,118,118,0.15)", color: ok ? "#FFFFFF" : GREY }}>
                  {ok ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                </span>
                <span style={{ minWidth: 0, flex: 1, fontSize: 13, fontWeight: 500, color: ok ? G800 : GREY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
                {ok ? <Rupiah value={item.price} style={{ fontSize: 13, fontWeight: 600, color: G900 }} /> : <span style={{ fontSize: 12, fontWeight: 500, color: GREY }}>Rejected</span>}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 20, background: "#FFFFFF", boxShadow: `0 0 0 1px rgba(0,0,0,0.04), ${CARD_SHADOW}` }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Summary</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, fontSize: 12, lineHeight: "16px" }}>
            {[
              ["Subtotal", <Rupiah key="s" value={sheet.subtotal} />],
              [`VAT (${VAT_PERCENT}%)`, <Rupiah key="v" value={sheet.vat} />],
            ].map(([label, value], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: GREY }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ margin: "8px 0", borderTop: "1px dashed rgba(118,118,118,0.3)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Total (this submission)</span>
            <Rupiah value={sheet.total} style={{ fontSize: 20, lineHeight: "28px", fontWeight: 700, color: COLORS.vwBlue }} />
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(118,118,118,0.3)", color: GREY, fontSize: 14, fontWeight: 600 }}>Back</div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRadius: 12,
              background: COLORS.vwBlue,
              color: "#FFFFFF",
              boxShadow: "0 10px 20px -8px rgba(22,30,89,0.4)",
              fontSize: 14,
              fontWeight: 600,
              opacity: p.submitting ? 0.5 : 1,
              transform: `scale(${1 - 0.05 * p.confirmPress})`,
            }}
          >
            <Ripple progress={p.confirmRipple} color="rgba(255,255,255,0.35)" max={150} />
            {p.submitting ? <Loader2 size={16} style={{ transform: `rotate(${p.spinnerAngle}deg)` }} /> : <Check size={16} strokeWidth={3} />}
            {p.submitting ? "Submitting..." : "Confirm & Submit"}
          </div>
        </div>
      </div>
    </div>
  );
};
