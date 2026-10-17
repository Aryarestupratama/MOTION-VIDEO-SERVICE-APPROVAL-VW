import React from "react";
import { ChevronRight, CircleCheck, FileText, Phone } from "lucide-react";
import { COLORS, fontFamily } from "../theme";
import { CARD_W, SA_H, SCREEN_H, SCREEN_W, SIDE, ServiceAdvisorCard, WhatsAppIcon, WorkshopCard } from "./ServiceAdvisorMock";
import type { ChatContent } from "./WhatsAppChatMock";

// Layar HP untuk scene Booking. Susunan mengikuti InspectionReport.jsx asli saat status
// "completed": Invoice form, kotak "Thank You!" + tombol ERA + "Book your next service",
// lalu kartu Contact SA dan Workshop location.
// Catatan: tombol booking di web asli hanya membuka wa.me tanpa teks, jadi template pesan
// di bawah ini dibuat khusus untuk video.

export const BOOKING_DEMO = {
  workshop: "Volkswagen PIK",
  actionTitle: "Book your next service",
  actionSub: "Chat with us on WhatsApp",
  eraTitle: "Emergency Road Assist (ERA)",
  eraPhone: "0800 000 0000",
  invoiceNumber: "INV-VW-2026-0412",
  customerName: "Dina Pratama",
  captionLines: ["Booking Servis,", "Mudah dan Cepat"],
} as const;

export const BOOKING_CHAT: ChatContent = {
  name: "Admin VW PIK",
  initials: "VP",
  sentTime: "14.36",
  message:
    "Halo Admin VW PIK, saya Dina Pratama. Saya ingin booking service berikutnya untuk kendaraan saya (No. WO sebelumnya: VWPIK-2026-0042). Mohon info jadwal yang tersedia. Terima kasih.",
  reply:
    "Halo Kak Dina, terima kasih sudah menghubungi VW PIK. Baik, kami buatkan appointment-nya sekarang ya. Mohon ditunggu konfirmasi jadwalnya.",
};

// ---------- Geometri (koordinat layar HP, lebar 390) ----------
export const INVOICE_Y = 62;
export const GROUP_Y = 194;
const THANK_H = 184;
const ACTION_H = 72;
export const GROUP_GAP = 12;
export const GROUP_H = THANK_H + 16 + ACTION_H + GROUP_GAP + ACTION_H; // 356
export { CARD_W as GROUP_W };

const G900 = "#111827";
const G700 = "#374151";
const GREY = "#767676";
const PAGE_BG = "#F8F9FC";
const CARD_SHADOW = "0 12px 40px -16px rgba(22,27,89,0.22)";

const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  sub: string;
  press?: number;
  ripple?: number;
  pulseScale?: number;
  pulseOpacity?: number;
}> = ({ icon, title, sub, press = 0, ripple = 0, pulseScale = 1, pulseOpacity = 0 }) => (
  <div style={{ position: "relative", height: ACTION_H }}>
    {pulseOpacity > 0 ? (
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: -7, borderRadius: 31, border: `2px solid rgba(37,211,102,${pulseOpacity})`, scale: pulseScale, opacity: pulseOpacity, pointerEvents: "none" }}
      />
    ) : null}
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: ACTION_H,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        borderRadius: 24,
        background: COLORS.vwBlue,
        color: COLORS.white,
        boxShadow: "0 6px 16px -4px rgba(22,30,89,0.25)",
        scale: 1 - press * 0.04,
      }}
    >
      {ripple > 0 && ripple < 1 ? (
        <span
          aria-hidden="true"
          style={{ position: "absolute", left: "50%", top: "50%", width: 14 + ripple * 420, height: 14 + ripple * 420, marginLeft: -(14 + ripple * 420) / 2, marginTop: -(14 + ripple * 420) / 2, borderRadius: "50%", background: "rgba(255,255,255,0.22)", opacity: 1 - ripple, pointerEvents: "none" }}
        />
      ) : null}
      <span style={{ width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }}>{icon}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, lineHeight: "20px", fontWeight: 600 }}>{title}</span>
        <span style={{ display: "block", fontSize: 12, lineHeight: "16px", color: "rgba(255,255,255,0.8)" }}>{sub}</span>
      </span>
    </div>
  </div>
);

/** Kotak "Thank You!" + ERA + "Book your next service" (satu kesatuan yang melayang di scene). */
export const ThankYouGroup: React.FC<{
  shadow?: string;
  buttonPressProgress?: number;
  rippleProgress?: number;
  pulseScale?: number;
  pulseOpacity?: number;
}> = ({ shadow, buttonPressProgress = 0, rippleProgress = 0, pulseScale = 1, pulseOpacity = 0 }) => (
  <div style={{ width: CARD_W, height: GROUP_H, fontFamily, color: G900, boxSizing: "border-box" }}>
    <div
      style={{
        height: THANK_H,
        boxSizing: "border-box",
        padding: 20,
        borderRadius: 24,
        background: COLORS.white,
        boxShadow: `0 0 0 1px rgba(0,0,0,0.04), ${shadow ?? CARD_SHADOW}`,
        textAlign: "center",
      }}
    >
      <span style={{ width: 44, height: 44, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(46,125,50,0.1)", color: COLORS.approved }}>
        <CircleCheck size={20} />
      </span>
      <div style={{ marginTop: 12, fontSize: 16, lineHeight: "24px", fontWeight: 700 }}>Thank You!</div>
      <div style={{ marginTop: 4, fontSize: 14, lineHeight: "20px", color: G700 }}>
        Thank you for trusting {BOOKING_DEMO.workshop} with your vehicle service. We hope to see you again soon.
      </div>
    </div>
    <div style={{ marginTop: 16 }}>
      <ActionButton icon={<Phone size={16} />} title={BOOKING_DEMO.eraTitle} sub={BOOKING_DEMO.eraPhone} />
    </div>
    <div style={{ marginTop: GROUP_GAP }}>
      <ActionButton
        icon={<WhatsAppIcon size={20} />}
        title={BOOKING_DEMO.actionTitle}
        sub={BOOKING_DEMO.actionSub}
        press={buttonPressProgress}
        ripple={rippleProgress}
        pulseScale={pulseScale}
        pulseOpacity={pulseOpacity}
      />
    </div>
  </div>
);

const InvoiceBlock: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: SIDE, top: INVOICE_Y, fontSize: 16, lineHeight: "24px", fontWeight: 700, color: G900 }}>Invoice form</div>
    <div
      style={{
        position: "absolute",
        left: SIDE,
        top: INVOICE_Y + 36,
        width: CARD_W,
        height: 72,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 24,
        background: COLORS.white,
        boxShadow: `0 0 0 1px rgba(0,0,0,0.04), ${CARD_SHADOW}`,
      }}
    >
      <span style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#F2F2F2", color: COLORS.vwBlue }}>
        <FileText size={20} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, lineHeight: "20px", fontWeight: 600, color: G900 }}>View Invoice</span>
        <span style={{ display: "block", fontSize: 12, lineHeight: "16px", color: GREY, whiteSpace: "nowrap" }}>No. {BOOKING_DEMO.invoiceNumber} · PDF</span>
      </span>
      <ChevronRight size={16} color={COLORS.vwBlue} />
    </div>
  </>
);

type BookingPageMockProps = {
  /** Sembunyikan grup Thank You di halaman saat versi "melayang" sedang tampil. */
  hideGroup?: boolean;
  buttonPressProgress?: number;
  rippleProgress?: number;
  pulseScale?: number;
  pulseOpacity?: number;
};

export const BookingPageMock: React.FC<BookingPageMockProps> = ({
  hideGroup = false,
  buttonPressProgress = 0,
  rippleProgress = 0,
  pulseScale = 1,
  pulseOpacity = 0,
}) => {
  const saTop = GROUP_Y + GROUP_H + 24;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: SCREEN_H, overflow: "hidden", background: PAGE_BG, fontFamily }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: 44, background: PAGE_BG, zIndex: 3 }} />
      <InvoiceBlock />
      <div style={{ position: "absolute", left: SIDE, top: GROUP_Y, opacity: hideGroup ? 0 : 1 }}>
        <ThankYouGroup
          buttonPressProgress={buttonPressProgress}
          rippleProgress={rippleProgress}
          pulseScale={pulseScale}
          pulseOpacity={pulseOpacity}
        />
      </div>
      <div style={{ position: "absolute", left: SIDE, top: saTop }}>
        <ServiceAdvisorCard />
      </div>
      <WorkshopCard top={saTop + SA_H + 24} />
    </div>
  );
};
