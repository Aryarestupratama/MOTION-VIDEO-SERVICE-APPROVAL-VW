import React from "react";
import { Copy, FileImage, LoaderCircle, Upload } from "lucide-react";
import { Img, staticFile } from "remotion";
import { COLORS, fontFamily } from "../theme";

export type PaymentUploadState = "empty" | "file-selected" | "uploading" | "success";

export const DEMO_PAYMENT_DATA = {
  invoiceNumber: "INV-VWPIK-DEMO-042",
  billTo: "Pelanggan Demo",
  amountDue: 2580750,
  fileName: "bukti-transfer-demo.jpg",
  uploadedAt: "16 Okt 2026, 14.32",
} as const;

const ACCOUNT_DATA = [
  { bank: "Bank Central Asia", holder: "Volkswagen PIK (Demo)", number: "123 456 7890", logo: "images/banks-bca.png" },
  { bank: "Bank Mandiri", holder: "Volkswagen PIK (Demo)", number: "098 765 4321", logo: "images/banks-mandiri.png" },
] as const;

type PaymentUploadMockProps = {
  state: PaymentUploadState;
  uploadProgress: number;
  fileProgress: number;
  selectRippleProgress: number;
  uploadPressProgress: number;
  uploadRippleProgress: number;
  successProgress: number;
  contentScrollY: number;
};

const SoftCard: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
  <div style={{ borderRadius: 24, background: COLORS.white, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 12px 40px -16px rgba(22,27,89,0.22)", ...style }}>
    {children}
  </div>
);

const PaymentProofIllustration: React.FC<{ checkProgress: number }> = ({ checkProgress }) => (
  <svg viewBox="0 0 320 190" width="100%" height="100%" role="img" aria-label="Ilustrasi bukti transfer dummy">
    <rect x="1" y="1" width="318" height="188" rx="16" fill="#fff" stroke="#d8dce8" strokeWidth="2" />
    <rect x="1" y="1" width="318" height="42" rx="16" fill={COLORS.vwBlue} />
    <path d="M1 28h318v15H1z" fill={COLORS.vwBlue} />
    <circle cx="25" cy="22" r="11" fill="#fff" opacity=".95" />
    <path d="M19 22h12M25 16v12" stroke={COLORS.vwBlue} strokeWidth="2.5" strokeLinecap="round" />
    <text x="45" y="27" fill="#fff" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">BUKTI TRANSFER · DEMO</text>
    <text x="20" y="69" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="11">STATUS</text>
    <text x="20" y="88" fill="#111827" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">Transfer berhasil</text>
    <text x="20" y="117" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="11">TUJUAN</text>
    <text x="20" y="136" fill="#111827" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="600">Volkswagen PIK (Demo)</text>
    <text x="20" y="164" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="11">NOMINAL</text>
    <text x="300" y="165" textAnchor="end" fill={COLORS.vwBlue} fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700">Rp2.580.750</text>
    {checkProgress > 0 && <path d="m260 72 8 8 17-19" fill="none" stroke={COLORS.approved} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="38" strokeDashoffset={38 * (1 - checkProgress)} />}
  </svg>
);

export const PaymentUploadMock: React.FC<PaymentUploadMockProps> = ({
  state,
  uploadProgress,
  fileProgress,
  selectRippleProgress,
  uploadPressProgress,
  uploadRippleProgress,
  successProgress,
  contentScrollY,
}) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#F8F9FC", color: "#111827", fontFamily }}>
    <div style={{ height: 72, boxSizing: "border-box", padding: "23px 20px 12px", background: "#FFFFFF", borderBottom: "1px solid rgba(75,85,99,0.12)" }}>
      <div style={{ color: COLORS.vwBlue, fontSize: 19, lineHeight: "24px", fontWeight: 700 }}>Invoice &amp; payment</div>
      <div style={{ marginTop: 2, color: "#4B5563", fontSize: 11 }}>Volkswagen PIK · Customer portal</div>
    </div>

    <div style={{ position: "absolute", inset: "72px 0 0", overflow: "hidden", padding: "14px 14px 20px", boxSizing: "border-box" }}>
      <div style={{ transform: `translateY(${contentScrollY}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#111827", fontSize: 16, fontWeight: 700 }}>Payment</span>
      </div>
      <p style={{ margin: "5px 0 0", color: "#6B7280", fontSize: 11, lineHeight: "16px" }}>Transfer to one of the accounts below, then upload your receipt.</p>

      <SoftCard style={{ marginTop: 12, padding: 14 }}>
        <div style={{ color: "#111827", fontSize: 13, fontWeight: 700 }}>Payment details</div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 8, fontSize: 10 }}><span style={{ color: "#6B7280" }}>Invoice number</span><b>{DEMO_PAYMENT_DATA.invoiceNumber}</b></div>
        <div style={{ marginTop: 7, display: "flex", justifyContent: "space-between", gap: 8, fontSize: 10 }}><span style={{ color: "#6B7280" }}>Bill to</span><b>{DEMO_PAYMENT_DATA.billTo}</b></div>
        <div style={{ margin: "11px 0", borderTop: "1px dashed rgba(75,85,99,0.3)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, fontWeight: 700 }}>Amount due</span><span style={{ color: COLORS.vwBlue, fontSize: 17, fontWeight: 700 }}>Rp2.580.750</span></div>
        <p style={{ margin: "5px 0 0", color: "#6B7280", fontSize: 9 }}>Please follow the amount stated on your invoice.</p>
      </SoftCard>

      <SoftCard style={{ marginTop: 10, padding: "5px 14px" }}>
        {ACCOUNT_DATA.map((account, index) => (
          <div key={account.bank} style={{ padding: "10px 0", borderBottom: index === 0 ? "1px dashed rgba(75,85,99,0.3)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 52, height: 40, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
                <Img src={staticFile(account.logo)} style={{ maxWidth: 44, maxHeight: 32, objectFit: "contain" }} onError={() => undefined} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#111827", fontSize: 11, fontWeight: 700 }}>{account.bank}</div>
                <div style={{ marginTop: 2, color: "#6B7280", fontSize: 9 }}>Account name</div>
                <div style={{ color: "#111827", fontSize: 10, fontWeight: 600 }}>{account.holder}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <div><div style={{ color: "#6B7280", fontSize: 9 }}>Account number</div><div style={{ marginTop: 2, color: "#111827", fontSize: 16, fontWeight: 700, letterSpacing: 0.4 }}>{account.number}</div></div>
              <div style={{ minHeight: 32, display: "flex", alignItems: "center", gap: 4, padding: "0 10px", borderRadius: 999, color: "#111827", background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(75,85,99,0.3)", fontSize: 9, fontWeight: 600 }}><Copy size={12} />Copy</div>
            </div>
          </div>
        ))}
      </SoftCard>

      <SoftCard style={{ position: "relative", overflow: "hidden", marginTop: 10, padding: 14 }}>
        <div style={{ color: "#111827", fontSize: 12, fontWeight: 600 }}>Payment receipt</div>
        {state === "success" ? (
          <div style={{ marginTop: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: 9, background: "rgba(46,125,50,0.1)", color: COLORS.approved, fontSize: 10, fontWeight: 600, opacity: successProgress }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 * (1 - successProgress)} /></svg>Receipt uploaded · {DEMO_PAYMENT_DATA.uploadedAt}
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 9, padding: 9, borderRadius: 18, background: "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 10px 30px -16px rgba(22,27,89,0.22)" }}>
              <span style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "#F2F2F2", color: COLORS.vwBlue }}><FileImage size={18} /></span>
              <span><b style={{ display: "block", fontSize: 10 }}>View your receipt</b><small style={{ color: "#6B7280", fontSize: 9 }}>Tap to view</small></span>
              <span style={{ marginLeft: "auto", color: COLORS.vwBlue, fontSize: 16 }}>›</span>
            </div>
            <p style={{ margin: "7px 0 0", color: "#6B7280", fontSize: 9 }}>Wrong file? Upload a new one to replace it.</p>
          </div>
        ) : (
          <>
            <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 10 }}>Upload your transfer proof.</p>
            <div style={{ position: "relative", overflow: "hidden", minHeight: state === "file-selected" || state === "uploading" ? 126 : 43, marginTop: 9, padding: 8, borderRadius: 12, border: "1px solid rgba(75,85,99,0.2)", background: "#FFFFFF", boxSizing: "border-box" }}>
              {selectRippleProgress > 0 && selectRippleProgress < 1 && <span style={{ position: "absolute", top: 12, left: 24, width: 14 + selectRippleProgress * 150, height: 14 + selectRippleProgress * 150, borderRadius: "50%", background: "rgba(22,30,89,0.12)", opacity: 1 - selectRippleProgress, pointerEvents: "none" }} />}
              {state === "empty" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 27, color: "#6B7280", fontSize: 9 }}><FileImage size={15} />Choose file · PDF, JPG, JPEG, PNG</div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: fileProgress, translate: `0 ${(1 - fileProgress) * 28}px` }}>
                  <span style={{ width: 106, height: 90, flexShrink: 0, display: "block", overflow: "hidden", borderRadius: 9, boxShadow: "0 2px 7px rgba(22,27,89,0.13)" }}><PaymentProofIllustration checkProgress={0} /></span>
                  <span style={{ minWidth: 0 }}><b style={{ display: "block", overflow: "hidden", color: "#1F2937", fontSize: 9, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{DEMO_PAYMENT_DATA.fileName}</b><small style={{ color: "#6B7280", fontSize: 8 }}>JPG · 1.2 MB · Preview</small></span>
                </div>
              )}
            </div>
            <div style={{ position: "relative", overflow: "hidden", height: 42, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 999, background: state === "empty" ? "rgba(75,85,99,0.14)" : COLORS.vwBlue, color: state === "empty" ? "#6B7280" : "#FFFFFF", fontSize: 11, fontWeight: 700, transform: `scale(${1 - 0.05 * uploadPressProgress})`, boxShadow: state === "empty" ? "none" : "0 3px 8px rgba(22,30,89,0.18)" }}>
              {uploadRippleProgress > 0 && uploadRippleProgress < 1 && <span style={{ position: "absolute", width: 14 + uploadRippleProgress * 120, height: 14 + uploadRippleProgress * 120, borderRadius: "50%", background: "rgba(255,255,255,0.35)", opacity: 1 - uploadRippleProgress, pointerEvents: "none" }} />}
              {state === "uploading" ? <LoaderCircle size={15} /> : <Upload size={14} />}{state === "uploading" ? "Uploading..." : "Upload"}
            </div>
            {state === "uploading" && <div style={{ height: 7, overflow: "hidden", marginTop: 8, borderRadius: 99, background: "#E5E7EB" }}><div style={{ width: `${uploadProgress}%`, height: "100%", borderRadius: 99, background: COLORS.vwBlue }} /></div>}
          </>
        )}
      </SoftCard>
      </div>
    </div>
  </div>
);

