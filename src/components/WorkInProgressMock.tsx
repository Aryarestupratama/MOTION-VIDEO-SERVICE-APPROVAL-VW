import React from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  FileText,
  Globe,
  MapPin,
  MessageCircle,
  MoveHorizontal,
  Play,
  Wrench,
  X,
  ZoomIn,
} from "lucide-react";
import { Img, interpolate, staticFile } from "remotion";
import { COLORS } from "../theme";

// Konten contoh; status dan semua label dapat diganti di sini.
export const WIP_CONTENT = {
  workshop: "Volkswagen PIK",
  customer: "Dina Pratama (Demo)",
  plate: "B 1234 VW",
  vehicle: "VW Tiguan Allspace (Demo)",
  advisor: "Raka (Demo)",
  technician: "Bima (Demo)",
  technicianMessage:
    "Kami menemukan komponen yang perlu diperiksa lebih lanjut. Detail dan foto ada di bawah.",
  status: "Work In Process",
  imageDescriptions: [
    "Pemeriksaan komponen rem — foto demo 1",
    "Kondisi komponen kendaraan — foto demo 2",
    "Hasil perbaikan — foto demo 3",
  ],
  items: [
    { name: "Pemeriksaan sistem rem", description: "Pemeriksaan dan penyetelan komponen rem.", price: "Rp 1.250.000" },
    { name: "Ganti filter udara", description: "Filter perlu diganti agar aliran udara tetap optimal.", price: "Rp 850.000" },
  ],
  address: "Jl. Pantai Indah Utara 2, Jakarta Utara (Demo)",
  advisorMessage: "Jika Anda ingin berdiskusi mengenai kendaraan, hubungi Service Advisor kami.",
  footer: "Digital inspection report by VW PIK",
} as const;

// Section diletakkan pada koordinat halaman yang sama selama scroll berlangsung.
export const WIP_SECTION_Y = {
  status: 330,
  video: 650,
  repairImages: 1110,
  approveReject: 1640,
  submit: 2082,
  estimationForm: 2290,
  serviceAdvisor: 2880,
  maps: 3230,
  footer: 3990,
} as const;

export const WIP_SECTION_HEIGHT = {
  status: 120,
  video: 390,
  repairImages: 430,
  approveReject: 520,
  submit: 56,
  estimationForm: 360,
  serviceAdvisor: 250,
  maps: 560,
  footer: 70,
} as const;

// Tinggi halaman = batas bawah footer + ruang bawah 24px.
export const WIP_REPORT_HEIGHT = WIP_SECTION_Y.footer + WIP_SECTION_HEIGHT.footer + 24;
export const WIP_SCREEN_HEIGHT = 1042;

export type DecisionState = "pending" | "approved" | "rejected";
export type WorkInProgressMockProps = {
  scrollY: number;
  frame: number;
  approvedProgress: number;
  rejectedProgress: number;
  submittedProgress: number;
  viewerProgress: number;
  viewerPhotoIndex: number;
  viewerSlideProgress: number;
  statusReveal: number;
};

const COLORS_LOCAL = {
  grey: "#6B7280",
  line: "rgba(22,30,89,0.12)",
  amber: "#B45309",
  red: "#B42318",
  surface: "#F7F8FA",
};
const SHADOW = "0 12px 40px -16px rgba(22,27,89,0.22)";
const PHOTO_COUNT = WIP_CONTENT.imageDescriptions.length;
const PHOTO_DEPTH = [0, 1, 2];

const cardStyle: React.CSSProperties = {
  backgroundColor: COLORS.white,
  borderRadius: 24,
  boxShadow: SHADOW,
  border: "1px solid rgba(0,0,0,0.045)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#111827",
  fontSize: 16,
  lineHeight: 1.35,
  fontWeight: 700,
};

const absoluteSection = (top: number, height: number): React.CSSProperties => ({
  position: "absolute",
  top,
  left: 16,
  right: 16,
  minHeight: height,
});

const PhotoArtwork: React.FC<{ index: number }> = ({ index }) => (
  <svg viewBox="0 0 390 280" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`photo-sky-${index}`} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor={index === 1 ? "#C7D2DA" : "#D8DEE2"} />
        <stop offset="1" stopColor={index === 2 ? "#66727D" : "#87949B"} />
      </linearGradient>
      <linearGradient id={`photo-floor-${index}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#727C82" />
        <stop offset="1" stopColor="#343C41" />
      </linearGradient>
    </defs>
    <rect width="390" height="280" fill={`url(#photo-sky-${index})`} />
    <rect y="145" width="390" height="135" fill={`url(#photo-floor-${index})`} />
    <path d="M16 74h358M27 92h336M36 48h316" stroke="#F7F8F8" strokeOpacity=".46" strokeWidth="6" />
    <path d="M46 0v150M344 0v145" stroke="#414A50" strokeOpacity=".55" strokeWidth="12" />
    <rect x="58" y="162" width="268" height="55" rx="24" fill={index === 0 ? "#23345A" : "#394B5D"} />
    <path d="M105 162l36-34h78l34 34" fill="#52616D" />
    <rect x="147" y="137" width="56" height="24" rx="8" fill="#AFC4D0" />
    <circle cx="111" cy="219" r="25" fill="#20262B" /><circle cx="111" cy="219" r="12" fill="#AEB7BB" />
    <circle cx="279" cy="219" r="25" fill="#20262B" /><circle cx="279" cy="219" r="12" fill="#AEB7BB" />
    <rect x="17" y="18" width="136" height="25" rx="12" fill="#101820" fillOpacity=".58" />
    <text x="30" y="35" fill="white" fontSize="12" fontFamily="Arial, sans-serif">DEMO · AREA 0{index + 1}</text>
  </svg>
);

const WorkshopMap: React.FC = () => (
  <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Peta ilustrasi lokasi bengkel">
    <rect width="360" height="150" rx="18" fill="#F0F4EE" />
    <path d="M0 37h360M0 76h360M0 119h360M58 0v150M137 0v150M228 0v150M312 0v150" stroke="#D4DDD9" strokeWidth="8" />
    <path d="M0 95h360" stroke="#91C7DE" strokeWidth="26" />
    <path d="M0 95h360" stroke="white" strokeWidth="2" strokeDasharray="12 9" />
    <rect x="152" y="53" width="58" height="30" rx="8" fill="#DDE9D9" />
    <path d="M181 55c-15 0-27 11-27 25 0 17 27 47 27 47s27-30 27-47c0-14-12-25-27-25Z" fill="#D92D32" />
    <circle cx="181" cy="80" r="8" fill="white" />
    <text x="67" y="30" fill="#52616B" fontSize="10" fontFamily="Arial, sans-serif">Jl. Pantai Indah Utara 2</text>
    <text x="235" y="139" fill="#52616B" fontSize="10" fontFamily="Arial, sans-serif">Jl. Pantai Indah Kapuk</text>
  </svg>
);

const DemoPhoto: React.FC<{ index: number; style?: React.CSSProperties }> = ({ index, style }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 22, background: "#CBD3D8", ...style }}>
    <Img src={staticFile(`images/inspection/demo-repair-${index + 1}.jpg`)} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

const DecisionButton: React.FC<{
  label: string;
  kind: "approve" | "reject";
  progress: number;
  submitted?: boolean;
}> = ({ label, kind, progress, submitted = false }) => {
  const approved = kind === "approve";
  const accent = approved ? COLORS.approved : COLORS_LOCAL.red;
  const checkProgress = interpolate(progress, [0.15, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      {progress > 0 && (
        <div aria-hidden="true" style={{ position: "absolute", inset: -12, border: `3px solid ${accent}`, borderRadius: 28, opacity: interpolate(progress, [0, 0.2, 1], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: interpolate(progress, [0, 1], [0.45, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
      )}
      <div style={{ position: "relative", display: "flex", minHeight: 40, alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 999, border: `1px solid ${progress > 0.72 ? accent : approved ? "rgba(46,125,50,.6)" : "#9CA3AF"}`, background: progress > 0.72 ? accent : COLORS.white, color: progress > 0.72 ? COLORS.white : approved ? COLORS.approved : "#374151", fontSize: 13, lineHeight: 1, fontWeight: 700, scale: progress > 0 && progress < 0.2 ? 0.95 : 1 }}>
        {progress > 0.72 ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {approved ? <path d="m5 12 4 4L19 6" strokeDasharray={24} strokeDashoffset={24 * (1 - checkProgress)} /> : <path d="m6 6 12 12M18 6 6 18" strokeDasharray={34} strokeDashoffset={34 * (1 - checkProgress)} />}
          </svg>
        ) : approved ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
        {submitted && progress >= 1 ? "Submitted" : progress > 0.72 ? (approved ? "Approved" : "Rejected") : label}
      </div>
    </div>
  );
};

export const WorkInProgressMock: React.FC<WorkInProgressMockProps> = ({
  scrollY,
  frame,
  approvedProgress,
  rejectedProgress,
  submittedProgress,
  viewerProgress,
  viewerPhotoIndex,
  viewerSlideProgress,
  statusReveal,
}) => {
  const photos = PHOTO_DEPTH;
  const currentPhoto = Math.max(0, Math.min(PHOTO_COUNT - 1, viewerPhotoIndex));
  const viewerOpen = viewerProgress > 0.02;
  const slideOffset = interpolate(viewerSlideProgress, [0, 1], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", top: 0, left: "50%", marginLeft: -195, width: 390, height: WIP_REPORT_HEIGHT, overflow: "hidden", background: "linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 65%,#F7F8FA 100%)", color: "#111827", fontFamily: "inherit" }}>
      <div style={{ position: "absolute", inset: 0, translate: `0 ${-scrollY}px` }}>
        {/* Header + stage illustration */}
        <header style={{ position: "absolute", top: 54, left: 20, right: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "white", border: `1px solid ${COLORS_LOCAL.line}`, display: "grid", placeItems: "center", overflow: "hidden" }}><Img src={staticFile("images/vw-logo-navy.jpeg")} alt={WIP_CONTENT.workshop} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 3 }} /></div>
            <div>
              <div style={{ color: COLORS.vwBlue, fontSize: 14, fontWeight: 700 }}>{WIP_CONTENT.workshop}</div>
              <div style={{ color: COLORS_LOCAL.grey, fontSize: 12 }}>Service Inspection Report</div>
            </div>
          </div>
          <div style={{ margin: "12px -20px 0", height: 224, display: "flex", alignItems: "center", justifyContent: "center", opacity: statusReveal, scale: interpolate(statusReveal, [0, 1], [0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <Img src={staticFile("images/stages/work_in_progress.jpg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
          </div>
        </header>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.status, WIP_SECTION_HEIGHT.status), padding: 16, borderRadius: 24, background: COLORS.vwBlue, color: COLORS.white, boxShadow: "0 12px 26px rgba(22,30,89,.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Wrench size={17} /><div><div style={{ fontSize: 12, fontWeight: 700 }}>Current progress</div><div style={{ fontSize: 11, opacity: 0.72 }}>Step 1 of 4</div></div></div>
          <div style={{ marginTop: 10, fontSize: 20, lineHeight: 1.15, fontWeight: 800 }}>{WIP_CONTENT.status}</div>
          <div style={{ display: "flex", gap: 5, marginTop: 12 }}>{[0, 1, 2, 3].map((n) => <div key={n} style={{ height: 6, flex: 1, borderRadius: 99, background: n === 0 ? COLORS.white : "rgba(255,255,255,.25)" }} />)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 9, fontSize: 10 }}><span><b>Work In Process</b><br />In progress</span><span style={{ textAlign: "right" }}><b>Quality Control</b><br />Next</span></div>
        </section>

        <div style={{ position: "absolute", top: 465, left: 16, right: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ label: "License Number", value: WIP_CONTENT.plate }, { label: "Customer", value: WIP_CONTENT.customer }].map((item) => <div key={item.label} style={{ borderRadius: 14, padding: "11px 13px", background: "#F2F2F2" }}><div style={{ color: COLORS_LOCAL.grey, fontSize: 11 }}>{item.label}</div><div style={{ marginTop: 3, color: "#111827", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.value}</div></div>)}
        </div>

        <div style={{ position: "absolute", top: 525, left: 16, right: 16, minHeight: 52, borderRadius: 13, border: "1px solid #FCD34D", background: "#FFFBEB", display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", color: "#78350F", fontSize: 12, fontWeight: 700 }}>
          <span style={{ width: 28, height: 28, display: "grid", placeItems: "center", borderRadius: 99, background: "#FEF3C7" }}><Clock3 size={16} /></span><span style={{ flex: 1 }}>2 items to decide</span><span style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 99, padding: "7px 10px", color: COLORS.white, background: COLORS_LOCAL.amber }}>Review <ArrowDown size={14} /></span>
        </div>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.video, WIP_SECTION_HEIGHT.video) }}>
          <h2 style={sectionTitleStyle}>Inspection video</h2>
          <div style={{ position: "relative", marginTop: 12, height: 205, overflow: "hidden", borderRadius: 22, background: "linear-gradient(145deg,#344054,#111827)" }}>
            <PhotoArtwork index={1} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(9,15,28,.38)" }} />
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><span style={{ width: 58, height: 58, display: "grid", placeItems: "center", borderRadius: 99, background: "rgba(255,255,255,.94)", color: COLORS.vwBlue }}><Play size={24} fill={COLORS.vwBlue} /></span></div>
            <div style={{ position: "absolute", left: 13, right: 13, bottom: 12, height: 4, borderRadius: 9, background: "rgba(255,255,255,.45)" }}><div style={{ width: `${interpolate(frame, [270, 360], [3, 92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`, height: "100%", borderRadius: 9, background: COLORS.lightBlue }} /></div>
            <span style={{ position: "absolute", right: 12, bottom: 20, color: "white", fontSize: 10 }}>00:{String(Math.floor(interpolate(frame, [270, 360], [0, 45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))).padStart(2, "0")} / 00:45</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 15, alignItems: "flex-start" }}><span style={{ width: 32, height: 32, flex: "0 0 auto", display: "grid", placeItems: "center", borderRadius: 99, background: COLORS.vwBlue, color: "white", fontSize: 11, fontWeight: 700 }}>BD</span><div><p style={{ margin: 0, color: "#374151", fontSize: 13, lineHeight: 1.5 }}>{WIP_CONTENT.technicianMessage}</p><p style={{ margin: "5px 0 0", color: COLORS_LOCAL.grey, fontSize: 11 }}>{WIP_CONTENT.technician} · Chief Technician</p></div></div>
        </section>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.repairImages, WIP_SECTION_HEIGHT.repairImages) }}>
          <h2 style={sectionTitleStyle}>Repair results</h2>
          <p style={{ margin: "5px 0 0", color: COLORS_LOCAL.grey, fontSize: 12, lineHeight: 1.45 }}>See how the issues shown in the video above have been fixed.</p>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}><span style={{ borderRadius: 99, padding: "4px 12px", color: COLORS.vwBlue, background: "rgba(22,30,89,.08)", fontSize: 11, fontWeight: 800 }}>Photo {Math.min(PHOTO_COUNT, Math.max(1, Math.floor(Math.max(0, frame - 390) / 8) + 1))}/{PHOTO_COUNT}</span></div>
          <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", marginTop: 8, marginBottom: 24 }}>
            {photos.map((idx) => {
              const depth = idx;
              return <div key={idx} style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 22, background: "#D1D5DB", boxShadow: "0 14px 36px -14px rgba(22,27,89,.38)", border: "1px solid rgba(0,0,0,.06)", zIndex: PHOTO_COUNT - depth, opacity: 1, scale: 1 - Math.min(depth, 3) * 0.05, translate: `0 ${Math.min(depth, 3) * 12}px`, rotate: `${depth === 0 ? 0 : depth % 2 === 1 ? 2.2 : -2.2}deg`, transformOrigin: "50% 100%" }}><DemoPhoto index={idx} /><span style={{ position: "absolute", inset: 0, background: "black", opacity: Math.min(depth, 3) * 0.07 }} /></div>;
            })}
            <span aria-hidden="true" style={{ position: "absolute", zIndex: 8, top: "44%", left: "50%", width: 54, height: 54, marginLeft: -27, marginTop: -27, border: "3px solid white", borderRadius: 99, boxShadow: "0 2px 16px rgba(0,0,0,.35)", opacity: interpolate(frame, [395, 397, 405, 412], [0, 0.85, 0.65, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: interpolate(frame, [395, 412], [0.45, 1.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 5 }}><span style={{ width: 42, height: 42, borderRadius: 99, display: "grid", placeItems: "center", background: COLORS.white, color: COLORS.vwBlue, border: `1px solid ${COLORS_LOCAL.line}` }}><ArrowLeft size={18} /></span><div style={{ textAlign: "center", color: COLORS_LOCAL.grey, fontSize: 10, lineHeight: 1.6 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><MoveHorizontal size={14} /> Swipe to see the next photo</div><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ZoomIn size={14} /> Tap a photo to enlarge</div></div><span style={{ width: 42, height: 42, borderRadius: 99, display: "grid", placeItems: "center", background: COLORS.white, color: COLORS.vwBlue, border: `1px solid ${COLORS_LOCAL.line}` }}><ArrowRight size={18} /></span></div>
          <p style={{ margin: "14px 0 0", textAlign: "center", color: "#111827", fontSize: 13 }}>{WIP_CONTENT.imageDescriptions[0]}</p>
        </section>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.approveReject, WIP_SECTION_HEIGHT.approveReject), padding: 16, borderRadius: 24, background: COLORS.white, boxShadow: SHADOW }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}><h2 style={sectionTitleStyle}>Inspection items</h2><span style={{ borderRadius: 99, padding: "5px 9px", color: COLORS_LOCAL.amber, background: "#FFFBEB", fontSize: 10, fontWeight: 700 }}>Estimated Price</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 10 }}><span style={{ minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 99, border: "1px solid rgba(46,125,50,.6)", color: COLORS.approved, fontSize: 11, fontWeight: 700 }}><Check size={13} /> Approve all</span><span style={{ minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 99, border: "1px solid #9CA3AF", color: "#4B5563", fontSize: 11, fontWeight: 700 }}><X size={13} /> Reject all</span></div>
          <div style={{ display: "grid", gap: 9, marginTop: 10 }}>
            {WIP_CONTENT.items.map((item, index) => {
              const progress = index === 0 ? approvedProgress : rejectedProgress;
              const accepted = index === 0 && progress > 0.72;
              const declined = index === 1 && progress > 0.72;
              return <article key={item.name} style={{ borderRadius: 20, padding: 12, background: accepted ? "rgba(46,125,50,.05)" : COLORS.white, boxShadow: "0 10px 30px -16px rgba(22,27,89,.22)", border: `1px solid ${accepted ? "rgba(46,125,50,.38)" : "rgba(0,0,0,.06)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 7 }}><h3 style={{ margin: 0, color: "#111827", fontSize: 13, lineHeight: 1.3, fontWeight: 700 }}>{item.name}</h3><span style={{ display: "flex", alignItems: "center", gap: 3, borderRadius: 99, padding: "4px 7px", background: accepted ? "rgba(46,125,50,.1)" : declined ? "#F3F4F6" : "#FFFBEB", color: accepted ? COLORS.approved : declined ? "#4B5563" : COLORS_LOCAL.amber, fontSize: 9, fontWeight: 700 }}>{accepted ? <Check size={10} /> : declined ? <X size={10} /> : <Clock3 size={10} />}{accepted ? "Approved" : declined ? "Rejected" : "Waiting"}</span></div>
                <p style={{ margin: "4px 0 0", color: "#4B5563", fontSize: 11, lineHeight: 1.35 }}>{item.description}</p>
                <div style={{ borderTop: `1px dashed ${COLORS_LOCAL.line}`, margin: "8px 0 6px" }} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><b>Total</b><b style={{ color: COLORS.vwBlue }}>{item.price}</b></div><p style={{ margin: "2px 0 0", textAlign: "right", color: COLORS_LOCAL.grey, fontSize: 9 }}>Price excludes VAT</p>
                <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
                  {accepted || declined ? (
                    <>
                      <span style={{ flex: 1, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 99, color: COLORS.white, background: accepted ? COLORS.approved : COLORS_LOCAL.red, fontSize: 12, fontWeight: 700 }}>{accepted ? <Check size={14} /> : <X size={14} />} {accepted ? "Approved" : "Rejected"}</span>
                      <span style={{ flex: 1, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 99, border: `1px solid ${COLORS_LOCAL.line}`, color: "#4B5563", fontSize: 12, fontWeight: 700 }}><ArrowLeft size={13} /> Change</span>
                    </>
                  ) : (
                    <>
                      <DecisionButton label="Approve" kind="approve" progress={index === 0 ? approvedProgress : 0} />
                      <DecisionButton label="Reject" kind="reject" progress={index === 1 ? rejectedProgress : 0} />
                    </>
                  )}
                </div>
              </article>;
            })}
          </div>
          <div style={{ marginTop: 10, padding: "9px 11px", borderRadius: 16, background: COLORS_LOCAL.surface, display: "flex", justifyContent: "space-between", fontSize: 11 }}><span style={{ color: COLORS_LOCAL.grey }}>Estimated items total</span><b style={{ color: COLORS.vwBlue }}>Rp 2.331.000</b></div>
        </section>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.submit, WIP_SECTION_HEIGHT.submit), display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "7px 10px", borderRadius: 18, background: "rgba(255,255,255,.98)", boxShadow: "0 -6px 18px rgba(0,0,0,.12)", border: `1px solid ${COLORS_LOCAL.line}` }}>
          <div><div style={{ color: "#374151", fontSize: 10, fontWeight: 700 }}>{Number(approvedProgress > 0.72) + Number(rejectedProgress > 0.72)} of 2 decided</div><div style={{ color: COLORS_LOCAL.grey, fontSize: 9 }}>Estimated items total</div></div>
          <div style={{ position: "relative" }}><span style={{ position: "absolute", inset: -5, borderRadius: 99, border: `2px solid ${COLORS.approved}`, opacity: interpolate(submittedProgress, [0, 0.3, 1], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: interpolate(submittedProgress, [0, 1], [0.55, 1.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} /><span style={{ minWidth: 126, minHeight: 42, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, borderRadius: 99, background: submittedProgress > 0.75 ? COLORS.approved : COLORS.white, color: submittedProgress > 0.75 ? COLORS.white : COLORS.approved, border: `1px solid ${COLORS.approved}`, fontSize: 12, fontWeight: 700, scale: submittedProgress > 0 && submittedProgress < 0.25 ? 0.95 : 1 }}><CheckCircle2 size={15} />{submittedProgress > 0.75 ? "Submitted" : "Submit"}</span></div>
        </section>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.estimationForm, WIP_SECTION_HEIGHT.estimationForm) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><h2 style={sectionTitleStyle}>Estimation form</h2></div>
          <div style={{ ...cardStyle, marginTop: 12, padding: 15, display: "flex", alignItems: "center", gap: 12, minHeight: 88, border: `1px dashed ${COLORS_LOCAL.line}`, background: "rgba(242,242,242,.45)" }}><span style={{ width: 42, height: 42, display: "grid", placeItems: "center", flex: "0 0 auto", borderRadius: 99, color: COLORS_LOCAL.grey, background: COLORS.white }}><Clock3 size={20} /></span><div><b style={{ fontSize: 13, color: "#1F2937" }}>Estimation form is being prepared</b><p style={{ margin: "4px 0 0", color: "#4B5563", fontSize: 11 }}>It will appear here automatically once it's ready.</p></div></div>
          <div style={{ ...cardStyle, marginTop: 12, padding: 13 }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center", color: COLORS.vwBlue, background: "#F2F2F2" }}><FileText size={18} /></span><div style={{ flex: 1 }}><b style={{ fontSize: 12 }}>Estimation document</b><div style={{ marginTop: 2, color: COLORS_LOCAL.grey, fontSize: 10 }}>PDF · Demo preview</div></div><ChevronRight size={16} color={COLORS.vwBlue} /></div></div>
          <div style={{ marginTop: 11, color: COLORS_LOCAL.grey, fontSize: 10, lineHeight: 1.5 }}>These prices are estimates and may change until finalized after inspection review.</div>
        </section>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.serviceAdvisor, WIP_SECTION_HEIGHT.serviceAdvisor), ...cardStyle, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}><span style={{ width: 44, height: 44, borderRadius: 99, display: "grid", placeItems: "center", color: "white", background: COLORS.vwBlue, fontWeight: 800 }}>RD</span><div><b style={{ fontSize: 14 }}>{WIP_CONTENT.advisor}</b><div style={{ color: COLORS_LOCAL.grey, fontSize: 12 }}>Service Advisor</div></div></div>
          <p style={{ margin: "14px 0 10px", color: "#4B5563", fontSize: 11, lineHeight: 1.45 }}>{WIP_CONTENT.advisorMessage}</p>
          <div style={{ minHeight: 42, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, background: COLORS.vwBlue, color: "white", fontSize: 12, fontWeight: 700 }}><MessageCircle size={15} /> Send Message</div>
        </section>

        <section style={{ ...absoluteSection(WIP_SECTION_Y.maps, WIP_SECTION_HEIGHT.maps), ...cardStyle, padding: 16 }}>
          <h2 style={sectionTitleStyle}>Workshop location</h2>
          <div style={{ marginTop: 12, borderRadius: 18, border: `1px solid ${COLORS_LOCAL.line}`, overflow: "hidden" }}><WorkshopMap /></div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 11, borderRadius: 16, padding: 11, background: "#F2F2F2" }}><MapPin size={16} color={COLORS.vwBlue} /><b style={{ fontSize: 11, lineHeight: 1.4 }}>{WIP_CONTENT.address}</b></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}><span style={{ minHeight: 42, display: "flex", justifyContent: "center", alignItems: "center", gap: 5, borderRadius: 99, border: `1px solid ${COLORS_LOCAL.line}`, fontSize: 10, fontWeight: 700 }}><MapPin size={14} />Open in Maps</span><span style={{ minHeight: 42, display: "flex", justifyContent: "center", alignItems: "center", gap: 5, borderRadius: 99, border: `1px solid ${COLORS_LOCAL.line}`, fontSize: 10, fontWeight: 700 }}><Globe size={14} />Visit Website</span><span style={{ gridColumn: "1 / -1", minHeight: 42, display: "flex", justifyContent: "center", alignItems: "center", gap: 5, borderRadius: 99, border: `1px solid ${COLORS.vwBlue}`, color: COLORS.vwBlue, fontSize: 10, fontWeight: 700 }}><MessageCircle size={14} />Book a service</span></div>
        </section>

        <footer style={{ ...absoluteSection(WIP_SECTION_Y.footer, WIP_SECTION_HEIGHT.footer), borderTop: `1px solid ${COLORS_LOCAL.line}`, padding: "22px 6px", textAlign: "center", color: "#9CA3AF", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>{WIP_CONTENT.footer}</footer>
      </div>

      {viewerOpen && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: WIP_SCREEN_HEIGHT, zIndex: 30, background: "#E5E7EB", opacity: viewerProgress, overflow: "hidden" }}>
          <div style={{ height: 58, display: "flex", alignItems: "center", gap: 7, padding: "0 12px", background: COLORS.white, borderBottom: `1px solid ${COLORS_LOCAL.line}` }}><ArrowLeft size={18} color={COLORS.vwBlue} /><b style={{ flex: 1, textAlign: "center", fontSize: 11 }}>Repair photo · {currentPhoto + 1}/{PHOTO_COUNT}</b><ZoomIn size={17} color={COLORS.vwBlue} /><Copy size={15} color={COLORS.vwBlue} /></div>
          <div style={{ position: "absolute", top: 72, left: 9, right: 9, bottom: 60, overflow: "hidden", borderRadius: 12, background: "#CDD4D8", translate: `${slideOffset}px 0` }}>
            <Img src={staticFile(`images/inspection/demo-repair-${currentPhoto + 1}.jpg`)} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "absolute", zIndex: 2, left: 12, bottom: 12, borderRadius: 8, padding: "7px 9px", color: "white", background: "rgba(0,0,0,.58)", fontSize: 10 }}>{WIP_CONTENT.imageDescriptions[currentPhoto]}</span>
          </div>
          <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>{photos.map((index) => <span key={index} style={{ width: 7, height: 7, borderRadius: 99, background: index === currentPhoto ? COLORS.vwBlue : "#9CA3AF" }} />)}</div>
        </div>
      )}
    </div>
  );
};
