import React from "react";
import { Clock, Globe, MapPin, MessageCircle } from "lucide-react";
import { COLORS, fontFamily } from "../theme";

// Layar HP untuk scene Contact Advisor. Susunan dan label mengikuti
// InspectionReport.jsx asli: Estimation form, kartu Contact SA, Workshop location.
// Semua inline style. Kartu SA dibuat sebagai komponen terpisah supaya scene
// bisa menampilkannya lagi sebagai overlay "melayang" di tengah layar.

export const SERVICE_ADVISOR_DEMO = {
  name: "Rizky Aditya",
  firstName: "Rizky",
  initials: "RA",
  role: "Service Advisor",
  description: "If you would like your Service Advisor to contact you, please click the button below.",
  actionLabel: "Send Message",
  customerName: "Dina Pratama",
  customerFirstName: "Dina",
  workOrder: "VWPIK-2026-0042",
  // Sama dengan saMessage di InspectionReport.jsx (nama customer dan No. WO terisi).
  message:
    "Halo, saya Dina Pratama. Mohon dihubungi oleh Service Advisor karena saya ingin berdiskusi lebih lanjut mengenai estimasi dan kendaraan saya (No. WO: VWPIK-2026-0042). Terima kasih.",
  reply: "Halo Kak Dina, terima kasih sudah menghubungi kami. Ada yang bisa saya bantu? Saya telepon sekarang ya.",
  sentTime: "14.36",
  callCaptionLines: ["Service Advisor akan", "menghubungi Anda secepatnya"],
} as const;

// ---------- Geometri (koordinat layar HP, lebar 390) ----------
export const SCREEN_W = 390;
export const SCREEN_H = 1032;
export const SIDE = 16;
export const CARD_W = SCREEN_W - SIDE * 2;
export const SA_Y = 204;
export const SA_H = 190;

const G900 = "#111827";
const G600 = "#4B5563";
const GREY = "#767676";
const PAGE_BG = "#F8F9FC";
const CARD_SHADOW = "0 12px 40px -16px rgba(22,27,89,0.22)";
const RESET: React.CSSProperties = { margin: 0, padding: 0, boxSizing: "border-box" };

export const WhatsAppIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21l1.65-4.9A9 9 0 1 1 8 19.4L3 21z" />
    <g transform="translate(6.6 6.6) scale(0.45)" strokeWidth={3.6}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </g>
  </svg>
);

// ---------- Kartu Contact SA ----------
type ServiceAdvisorCardProps = {
  shadow?: string;
  buttonPressProgress?: number;
  rippleProgress?: number;
  pulseScale?: number;
  pulseOpacity?: number;
};

export const ServiceAdvisorCard: React.FC<ServiceAdvisorCardProps> = ({
  shadow,
  buttonPressProgress = 0,
  rippleProgress = 0,
  pulseScale = 1,
  pulseOpacity = 0,
}) => (
  <div
    style={{
      ...RESET,
      position: "relative",
      width: CARD_W,
      height: SA_H,
      padding: 16,
      borderRadius: 24,
      background: COLORS.white,
      boxShadow: `0 0 0 1px rgba(0,0,0,0.04), ${shadow ?? CARD_SHADOW}`,
      fontFamily,
      color: G900,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: COLORS.vwBlue, color: COLORS.white, fontSize: 12, fontWeight: 700 }}
        aria-label={`Avatar ${SERVICE_ADVISOR_DEMO.initials}`}
      >
        {SERVICE_ADVISOR_DEMO.initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: G900, fontSize: 14, lineHeight: "20px", fontWeight: 700, whiteSpace: "nowrap" }}>{SERVICE_ADVISOR_DEMO.name}</div>
        <div style={{ color: GREY, fontSize: 12, lineHeight: "16px", whiteSpace: "nowrap" }}>{SERVICE_ADVISOR_DEMO.role}</div>
      </div>
    </div>
    <div style={{ marginTop: 16 }}>
      <p style={{ margin: 0, color: G600, fontSize: 12, lineHeight: "17px" }}>{SERVICE_ADVISOR_DEMO.description}</p>
      <div style={{ position: "relative", marginTop: 12 }}>
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: -7, borderRadius: 18, border: `2px solid rgba(37,211,102,${pulseOpacity})`, scale: pulseScale, opacity: pulseOpacity, pointerEvents: "none" }}
        />
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            borderRadius: 12,
            background: COLORS.vwBlue,
            color: COLORS.white,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 5px 14px rgba(22,30,89,0.2)",
            scale: 1 - buttonPressProgress * 0.05,
          }}
        >
          {rippleProgress > 0 && rippleProgress < 1 ? (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                width: 14 + rippleProgress * 150,
                height: 14 + rippleProgress * 150,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                opacity: 1 - rippleProgress,
                pointerEvents: "none",
              }}
            />
          ) : null}
          <WhatsAppIcon size={16} />
          {SERVICE_ADVISOR_DEMO.actionLabel}
        </div>
      </div>
    </div>
  </div>
);

// ---------- Kartu pendukung (hanya latar halaman, mengikuti web asli) ----------
const EstimationPlaceholder: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: SIDE, top: 62, fontSize: 16, lineHeight: "24px", fontWeight: 700, color: G900 }}>Estimation form</div>
    <div
      style={{
        position: "absolute",
        left: SIDE,
        top: 98,
        width: CARD_W,
        height: 84,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        borderRadius: 20,
        border: "1.5px dashed rgba(118,118,118,0.4)",
        background: "rgba(255,255,255,0.6)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#F3F4F6", color: GREY }}>
        <Clock size={18} />
      </div>
      <div>
        <div style={{ fontSize: 13, lineHeight: "18px", fontWeight: 700, color: G900 }}>Estimation form is being prepared</div>
        <div style={{ fontSize: 11, lineHeight: "15px", color: GREY }}>It will appear here automatically once it's ready.</div>
      </div>
    </div>
  </>
);

const OutlineButton: React.FC<{ icon: React.ReactNode; label: string; height?: number; style?: React.CSSProperties }> = ({ icon, label, height = 40, style }) => (
  <div
    style={{
      flex: 1,
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 12,
      border: "1px solid rgba(118,118,118,0.35)",
      background: COLORS.white,
      color: G900,
      fontSize: 12,
      fontWeight: 600,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {icon}
    {label}
  </div>
);

export const WorkshopCard: React.FC<{ top: number }> = ({ top }) => (
  <div
    style={{
      ...RESET,
      position: "absolute",
      left: SIDE,
      top,
      width: CARD_W,
      padding: 18,
      borderRadius: 24,
      background: COLORS.white,
      boxShadow: `0 0 0 1px rgba(0,0,0,0.04), ${CARD_SHADOW}`,
      color: G900,
    }}
  >
    <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 700 }}>Workshop location</div>
    <div style={{ marginTop: 12, display: "flex", gap: 10, padding: 12, borderRadius: 16, background: "#F3F4F6" }}>
      <MapPin size={16} color={COLORS.vwBlue} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontSize: 11.5, lineHeight: "17px", fontWeight: 600, color: "#1F2937" }}>
        Jl. Pantai Indah Selatan A 1 ST, RT.001/RW.6, Kapuk Muara, Penjaringan, Jkt Utara, Daerah Khusus Ibukota Jakarta 14460
      </div>
    </div>
    <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
      <OutlineButton icon={<MapPin size={14} />} label="Open in Maps" />
      <OutlineButton icon={<Globe size={14} />} label="Visit Website" />
    </div>
    <div style={{ marginTop: 10, display: "flex" }}>
      <OutlineButton
        icon={<MessageCircle size={14} />}
        label="Book a service"
        height={44}
        style={{ border: `1.5px solid ${COLORS.vwBlue}`, color: COLORS.vwBlue, borderRadius: 14 }}
      />
    </div>
  </div>
);

// ---------- Layar halaman (di dalam HP) ----------
type ContactPageMockProps = {
  /** Sembunyikan kartu SA di halaman saat versi "melayang" sedang tampil. */
  hideCard?: boolean;
  buttonPressProgress?: number;
  rippleProgress?: number;
  pulseScale?: number;
  pulseOpacity?: number;
};

export const ContactPageMock: React.FC<ContactPageMockProps> = ({
  hideCard = false,
  buttonPressProgress = 0,
  rippleProgress = 0,
  pulseScale = 1,
  pulseOpacity = 0,
}) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: SCREEN_H, overflow: "hidden", background: PAGE_BG, fontFamily }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: 44, background: PAGE_BG, zIndex: 3 }} />
    <EstimationPlaceholder />
    <div style={{ position: "absolute", left: SIDE, top: SA_Y, opacity: hideCard ? 0 : 1 }}>
      <ServiceAdvisorCard
        buttonPressProgress={buttonPressProgress}
        rippleProgress={rippleProgress}
        pulseScale={pulseScale}
        pulseOpacity={pulseOpacity}
      />
    </div>
    <WorkshopCard top={SA_Y + SA_H + 24} />
  </div>
);
