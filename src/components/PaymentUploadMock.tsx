import React from "react";
import { Check, ChevronRight, Copy, FileImage, LoaderCircle, Upload } from "lucide-react";
import { Img, staticFile } from "remotion";
import { COLORS, fontFamily } from "../theme";

// Layar HP untuk scene Payment Upload. Susunan dan label mengikuti blok Payment di
// InspectionReport.jsx asli (kartu Payment details, kartu rekening bank, kartu
// Payment receipt). Semua inline style supaya tidak perlu membuat ulang
// tailwind.generated.css. Tiga kartu dibuat sebagai komponen terpisah supaya
// scene bisa menampilkannya lagi sebagai overlay "melayang" di tengah layar.

export type PaymentUploadState = "empty" | "file-selected" | "uploading" | "success";

export const PAYMENT_DATA = {
  invoiceNumber: "INV-VWPIK-0042",
  billTo: "Dina Pratama",
  amountDue: 2_580_750,
  fileName: "bukti-transfer.jpg",
  uploadedAt: "16 Okt 2026, 14.32",
} as const;

const ACCOUNTS = [
  { bank: "Bank Central Asia", holder: "Volkswagen PIK", number: "123 456 7890", logo: "images/banks-bca.png" },
  { bank: "Bank Mandiri", holder: "Volkswagen PIK", number: "098 765 4321", logo: "images/banks-mandiri.png" },
] as const;

// ---------- Geometri (koordinat layar HP, lebar 390) ----------
export const SCREEN_W = 390;
export const SCREEN_H = 1032; // tinggi area layar HP (1060 - 2*14)
export const COVER_H = 44; // strip putih di bawah kamera
export const SIDE = 16;
export const CARD_W = SCREEN_W - SIDE * 2;
export const HEADER_Y = 60;
export const DETAILS_Y = 148;
export const DETAILS_H = 224;
export const BANK_Y = DETAILS_Y + DETAILS_H + 16;
export const BANK_H = 300;
export const RECEIPT_Y = BANK_Y + BANK_H + 16;
export const RECEIPT_H = 280;

// Posisi thumbnail bukti transfer di dalam kartu Payment receipt (koordinat kartu).
export const THUMB_LEFT = 32;
export const THUMB_TOP = 92;
export const THUMB_W = 112;
export const THUMB_H = 72;

// ---------- Warna ----------
const G900 = "#111827";
const G800 = "#1F2937";
const G600 = "#4B5563";
const GREY = "#767676";
const GREEN = COLORS.approved;
const CARD_SHADOW = "0 12px 40px -16px rgba(22,27,89,0.22)";
const RESET: React.CSSProperties = { margin: 0, padding: 0, boxSizing: "border-box" };

const formatNumber = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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

const SoftCard: React.FC<React.PropsWithChildren<{ height: number; shadow?: string; style?: React.CSSProperties }>> = ({
  height,
  shadow,
  style,
  children,
}) => (
  <div
    style={{
      ...RESET,
      position: "relative",
      width: CARD_W,
      height,
      padding: 20,
      borderRadius: 24,
      background: "#FFFFFF",
      boxShadow: `0 0 0 1px rgba(0,0,0,0.04), ${shadow ?? CARD_SHADOW}`,
      fontFamily,
      color: G900,
      ...style,
    }}
  >
    {children}
  </div>
);

const Divider: React.FC<{ margin?: string }> = ({ margin = "16px 0" }) => (
  <div style={{ margin, borderTop: "1px dashed rgba(118,118,118,0.3)" }} />
);

// ---------- Ilustrasi bukti transfer (gambar yang "masuk" ke kolom upload) ----------
export const PaymentProofIllustration: React.FC = () => (
  <svg viewBox="0 0 320 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustrasi bukti transfer">
    <rect x="0" y="0" width="320" height="190" fill="#fff" />
    <rect x="0" y="0" width="320" height="46" fill={COLORS.vwBlue} />
    <circle cx="26" cy="23" r="11" fill="#fff" opacity=".95" />
    <path d="M20 23h12M26 17v12" stroke={COLORS.vwBlue} strokeWidth="2.5" strokeLinecap="round" />
    <text x="46" y="28" fill="#fff" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">BUKTI TRANSFER</text>
    <text x="20" y="72" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="11">STATUS</text>
    <text x="20" y="91" fill="#111827" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">Transfer berhasil</text>
    <text x="20" y="120" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="11">TUJUAN</text>
    <text x="20" y="139" fill="#111827" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="600">Volkswagen PIK</text>
    <text x="20" y="166" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="11">NOMINAL</text>
    <text x="300" y="168" textAnchor="end" fill={COLORS.vwBlue} fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700">Rp2.580.750</text>
    <path d="m262 75 8 8 17-19" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- Kartu 1: Payment details ----------
export const PaymentDetailsCard: React.FC<{ shadow?: string; highlight?: number }> = ({ shadow, highlight = 0 }) => (
  <SoftCard height={DETAILS_H} shadow={shadow}>
    <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 700 }}>Payment details</div>
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, fontSize: 14, lineHeight: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ color: GREY }}>Invoice number</span>
        <span style={{ fontWeight: 600 }}>{PAYMENT_DATA.invoiceNumber}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ color: GREY }}>Bill to</span>
        <span style={{ fontWeight: 600 }}>{PAYMENT_DATA.billTo}</span>
      </div>
    </div>
    <Divider />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 700 }}>Amount due</span>
      <span style={{ display: "inline-block", transform: `scale(${1 + highlight * 0.08})`, transformOrigin: "100% 50%" }}>
        <Rupiah value={PAYMENT_DATA.amountDue} style={{ fontSize: 24, lineHeight: "32px", fontWeight: 700, color: COLORS.vwBlue }} />
      </span>
    </div>
    <div style={{ marginTop: 8, fontSize: 12, lineHeight: "16px", color: GREY }}>Please follow the amount stated on your invoice.</div>
  </SoftCard>
);

// ---------- Kartu 2: rekening bank ----------
const CopyButton: React.FC<{ press: number; ripple: number; copied: boolean }> = ({ press, ripple, copied }) => (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      height: 44,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 16px",
      borderRadius: 999,
      background: copied ? "rgba(46,125,50,0.1)" : "#FFFFFF",
      boxShadow: `inset 0 0 0 1px ${copied ? "rgba(46,125,50,0.5)" : "rgba(118,118,118,0.3)"}`,
      color: copied ? GREEN : G900,
      fontSize: 13,
      fontWeight: 600,
      transform: `scale(${1 - 0.06 * press})`,
    }}
  >
    <Ripple progress={ripple} color="rgba(22,30,89,0.16)" max={110} />
    {copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
    {copied ? "Copied" : "Copy"}
  </div>
);

export const BankAccountsCard: React.FC<{
  shadow?: string;
  copyPress?: number;
  copyRipple?: number;
  copied?: boolean;
}> = ({ shadow, copyPress = 0, copyRipple = 0, copied = false }) => (
  <SoftCard height={BANK_H} shadow={shadow}>
    {ACCOUNTS.map((account, index) => (
      <div key={account.bank}>
        {index > 0 ? <Divider /> : null}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 56, height: 44, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 12, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
            <Img src={staticFile(account.logo)} style={{ maxWidth: 46, maxHeight: 34, objectFit: "contain" }} onError={() => undefined} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, lineHeight: "20px", fontWeight: 700, color: G900 }}>{account.bank}</div>
            <div style={{ fontSize: 12, lineHeight: "16px", color: GREY }}>Account name</div>
            <div style={{ fontSize: 14, lineHeight: "20px", fontWeight: 600, color: G900 }}>{account.holder}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, lineHeight: "16px", color: GREY }}>Account number</div>
            <div style={{ marginTop: 0, fontSize: 20, lineHeight: "28px", fontWeight: 700, letterSpacing: 0.5, fontVariantNumeric: "tabular-nums", color: G900 }}>{account.number}</div>
          </div>
          {index === 0 ? <CopyButton press={copyPress} ripple={copyRipple} copied={copied} /> : <CopyButton press={0} ripple={0} copied={false} />}
        </div>
      </div>
    ))}
  </SoftCard>
);

// ---------- Kartu 3: Payment receipt ----------
export type ReceiptProps = {
  state: PaymentUploadState;
  uploadProgress: number;
  /** 0..1: gambar bukti transfer terbang masuk ke kolom upload. */
  fly: number;
  fileProgress: number;
  uploadPress: number;
  uploadRipple: number;
  successProgress: number;
  spinnerAngle: number;
};

const FlyingProof: React.FC<{ fly: number }> = ({ fly }) => {
  if (fly <= 0 || fly >= 1) return null;
  const e = 1 - fly;
  return (
    <div
      style={{
        position: "absolute",
        left: THUMB_LEFT,
        top: THUMB_TOP,
        width: THUMB_W,
        height: THUMB_H,
        zIndex: 5,
        overflow: "hidden",
        borderRadius: 10,
        opacity: Math.min(1, fly * 4),
        transform: `translate(${e * 210}px, ${e * 250}px) rotate(${e * 9}deg) scale(${1 + e * 0.45})`,
        transformOrigin: "50% 50%",
        boxShadow: `0 ${6 + e * 26}px ${14 + e * 40}px -${6}px rgba(22,27,89,${0.18 + e * 0.22})`,
      }}
    >
      <PaymentProofIllustration />
    </div>
  );
};

export const PaymentReceiptCard: React.FC<{ shadow?: string } & ReceiptProps> = ({
  shadow,
  state,
  uploadProgress,
  fly,
  fileProgress,
  uploadPress,
  uploadRipple,
  successProgress,
  spinnerAngle,
}) => {
  const success = state === "success";
  const hasFile = state === "file-selected" || state === "uploading";
  const dropActive = state === "empty" ? Math.max(0, (fly - 0.35) / 0.65) : 0;
  return (
    <SoftCard height={RECEIPT_H} shadow={shadow} style={{ overflow: "visible" }}>
      <div style={{ height: 24, fontSize: 14, lineHeight: "24px", fontWeight: 600, color: G900 }}>Payment receipt</div>
      {success ? (
        <>
          <div style={{ marginTop: 12, height: 40, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderRadius: 10, background: "rgba(46,125,50,0.1)", color: GREEN, fontSize: 13, fontWeight: 600, opacity: successProgress }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 * (1 - successProgress)} />
            </svg>
            Receipt uploaded · {PAYMENT_DATA.uploadedAt}
          </div>
          <div style={{ marginTop: 8, height: 60, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", borderRadius: 16, background: "#FFFFFF", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 10px 30px -16px rgba(22,27,89,0.22)", opacity: successProgress, transform: `translateY(${(1 - successProgress) * 10}px)` }}>
            <span style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#F2F2F2", color: COLORS.vwBlue }}>
              <FileImage size={20} />
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 14, lineHeight: "20px", fontWeight: 600, color: G900 }}>View your receipt</span>
              <span style={{ display: "block", fontSize: 12, lineHeight: "16px", color: GREY }}>Tap to view</span>
            </span>
            <ChevronRight size={18} color={COLORS.vwBlue} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, lineHeight: "16px", color: GREY, opacity: successProgress }}>Wrong file? Upload a new one to replace it.</div>
          <div style={{ marginTop: 12, height: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 999, background: "rgba(118,118,118,0.2)", color: GREY, fontSize: 14, fontWeight: 600 }}>
            <Upload size={16} />
            Replace
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop: 4, height: 20, fontSize: 13, lineHeight: "20px", color: GREY }}>Upload your transfer proof.</div>
          <div
            style={{
              position: "relative",
              marginTop: 12,
              height: 96,
              padding: 12,
              borderRadius: 16,
              background: dropActive > 0 ? `rgba(22,30,89,${0.04 * dropActive})` : "#FFFFFF",
              border: hasFile ? "1px solid rgba(118,118,118,0.25)" : `1.5px dashed ${dropActive > 0 ? COLORS.vwBlue : "rgba(118,118,118,0.4)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: hasFile ? "flex-start" : "center",
              gap: 12,
            }}
          >
            {hasFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: fileProgress, minWidth: 0 }}>
                <span style={{ width: THUMB_W, height: THUMB_H, flexShrink: 0, display: "block", overflow: "hidden", borderRadius: 10, boxShadow: "0 2px 8px rgba(22,27,89,0.16)" }}>
                  <PaymentProofIllustration />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, lineHeight: "18px", fontWeight: 700, color: G800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{PAYMENT_DATA.fileName}</span>
                  <span style={{ display: "block", fontSize: 12, lineHeight: "16px", color: GREY }}>JPG · 1.2 MB</span>
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: G600 }}>
                <FileImage size={18} />
                Choose file · PDF, JPG, JPEG, PNG
              </div>
            )}
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              marginTop: 12,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderRadius: 999,
              background: hasFile ? COLORS.vwBlue : "rgba(118,118,118,0.2)",
              color: hasFile ? "#FFFFFF" : GREY,
              boxShadow: hasFile ? "0 6px 14px -4px rgba(22,30,89,0.25)" : "none",
              fontSize: 14,
              fontWeight: 600,
              opacity: state === "uploading" ? 0.85 : 1,
              transform: `scale(${1 - 0.05 * uploadPress})`,
            }}
          >
            <Ripple progress={uploadRipple} color="rgba(255,255,255,0.35)" max={170} />
            {state === "uploading" ? <LoaderCircle size={16} style={{ transform: `rotate(${spinnerAngle}deg)` }} /> : <Upload size={16} />}
            {state === "uploading" ? "Uploading..." : "Upload"}
          </div>
          {state === "uploading" ? (
            <div style={{ height: 6, overflow: "hidden", marginTop: 10, borderRadius: 99, background: "#E5E7EB" }}>
              <div style={{ width: `${uploadProgress}%`, height: "100%", borderRadius: 99, background: COLORS.vwBlue }} />
            </div>
          ) : null}
        </>
      )}
      <FlyingProof fly={fly} />
    </SoftCard>
  );
};

// ---------- Halaman ----------
export type PaymentUploadMockProps = {
  scrollY: number;
  /** Kartu yang sedang melayang sebagai overlay: disembunyikan di halaman. */
  hidden: "details" | "bank" | "receipt" | null;
  amountHighlight: number;
  copyPress: number;
  copyRipple: number;
  copied: boolean;
  receipt: ReceiptProps;
};

export const PaymentUploadMock: React.FC<PaymentUploadMockProps> = ({
  scrollY,
  hidden,
  amountHighlight,
  copyPress,
  copyRipple,
  copied,
  receipt,
}) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#FFFFFF", fontFamily, color: G900 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: 1400, translate: `0 ${-scrollY}px` }}>
      <div style={{ position: "absolute", left: SIDE, right: SIDE, top: HEADER_Y }}>
        <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 700, color: G900 }}>Payment</div>
        <div style={{ marginTop: 4, fontSize: 13, lineHeight: "18px", color: GREY }}>Transfer to one of the accounts below, then upload your receipt.</div>
      </div>

      <div style={{ position: "absolute", left: SIDE, top: DETAILS_Y, opacity: hidden === "details" ? 0 : 1 }}>
        <PaymentDetailsCard highlight={amountHighlight} />
      </div>
      <div style={{ position: "absolute", left: SIDE, top: BANK_Y, opacity: hidden === "bank" ? 0 : 1 }}>
        <BankAccountsCard copyPress={copyPress} copyRipple={copyRipple} copied={copied} />
      </div>
      <div style={{ position: "absolute", left: SIDE, top: RECEIPT_Y, opacity: hidden === "receipt" ? 0 : 1 }}>
        <PaymentReceiptCard {...receipt} />
      </div>
    </div>

    {/* Strip putih di bawah kamera (konten tidak boleh tertutup notch) */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: COVER_H, background: "#FFFFFF", zIndex: 30 }} />
  </div>
);
