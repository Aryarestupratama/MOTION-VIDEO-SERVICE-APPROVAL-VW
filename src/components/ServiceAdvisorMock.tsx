import React from "react";
import { MessageCircle } from "lucide-react";
import { COLORS, fontFamily } from "../theme";

export const SERVICE_ADVISOR_DEMO = {
  name: "Rizky Aditya",
  initials: "RA",
  role: "Service Advisor",
  description: "If you would like your Service Advisor to contact you, please click the button below.",
  actionLabel: "Send Message",
  messageLabel: "WhatsApp · Pesan baru",
  message: "Halo, ada yang bisa kami bantu?",
} as const;

type ServiceAdvisorMockProps = {
  cardOpacity: number;
  cardTranslateY: number;
  buttonPressProgress: number;
  rippleProgress: number;
  pulseScale: number;
  pulseOpacity: number;
  chatOpacity: number;
  chatTranslateY: number;
  chatScale: number;
};

export const ServiceAdvisorMock: React.FC<ServiceAdvisorMockProps> = ({
  cardOpacity,
  cardTranslateY,
  buttonPressProgress,
  rippleProgress,
  pulseScale,
  pulseOpacity,
  chatOpacity,
  chatTranslateY,
  chatScale,
}) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", padding: "34px 15px", boxSizing: "border-box", background: "#F8F9FC", color: "#111827", fontFamily }}>
    <div style={{ width: "100%", maxWidth: 390, opacity: cardOpacity, translate: `0 ${cardTranslateY}px` }}>
      <div style={{ padding: 16, borderRadius: 24, background: COLORS.white, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 12px 40px -16px rgba(22,27,89,0.22)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: COLORS.vwBlue, color: COLORS.white, fontSize: 11, fontWeight: 700 }} aria-label={`Avatar ${SERVICE_ADVISOR_DEMO.initials}`}>
            {SERVICE_ADVISOR_DEMO.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ overflow: "hidden", color: "#111827", fontSize: 14, lineHeight: "20px", fontWeight: 700, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{SERVICE_ADVISOR_DEMO.name}</div>
            <div style={{ overflow: "hidden", color: "#6B7280", fontSize: 12, lineHeight: "16px", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{SERVICE_ADVISOR_DEMO.role}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <p style={{ margin: 0, color: "#4B5563", fontSize: 12, lineHeight: "17px" }}>{SERVICE_ADVISOR_DEMO.description}</p>
          <div style={{ position: "relative", marginTop: 12 }}>
            <div aria-hidden="true" style={{ position: "absolute", inset: -7, borderRadius: 18, border: `2px solid rgba(37,211,102,${pulseOpacity})`, scale: pulseScale, opacity: pulseOpacity, pointerEvents: "none" }} />
            <div style={{ position: "relative", overflow: "hidden", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, background: COLORS.vwBlue, color: COLORS.white, fontSize: 14, fontWeight: 600, boxShadow: "0 5px 14px rgba(22,30,89,0.2)", scale: 1 - buttonPressProgress * 0.05 }}>
              {rippleProgress > 0 && rippleProgress < 1 && <span aria-hidden="true" style={{ position: "absolute", width: 14 + rippleProgress * 110, height: 14 + rippleProgress * 110, borderRadius: "50%", background: "rgba(255,255,255,0.3)", opacity: 1 - rippleProgress, pointerEvents: "none" }} />}
              <MessageCircle size={16} strokeWidth={2.2} />{SERVICE_ADVISOR_DEMO.actionLabel}
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "fit-content", maxWidth: "88%", marginTop: 18, padding: "12px 15px", borderRadius: "18px 18px 18px 5px", background: COLORS.white, boxShadow: "0 8px 24px rgba(10,20,45,0.14)", opacity: chatOpacity, translate: `0 ${chatTranslateY}px`, scale: chatScale, transformOrigin: "left top" }}>
        <div style={{ marginBottom: 4, color: COLORS.approved, fontSize: 10, lineHeight: "14px", fontWeight: 700 }}>{SERVICE_ADVISOR_DEMO.messageLabel}</div>
        <div style={{ color: "#1F2937", fontSize: 13, lineHeight: "18px" }}>{SERVICE_ADVISOR_DEMO.message}</div>
      </div>
    </div>
  </div>
);

