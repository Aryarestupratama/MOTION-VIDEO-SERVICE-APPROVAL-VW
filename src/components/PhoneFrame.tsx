import React, { type CSSProperties, type ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      width: 418,
      height: 1060,
      boxSizing: "border-box",
      padding: 9,
      border: "5px solid #08090B",
      borderRadius: 62,
      backgroundColor: "#08090B",
      boxShadow: "0 42px 100px rgba(0,0,0,0.42), 0 12px 28px rgba(0,0,0,0.28)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 9,
        overflow: "hidden",
        borderRadius: 45,
        backgroundColor: "#F8F9FC",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {children}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
          borderRadius: 45,
          background:
            "linear-gradient(118deg, transparent 0%, rgba(255,255,255,0.17) 18%, rgba(255,255,255,0.04) 29%, transparent 43%, transparent 70%, rgba(255,255,255,0.07) 83%, transparent 100%)",
        }}
      />
    </div>

    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 5,
        top: 15,
        left: "50%",
        width: 112,
        height: 30,
        marginLeft: -56,
        borderRadius: 20,
        backgroundColor: "#050608",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08)",
      }}
    />

    <div aria-hidden="true" style={{ position: "absolute", left: -8, top: 196, width: 4, height: 72, borderRadius: 4, backgroundColor: "#24262A" }} />
    <div aria-hidden="true" style={{ position: "absolute", left: -8, top: 290, width: 4, height: 42, borderRadius: 4, backgroundColor: "#24262A" }} />
    <div aria-hidden="true" style={{ position: "absolute", right: -8, top: 240, width: 4, height: 92, borderRadius: 4, backgroundColor: "#24262A" }} />
  </div>
);
