import React from "react";
import {
  ArrowLeft,
  BatteryFull,
  Camera,
  Check,
  CheckCheck,
  EllipsisVertical,
  Lock,
  Mic,
  Paperclip,
  Phone,
  PhoneOff,
  SendHorizontal,
  Signal,
  Smile,
  Video,
  Wifi,
} from "lucide-react";
import { COLORS, fontFamily } from "../theme";
import { SERVICE_ADVISOR_DEMO } from "./ServiceAdvisorMock";

// Mockup WhatsApp untuk scene Contact Advisor. Dua bagian:
// 1) WhatsAppChatMock: layar chat, lebar logis 390 (scene yang men-scale ke lebar video)
// 2) CallScreen: layar panggilan masuk, digambar langsung dalam piksel video 1080 x 1920.
// Semua inline style, tanpa animasi sendiri: semua nilai datang dari scene (dari frame).

export const WA_WIDTH = 390;
const WA_GREEN = "#008069";
const WA_SEND = "#00A884";
const WA_BG = "#EFEAE2";
const WA_OUT = "#D9FDD3";
const WA_TICK_BLUE = "#53BDEB";
const WA_GREY = "#8696A0";
const TEXT = "#111B21";

/** Isi chat. Default = Service Advisor (scene Contact); scene lain bisa memakai kontak dan pesan sendiri. */
export type ChatContent = {
  name: string;
  initials: string;
  message: string;
  reply: string;
  sentTime: string;
};

const DEFAULT_CONTENT: ChatContent = {
  name: SERVICE_ADVISOR_DEMO.name,
  initials: SERVICE_ADVISOR_DEMO.initials,
  message: SERVICE_ADVISOR_DEMO.message,
  reply: SERVICE_ADVISOR_DEMO.reply,
  sentTime: SERVICE_ADVISOR_DEMO.sentTime,
};

export type WhatsAppChatProps = {
  content?: ChatContent;
  /** Tinggi layar dalam satuan logis (tinggi video / scale). */
  height: number;
  typedChars: number;
  caretOn: boolean;
  sendPress: number;
  /** 0 = bubble belum ada, 1 = bubble sudah di chat. */
  sentProgress: number;
  /** 0 = terkirim (satu centang), 1 = diterima (dua abu), 2 = dibaca (dua biru). */
  tickState: 0 | 1 | 2;
  headerTyping: boolean;
  dotsOpacity: number;
  frame: number;
  replyProgress: number;
};

const Tick: React.FC<{ state: 0 | 1 | 2 }> = ({ state }) =>
  state === 0 ? <Check size={15} color={WA_GREY} strokeWidth={2.4} /> : <CheckCheck size={15} color={state === 2 ? WA_TICK_BLUE : WA_GREY} strokeWidth={2.4} />;

const StatusBar: React.FC<{ time: string }> = ({ time }) => (
  <div style={{ height: 44, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 22px 6px", background: WA_GREEN, color: COLORS.white }}>
    <span style={{ fontSize: 14, fontWeight: 600 }}>{time}</span>
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Signal size={15} strokeWidth={2.4} />
      <Wifi size={15} strokeWidth={2.4} />
      <BatteryFull size={18} strokeWidth={2.2} />
    </span>
  </div>
);

const Header: React.FC<{ typing: boolean; name: string; initials: string }> = ({ typing, name, initials }) => (
  <div style={{ height: 60, display: "flex", alignItems: "center", gap: 10, padding: "0 12px 0 8px", background: WA_GREEN, color: COLORS.white }}>
    <ArrowLeft size={22} strokeWidth={2.4} />
    <div
      style={{ width: 38, height: 38, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: COLORS.vwBlue, color: COLORS.white, fontSize: 12, fontWeight: 700, boxShadow: "0 0 0 1.5px rgba(255,255,255,0.35)" }}
    >
      {initials}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15.5, lineHeight: "20px", fontWeight: 600, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontSize: 11.5, lineHeight: "15px", opacity: 0.85 }}>{typing ? "mengetik..." : "online"}</div>
    </div>
    <Video size={21} strokeWidth={2.2} />
    <Phone size={19} strokeWidth={2.2} style={{ marginLeft: 8 }} />
    <EllipsisVertical size={20} strokeWidth={2.2} />
  </div>
);

const Chip: React.FC<React.PropsWithChildren<{ bg: string; color?: string }>> = ({ bg, color = "#54656F", children }) => (
  <div
    style={{
      alignSelf: "center",
      maxWidth: 300,
      padding: "5px 12px",
      borderRadius: 8,
      background: bg,
      color,
      fontSize: 11.5,
      lineHeight: "16px",
      textAlign: "center",
      boxShadow: "0 1px 1px rgba(11,20,26,0.08)",
    }}
  >
    {children}
  </div>
);

const TypingDots: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, height: 18 }}>
    {[0, 1, 2].map((i) => {
      const wave = Math.sin((frame / 30) * Math.PI * 2 * 1.6 - i * 0.9);
      return (
        <span
          key={i}
          style={{ width: 7, height: 7, borderRadius: 999, background: WA_GREY, opacity: 0.55 + 0.45 * Math.max(0, wave), transform: `translateY(${-Math.max(0, wave) * 3}px)` }}
        />
      );
    })}
  </div>
);

export const WhatsAppChatMock: React.FC<WhatsAppChatProps> = ({
  content = DEFAULT_CONTENT,
  height,
  typedChars,
  caretOn,
  sendPress,
  sentProgress,
  tickState,
  headerTyping,
  dotsOpacity,
  frame,
  replyProgress,
}) => {
  const typed = content.message.slice(0, Math.max(0, Math.floor(typedChars)));
  const hasText = typed.length > 0;
  const bubbleIn = sentProgress;

  return (
    <div style={{ position: "relative", width: WA_WIDTH, height, display: "flex", flexDirection: "column", overflow: "hidden", background: WA_BG, fontFamily, color: TEXT }}>
      <StatusBar time={content.sentTime} />
      <Header typing={headerTyping} name={content.name} initials={content.initials} />

      {/* Area chat */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "14px 12px",
          background: `radial-gradient(circle at 12px 12px, rgba(11,20,26,0.045) 2px, transparent 2.5px) 0 0 / 28px 28px, ${WA_BG}`,
          overflow: "hidden",
        }}
      >
        <Chip bg="#FFFFFF">Hari ini</Chip>
        <Chip bg="#FFEECD" color="#54656F">
          <Lock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />
          Pesan dan panggilan dienkripsi secara end-to-end.
        </Chip>

        {bubbleIn > 0 ? (
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: "84%",
              padding: "7px 9px 5px 10px",
              borderRadius: "10px 2px 10px 10px",
              background: WA_OUT,
              boxShadow: "0 1px 1px rgba(11,20,26,0.13)",
              opacity: bubbleIn,
              transform: `translateY(${(1 - bubbleIn) * 70}px) scale(${0.94 + bubbleIn * 0.06})`,
              transformOrigin: "100% 100%",
            }}
          >
            <div style={{ fontSize: 14.5, lineHeight: "20px" }}>{content.message}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3, marginTop: 1, fontSize: 10.5, color: "#667781" }}>
              {content.sentTime}
              <Tick state={tickState} />
            </div>
          </div>
        ) : null}

        {dotsOpacity > 0 && replyProgress <= 0 ? (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: "2px 10px 10px 10px",
              background: COLORS.white,
              boxShadow: "0 1px 1px rgba(11,20,26,0.13)",
              opacity: dotsOpacity,
              transform: `translateY(${(1 - dotsOpacity) * 24}px)`,
            }}
          >
            <TypingDots frame={frame} />
          </div>
        ) : null}

        {replyProgress > 0 ? (
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "80%",
              padding: "7px 10px 5px 10px",
              borderRadius: "2px 10px 10px 10px",
              background: COLORS.white,
              boxShadow: "0 1px 1px rgba(11,20,26,0.13)",
              opacity: replyProgress,
              transform: `translateY(${(1 - replyProgress) * 40}px) scale(${0.94 + replyProgress * 0.06})`,
              transformOrigin: "0% 100%",
            }}
          >
            <div style={{ fontSize: 14.5, lineHeight: "20px" }}>{content.reply}</div>
            <div style={{ marginTop: 1, textAlign: "right", fontSize: 10.5, color: "#667781" }}>{content.sentTime}</div>
          </div>
        ) : null}
      </div>

      {/* Kolom ketik */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, padding: "6px 8px 26px", background: WA_BG }}>
        <div
          style={{
            flex: 1,
            minHeight: 46,
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            padding: "11px 12px",
            boxSizing: "border-box",
            borderRadius: 24,
            background: COLORS.white,
            boxShadow: "0 1px 1px rgba(11,20,26,0.1)",
          }}
        >
          <Smile size={22} color={WA_GREY} style={{ flexShrink: 0, marginBottom: 1 }} />
          <div style={{ flex: 1, minWidth: 0, fontSize: 14.5, lineHeight: "21px", wordBreak: "break-word" }}>
            {hasText ? (
              <>
                {typed}
                <span style={{ display: "inline-block", width: 1.5, height: 17, marginLeft: 1, verticalAlign: -3, background: WA_SEND, opacity: caretOn ? 1 : 0 }} />
              </>
            ) : (
              <span style={{ color: WA_GREY }}>
                <span style={{ display: "inline-block", width: 1.5, height: 17, marginRight: 2, verticalAlign: -3, background: WA_SEND, opacity: caretOn ? 1 : 0 }} />
                Ketik pesan
              </span>
            )}
          </div>
          <Paperclip size={20} color={WA_GREY} style={{ flexShrink: 0, marginBottom: 1 }} />
          {hasText ? null : <Camera size={21} color={WA_GREY} style={{ flexShrink: 0, marginBottom: 1 }} />}
        </div>
        <div
          style={{
            width: 46,
            height: 46,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: WA_SEND,
            color: COLORS.white,
            scale: 1 - sendPress * 0.14,
            boxShadow: `0 1px 2px rgba(11,20,26,0.25), 0 0 0 ${sendPress * 9}px rgba(0,168,132,${(0.28 * sendPress).toFixed(2)})`,
          }}
        >
          {hasText ? <SendHorizontal size={21} strokeWidth={2.3} /> : <Mic size={21} strokeWidth={2.3} />}
        </div>
      </div>

      {/* Home indicator */}
      <div style={{ position: "absolute", left: "50%", bottom: 8, width: 116, height: 4, marginLeft: -58, borderRadius: 4, background: "rgba(17,27,33,0.75)" }} />
    </div>
  );
};

// ---------- Panggilan masuk (piksel video 1080 x 1920) ----------
type CallScreenProps = {
  frame: number;
  /** 0..1, kemunculan isi (avatar, nama, tombol). */
  contentOpacity: number;
};

export const CALL_AVATAR_CENTER_Y = 930;

export const CallScreen: React.FC<CallScreenProps> = ({ frame, contentOpacity }) => {
  const rings = [0, 1, 2].map((i) => {
    const t = ((frame / 30) * 0.8 + i / 3) % 1;
    return { scale: 1 + t * 0.95, opacity: (1 - t) * 0.42 };
  });
  const acceptPulse = 1 + Math.max(0, Math.sin((frame / 30) * Math.PI * 2 * 1.4)) * 0.07;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        fontFamily,
        color: COLORS.white,
        background: `linear-gradient(160deg, ${COLORS.vwBlue} 0%, #101743 58%, #0C1238 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 900px 1000px at 50% 48%, rgba(0,176,240,0.30) 0%, rgba(0,176,240,0.08) 48%, transparent 76%)" }}
      />

      <div style={{ position: "absolute", inset: 0, opacity: contentOpacity }}>
        {/* Cincin dering */}
        {rings.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 150,
              top: CALL_AVATAR_CENTER_Y - 150,
              width: 300,
              height: 300,
              borderRadius: 999,
              border: "3px solid rgba(255,255,255,0.7)",
              scale: r.scale,
              opacity: r.opacity,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            top: CALL_AVATAR_CENTER_Y - 150,
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: "linear-gradient(145deg, #1F2A7A, #161E59)",
            boxShadow: "0 0 0 8px rgba(255,255,255,0.18), 0 30px 80px rgba(0,0,0,0.35)",
            fontSize: 108,
            fontWeight: 700,
          }}
        >
          {SERVICE_ADVISOR_DEMO.initials}
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: CALL_AVATAR_CENTER_Y + 200, textAlign: "center" }}>
          <div style={{ fontSize: 74, lineHeight: 1.15, fontWeight: 700 }}>{SERVICE_ADVISOR_DEMO.name}</div>
          <div style={{ marginTop: 14, fontSize: 38, lineHeight: 1.3, fontWeight: 500, color: "rgba(255,255,255,0.72)" }}>Panggilan suara WhatsApp</div>
          <div style={{ marginTop: 4, fontSize: 34, lineHeight: 1.3, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>{SERVICE_ADVISOR_DEMO.role} · Volkswagen PIK</div>
        </div>

        {/* Tombol tolak / jawab */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", justifyContent: "center", gap: 300 }}>
          {[
            { label: "Tolak", bg: "#E5484D", icon: <PhoneOff size={62} strokeWidth={2.4} />, s: 1 },
            { label: "Jawab", bg: "#25D366", icon: <Phone size={62} strokeWidth={2.4} />, s: acceptPulse },
          ].map((b) => (
            <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 156,
                  height: 156,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  background: b.bg,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
                  scale: b.s,
                }}
              >
                {b.icon}
              </div>
              <div style={{ fontSize: 34, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
