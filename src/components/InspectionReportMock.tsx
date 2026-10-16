import React from "react";
import {
  ArrowDown,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  FileText,
  Globe,
  Landmark,
  MapPin,
  MessageCircle,
  MoveHorizontal,
  Phone,
  Copy,
  Upload,
  X,
  ZoomIn,
} from "lucide-react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Dummy statis. Susunan dan label mengikuti InspectionReport.jsx; tidak berisi PII.
const DUMMY = {
  status: "work_in_progress",
  workshop: "Volkswagen PIK",
  customer: "Dina Pratama (Demo)",
  vehicle: "VW Tiguan Allspace (Demo)",
  plate: "B 1234 VW",
  advisor: "Raka Pratama",
  technician: "Bimo Kurnia",
  technicianMessage:
    "Selamat siang Dina, berikut hasil pengecekan kendaraan Anda. Silakan tonton video dari teknisi kami, lalu pilih item yang ingin dikerjakan. Terima kasih.",
  items: [
    {
      name: "Engine oil & oil filter replacement",
      description: "VW 504 00 / 507 00 spec 5W-30 synthetic oil with genuine oil filter",
      price: 1_895_000,
    },
    {
      name: "Cabin air filter replacement",
      description: "Clogged filter reduces airflow and A/C performance",
      price: 650_000,
    },
    { name: "Brake fluid replacement", description: "Replace brake fluid and bleed the braking system.", price: 1_200_000 },
    { name: "Front brake pad replacement", description: "Replace front brake pads and inspect brake discs.", price: 875_000 },
    { name: "Multi-point vehicle inspection", description: "Inspection of key vehicle safety and operating systems.", price: 565_000 },
  ],
  photos: [
    { src: "images/repair/repair-placeholder-1.jpg", description: "rem depan belakang" },
    { src: "images/repair/repair-placeholder-2.jpg", description: "Engine bay inspection (Demo)" },
    { src: "images/repair/repair-placeholder-3.jpg", description: "Cabin filter replacement (Demo)" },
    { src: "images/repair/repair-placeholder-4.jpg", description: "Final vehicle check (Demo)" },
  ],
  priceBeforeDiscount: 5_185_000,
  discount: 52_000,
  subtotal: 5_133_000,
  vat: 564_630,
  estimatedTotal: 5_697_630,
  approvedItemsTotal: 5_697_630,
  invoiceNumber: "INV-VW-2026-0412",
  billTo: "Dina Pratama (Demo)",
  address: "Jl. Pantai Indah Selatan A1 ST, RT.001/RW.6, Kapuk Muara, Kecamatan Penjaringan, Jakarta Utara, Daerah Khusus Ibukota Jakarta 14460",
  bankAccounts: [
    { bank: "Bank Mandiri", holder: "PT VW PIK Demo", number: "123 000 456 7890" },
    { bank: "BCA", holder: "PT VW PIK Demo", number: "812 345 6789" },
  ],
};
const IS_INVOICE_STAGE = DUMMY.status === "invoice_preparation";
const IS_COMPLETED = DUMMY.status === "completed";
const IS_CANCELLED = DUMMY.status === "cancelled";
const COLLAPSE_ITEMS = IS_INVOICE_STAGE || IS_COMPLETED;

// Content height and workshop stop point are shared with SolutionScene.
export const REPORT_TOTAL_HEIGHT = 5100;
export const REPORT_WORKSHOP_BOTTOM = 3450;

const VIEWPORT_HEIGHT = 1042;
export const REPORT_SCROLL_DISTANCE = REPORT_WORKSHOP_BOTTOM - VIEWPORT_HEIGHT;
export const REPORT_SCROLL_START_FRAME = 155;
export const REPORT_SCROLL_END_FRAME = 820;
const SOFT_CARD =
  "rounded-3xl bg-white ring-1 ring-black/[0.04] shadow-[0_12px_40px_-16px_rgba(22,27,89,0.22)]";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const inverseInOutCubic = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t < 0.5 ? Math.cbrt(t / 4) : 1 - Math.cbrt((1 - t) / 2);
};

const useBounceStyle = (scrollY: number, startScrollY: number, startFrame: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scrollTriggerFrame = REPORT_SCROLL_START_FRAME +
    inverseInOutCubic(startScrollY / REPORT_SCROLL_DISTANCE) *
      (REPORT_SCROLL_END_FRAME - REPORT_SCROLL_START_FRAME);
  const animationStartFrame = startScrollY === 0
    ? startFrame
    : scrollTriggerFrame;
  const started = frame >= animationStartFrame &&
    (startScrollY === 0 || scrollY >= startScrollY);
  const animationFrame = Math.max(0, frame - animationStartFrame) * 0.55;
  const springValue = started
    ? spring({ frame: animationFrame, fps, config: { damping: 16, mass: 0.95, stiffness: 120 } })
    : 0;
  const opacity = interpolate(springValue, [0, 0.22, 0.8], [0, 1, 1], clamp);

  return {
    opacity,
    translate: `0 ${(1 - springValue) * 28}px`,
    scale: 0.94 + springValue * 0.06,
    transformOrigin: "50% 50%",
  } as const;
};

const Avatar: React.FC<{
  size: "h-10 w-10" | "h-8 w-8" | "h-11 w-11";
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
}> = ({ size, src, alt, fallback, className = "" }) => (
  <span
    className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-vw-blue text-xs font-bold text-white ${className}`}
  >
    {src ? (
      <Img src={staticFile(src)} alt={alt} className="h-full w-full object-contain p-0.5" />
    ) : (
      fallback
    )}
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode; count?: number }> = ({
  children,
  count,
}) => (
  <div className="flex items-center gap-2">
    <h2 className="text-base font-bold text-gray-900">{children}</h2>
    {count !== undefined && count > 1 && (
      <span className="rounded-full bg-vw-blue/10 px-2 py-0.5 text-xs font-bold text-vw-blue">
        {count}
      </span>
    )}
  </div>
);

const Rupiah: React.FC<{ value: number; className?: string }> = ({
  value,
  className = "",
}) => (
  <span className={`whitespace-nowrap tabular-nums ${className}`}>
    <span className="mr-0.5 text-[0.7em] font-medium opacity-60">Rp</span>
    {Math.round(value).toLocaleString("id-ID")}
  </span>
);

const PendingNotice: React.FC<{ title: string; text: string }> = ({
  title,
  text,
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-dashed border-vw-grey/30 bg-vw-grey-light/40 px-4 py-4">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-vw-grey shadow-sm">
      <Clock className="h-5 w-5" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-600">{text}</p>
    </div>
  </div>
);

const StatusStamp: React.FC = () => (
  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
    <Clock className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
    Waiting
  </span>
);

const InspectionItemCard: React.FC<{
  item: (typeof DUMMY.items)[number];
  index: number;
  scrollY: number;
}> = ({ item, index, scrollY }) => (
  <li
    className="relative scroll-mt-24 overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-black/[0.04] shadow-[0_12px_40px_-16px_rgba(22,27,89,0.22)]"
    style={useBounceStyle(scrollY, 1320 + index * 110, 0)}
  >
    <div className="flex items-start justify-between gap-3">
      <h3 className="min-w-0 break-words text-[15px] font-bold leading-snug text-gray-900">{item.name}</h3>
      <StatusStamp />
    </div>
    <div className="mt-0.5"><p className="text-[13px] leading-snug text-gray-600">{item.description}</p></div>
    <div className="my-3 border-t border-dashed border-vw-grey/30" />
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-bold text-gray-900">Total</span>
      <Rupiah value={item.price} className="text-xl font-bold text-vw-blue" />
    </div>
    <p className="mt-0.5 text-right text-xs text-vw-grey">Price excludes VAT</p>
    <div className="mt-3 grid grid-cols-2 gap-2">
      <button type="button" className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-approved/60 bg-white px-3 text-[13px] font-semibold text-approved">
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> Approve
      </button>
      <button type="button" className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-gray-400 bg-white px-3 text-[13px] font-semibold text-gray-700">
        <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> Reject
      </button>
    </div>
  </li>
);

const RepairPhotoCard: React.FC<{
  photo: { src: string; description: string };
  index: number;
  photoCount: number;
  scrollY: number;
}> = ({ photo, index, photoCount, scrollY }) => {
  const depth = Math.min(index, 3);
  const scale = 1 - depth * 0.05;
  const y = depth * 12;
  const rotation = depth === 0 ? 0 : (depth % 2 === 1 ? 2.2 : -2.2);
  const entrance = useBounceStyle(scrollY, 760 + index * 60, 0);

  return (
    <div
      aria-hidden={index !== 0}
      className="absolute inset-0 overflow-hidden rounded-3xl bg-white shadow-[0_14px_36px_-14px_rgba(22,27,89,0.38)] ring-1 ring-black/[0.06]"
      style={{
        zIndex: photoCount - index,
        transform: `translate3d(0px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "50% 100%",
        opacity: entrance.opacity,
        translate: entrance.translate,
        scale: entrance.scale,
      }}
    >
      <Img
        src={staticFile(photo.src)}
        alt={photo.description}
        className="h-full w-full object-cover"
      />
      {index !== 0 && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-black"
          style={{ opacity: Math.min(depth, 3) * 0.07 }}
        />
      )}
    </div>
  );
};

const RepairImageStackMock: React.FC<{
  photos: { src: string; description: string }[];
  scrollY: number;
}> = ({ photos, scrollY }) => {
  const isStack = photos.length > 1;
  const photoCountStyle = useBounceStyle(scrollY, 650, 0);
  const carouselStyle = useBounceStyle(scrollY, 720, 0);
  const photoControlsStyle = useBounceStyle(scrollY, 1010, 0);
  const photoCaptionStyle = useBounceStyle(scrollY, 1080, 0);

  return (
    <div className="mt-3" style={useBounceStyle(scrollY, 590, 0)}>
      {isStack && (
        <div className="mb-3 flex justify-center" style={photoCountStyle}>
          <span className="rounded-full bg-vw-blue/10 px-3 py-1 text-xs font-bold tabular-nums text-vw-blue">
            Photo 1/{photos.length}
          </span>
        </div>
      )}

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Repair photos"
        className={`relative mx-auto aspect-[4/3] w-full max-w-md select-none rounded-3xl ${isStack ? "mb-14" : ""}`}
        style={carouselStyle}
      >
        {photos.map((photo, index) => (
          <RepairPhotoCard
            key={photo.description}
            photo={photo}
            index={index}
            photoCount={photos.length}
            scrollY={scrollY}
          />
        ))}
      </div>

      {isStack ? (
        <div className="mx-auto mt-2 flex max-w-md items-center justify-between gap-2" style={photoControlsStyle}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-vw-blue ring-1 ring-black/[0.08]">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1 text-center text-xs text-vw-grey">
            <p className="flex items-center justify-center gap-1.5">
              <MoveHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
              Swipe to see the next photo
            </p>
            <p className="flex items-center justify-center gap-1.5">
              <ZoomIn className="h-4 w-4 shrink-0" aria-hidden="true" />
              Tap a photo to enlarge
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-vw-blue ring-1 ring-black/[0.08]">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      ) : (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-vw-grey" style={photoControlsStyle}>
          <ZoomIn className="h-4 w-4 shrink-0" aria-hidden="true" />
          Tap the photo to enlarge
        </p>
      )}

      <div className="mx-auto mt-4 grid max-w-md" style={photoCaptionStyle}>
        {photos.map((photo, index) => (
          <p
            key={photo.description}
            aria-hidden={index !== 0}
            className={`col-start-1 row-start-1 whitespace-pre-line break-words text-center text-sm leading-snug text-gray-900 ${index === 0 ? "" : "invisible opacity-0"}`}
          >
            {photo.description}
          </p>
        ))}
      </div>
    </div>
  );
};

type InspectionReportMockProps = {
  scrollY: number;
};

export const InspectionReportMock: React.FC<InspectionReportMockProps> = ({ scrollY }) => {
  const approveAllStyle = useBounceStyle(scrollY, 1290, 0);

  return (
  <div
    className="inspection-report-mock-root relative mx-auto w-[390px] overflow-hidden bg-white font-sans text-gray-900"
    style={{ height: VIEWPORT_HEIGHT }}
  >
    <div
      className="absolute inset-x-0 top-0"
      style={{ height: REPORT_TOTAL_HEIGHT, translate: `0 ${-scrollY}px` }}
    >
      <header
        className="relative mx-auto max-w-3xl px-5 pb-2"
        style={{ paddingTop: 68 }}
      >
        <div style={useBounceStyle(scrollY, 0, 140)}>
          <div className="relative flex items-center gap-3">
            <Avatar
              size="h-10 w-10"
              src="images/inspection/vw-logo-navy.jpeg"
              alt={DUMMY.workshop}
              fallback="VW"
              className="rounded-lg bg-white ring-1 ring-vw-grey/15"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-vw-blue">{DUMMY.workshop}</p>
              <p className="truncate text-xs text-vw-grey">Service Inspection Report</p>
            </div>
          </div>
        </div>
        <div
          className="relative -mx-5 mt-3 flex min-h-[8rem] items-center justify-center"
          style={useBounceStyle(scrollY, 0, 160)}
        >
          <Img
            src={staticFile("images/inspection/work-in-progress.jpg")}
            alt=""
            className="max-h-72 w-full object-contain mix-blend-multiply"
          />
        </div>
      </header>

      <div className="relative mx-auto mt-4 max-w-3xl px-4">
        <div style={useBounceStyle(scrollY, 0, 180)}>
          {IS_CANCELLED ? (
            <div className="rounded-2xl bg-white p-5 text-sm font-medium text-vw-grey shadow-lg ring-1 ring-vw-grey/10">
              This order has been cancelled.
            </div>
          ) : (
          <div className="rounded-3xl bg-vw-blue p-4 text-white shadow-lg shadow-vw-blue/20">
            <div className="flex items-center gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">Current progress</p>
                <p className="text-xs text-white/70">Step 1 of 4</p>
              </div>
            </div>
            <p className="mt-3 text-xl font-bold leading-tight text-white">Work In Process</p>
            <div className="mt-3 flex gap-1.5" role="progressbar" aria-label="Service progress">
              {[0, 1, 2, 3].map((step) => (
                <div key={step} className={`h-1.5 flex-1 rounded-full ${step === 0 ? "bg-white" : "bg-white/25"}`} />
              ))}
            </div>
            <div className="mt-3 flex justify-between gap-4 text-xs">
              <div><p className="font-bold text-white">Appointment</p><p className="text-white/70">Done</p></div>
              <div className="text-right"><p className="font-bold text-white">Quality Control</p><p className="text-white/70">Next</p></div>
            </div>
          </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3" style={useBounceStyle(scrollY, 0, 200)}>
          <div className="min-w-0 rounded-xl bg-vw-grey-light/70 px-4 py-3">
            <p className="text-xs text-vw-grey">License Number</p>
            <p className="mt-0.5 truncate text-sm font-bold text-gray-900">{DUMMY.plate}</p>
          </div>
          <div className="min-w-0 rounded-xl bg-vw-grey-light/70 px-4 py-3">
            <p className="text-xs text-vw-grey">Customer</p>
            <p className="mt-0.5 truncate text-sm font-bold text-gray-900">{DUMMY.customer}</p>
          </div>
        </div>

        <button
          type="button"
          className="group flex min-h-[52px] w-full items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-left text-[13px] font-semibold text-amber-900 shadow-sm"
          style={{ ...useBounceStyle(scrollY, 0, 220), marginTop: 24 }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 truncate">5 items to decide</span>
          <span className="inline-flex min-h-[34px] shrink-0 items-center gap-1 rounded-full bg-amber-700 px-3 text-[13px] font-bold text-white">
            Review <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>

        <section className="mt-8" style={useBounceStyle(scrollY, 100, 0)}>
          <h2 className="text-base font-bold text-gray-900" style={useBounceStyle(scrollY, 170, 0)}>Inspection video</h2>
          <div className="mt-3 grid w-full place-items-center overflow-hidden rounded-2xl bg-black" style={{ ...useBounceStyle(scrollY, 240, 0), height: 202, aspectRatio: "16 / 9" }}>
            <span className="grid h-10 w-14 place-items-center rounded-xl bg-[#FF0033] shadow-md">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="white">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
          </div>
          <div className="mt-5 flex items-start gap-3" style={useBounceStyle(scrollY, 310, 0)}>
            <Avatar size="h-8 w-8" alt={DUMMY.technician} fallback="BK" />
            <div className="min-w-0">
              <p className="whitespace-pre-line break-words text-sm leading-relaxed text-gray-700">{DUMMY.technicianMessage}</p>
              <p className="mt-1.5 text-xs text-vw-grey">{DUMMY.technician} · Chief Technician</p>
            </div>
          </div>
        </section>

        <div className="mt-8" style={useBounceStyle(scrollY, 380, 0)}>
          <section aria-labelledby="repair-results-title">
            <h2 id="repair-results-title" className="text-base font-bold text-gray-900" style={useBounceStyle(scrollY, 450, 0)}>Repair results</h2>
            <p className="mt-1 text-sm text-vw-grey" style={useBounceStyle(scrollY, 520, 0)}>See how the issues shown in the video above have been fixed.</p>
            <RepairImageStackMock photos={DUMMY.photos} scrollY={scrollY} />
          </section>
        </div>

        <div className="my-6" />

        <section className="scroll-mt-20" style={useBounceStyle(scrollY, 1150, 0)}>
          <div className="flex flex-wrap items-center justify-between gap-2" style={useBounceStyle(scrollY, 1220, 0)}>
            <h2 className="text-base font-bold text-gray-900">Inspection items</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">Estimated Price</span>
          </div>
          {!COLLAPSE_ITEMS && (
            <div className="mt-3 grid grid-cols-2 gap-2" style={approveAllStyle}>
              <button type="button" className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-approved/60 bg-white px-3 text-[13px] font-semibold text-approved">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> Approve all
              </button>
              <button type="button" className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-gray-400 bg-white px-3 text-[13px] font-semibold text-gray-700">
                <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> Reject all
              </button>
            </div>
          )}
          {COLLAPSE_ITEMS ? (
            <div className={`mt-4 px-4 ${SOFT_CARD}`}>
              <div className="flex min-h-[48px] items-center justify-between text-sm font-semibold text-gray-900">
                Inspection items ({DUMMY.items.length})
                <ChevronDown className="h-4 w-4 text-vw-grey" aria-hidden="true" />
              </div>
            </div>
          ) : (
          <ul
            className="mt-3 space-y-3"
            style={{ listStyle: "none", padding: 0, marginLeft: 0, marginRight: 0 }}
          >
            {DUMMY.items.map((item, index) => (
              <InspectionItemCard key={item.name} item={item} index={index} scrollY={scrollY} />
            ))}
          </ul>
          )}

          <div className={`mt-8 p-5 ${SOFT_CARD}`} style={useBounceStyle(scrollY, 1840, 0)}>
            <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-gray-900">Order summary</h3></div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3"><dt className="text-vw-grey">Price before discount</dt><dd className="font-semibold text-gray-900"><Rupiah value={DUMMY.priceBeforeDiscount} /></dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-vw-grey">Discount</dt><dd className="font-semibold text-approved">−<Rupiah value={DUMMY.discount} /></dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-vw-grey">Subtotal</dt><dd className="font-semibold text-gray-900"><Rupiah value={DUMMY.subtotal} /></dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-vw-grey">VAT (11%)</dt><dd className="font-semibold text-gray-900"><Rupiah value={DUMMY.vat} /></dd></div>
              <div className="border-t border-dashed border-vw-grey/30" />
              <div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-gray-900">Estimated total</span><Rupiah value={DUMMY.estimatedTotal} className="text-2xl font-bold text-vw-blue" /></div>
            </dl>
          </div>
          <p className="mt-2 text-xs italic text-vw-grey" style={useBounceStyle(scrollY, 1910, 0)}>These prices are estimates and may change until finalized after inspection review.</p>
          <p className="mt-3 text-center text-xs text-vw-grey" style={useBounceStyle(scrollY, 1980, 0)}>You can decide on some items now and come back later for the rest.</p>
        </section>

        <div className="my-6" />

        <section style={useBounceStyle(scrollY, 2050, 0)}>
          <SectionTitle count={0}>Estimation form</SectionTitle>
          <div className="mt-3">
            <div style={useBounceStyle(scrollY, 2110, 0)}><PendingNotice title="Estimation form is being prepared" text="It will appear here automatically once it's ready." /></div>
          </div>
        </section>

        {(IS_INVOICE_STAGE || IS_COMPLETED) && (
          <>
            <div className="my-6" />
            <section>
              <SectionTitle>Invoice form</SectionTitle>
              <div className="mt-3 flex items-center gap-3 rounded-3xl bg-white p-3.5 ring-1 ring-black/[0.04] shadow-[0_12px_40px_-16px_rgba(22,27,89,0.22)]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-vw-grey-light text-vw-blue"><FileText className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-gray-900">View Invoice</span><span className="block truncate text-xs text-vw-grey">No. {DUMMY.invoiceNumber} · PDF</span></span>
                <ChevronRight className="h-4 w-4 text-vw-blue" aria-hidden="true" />
              </div>
            </section>
          </>
        )}

        {IS_INVOICE_STAGE && (
          <>
            <div className="my-6" />
            <section>
              <SectionTitle>Payment</SectionTitle>
              <p className="mt-2 text-sm text-vw-grey">Transfer to one of the accounts below, then upload your receipt.</p>
              <div className={`mt-4 p-5 ${SOFT_CARD}`}>
                <p className="text-base font-bold text-gray-900">Payment details</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3"><dt className="text-vw-grey">Invoice number</dt><dd className="font-semibold text-gray-900">{DUMMY.invoiceNumber}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-vw-grey">Bill to</dt><dd className="text-right font-semibold text-gray-900">{DUMMY.billTo}</dd></div>
                </dl>
                <div className="my-4 border-t border-dashed border-vw-grey/30" />
                <div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-gray-900">Amount due</span><Rupiah value={DUMMY.estimatedTotal} className="text-2xl font-bold text-vw-blue" /></div>
                <p className="mt-2 text-xs text-vw-grey">Please follow the amount stated on your invoice.</p>
              </div>
              <div className={`mt-4 divide-y divide-dashed divide-vw-grey/30 p-5 ${SOFT_CARD}`}>
                {DUMMY.bankAccounts.map((account) => (
                  <div key={account.bank} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 ring-1 ring-black/[0.06]"><Landmark className="h-5 w-5 text-vw-blue" aria-hidden="true" /></span>
                      <div className="min-w-0"><p className="text-sm font-bold text-gray-900">{account.bank}</p><p className="text-xs text-vw-grey">Account name</p><p className="text-sm font-semibold text-gray-900">{account.holder}</p></div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3"><div><p className="text-xs text-vw-grey">Account number</p><p className="mt-0.5 break-all text-xl font-bold tracking-wide text-gray-900">{account.number}</p></div><span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-vw-grey/30 bg-white px-3.5 text-xs font-semibold text-gray-900"><Copy className="h-4 w-4" aria-hidden="true" />Copy</span></div>
                  </div>
                ))}
              </div>
              <div className={`mt-4 p-5 ${SOFT_CARD}`}>
                <p className="text-sm font-semibold text-gray-900">Payment receipt</p>
                <p className="mt-1 text-sm text-vw-grey">Upload your transfer proof.</p>
                <div className="mt-3 flex flex-col gap-2"><div className="w-full rounded-xl border border-vw-grey/20 p-3 text-xs text-vw-grey">Choose a PDF or image file</div><span className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-full bg-vw-blue px-5 text-sm font-semibold text-white"><Upload className="h-4 w-4" aria-hidden="true" />Upload</span></div>
              </div>
            </section>
          </>
        )}

        {IS_COMPLETED && (
          <>
            <div className="my-6" />
            <section>
              <div className={`p-5 text-center ${SOFT_CARD}`}>
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-approved/10"><CheckCircle2 className="h-5 w-5 text-approved" aria-hidden="true" /></span>
                <h2 className="mt-3 text-base font-bold text-gray-900">Thank You!</h2>
                <p className="mt-1 text-sm text-gray-700">Thank you for trusting VW PIK with your vehicle service. We hope to see you again soon.</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex min-h-[56px] items-center gap-3 rounded-3xl bg-vw-blue p-4 text-sm text-white shadow-md shadow-vw-blue/25"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><Phone className="h-4 w-4" aria-hidden="true" /></span><span><span className="block font-semibold">Emergency Road Assist (ERA)</span><span className="text-xs text-white/80">+62 21 555 0101</span></span></div>
                <div className="flex min-h-[56px] items-center gap-3 rounded-3xl bg-vw-blue p-4 text-sm text-white shadow-md shadow-vw-blue/25"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><WhatsAppIcon /></span><span><span className="block font-semibold">Book your next service</span><span className="text-xs text-white/80">Chat with us on WhatsApp</span></span></div>
              </div>
            </section>
          </>
        )}

        <div className="my-6" />

        <section>
          <div className={`p-4 ${SOFT_CARD}`} style={useBounceStyle(scrollY, 2180, 0)}>
            <div className="flex items-center gap-3">
              <Avatar size="h-11 w-11" alt={DUMMY.advisor} fallback="RP" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{DUMMY.advisor}</p>
                <p className="truncate text-xs text-vw-grey">Service Advisor</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-600">If you would like your Service Advisor to contact you, please click the button below.</p>
              <span className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-vw-blue px-3 text-sm font-semibold text-white">
                <WhatsAppIcon /> Send Message
              </span>
            </div>
          </div>
        </section>

        <div className="my-6" />

        <section className={`p-5 ${SOFT_CARD}`} style={useBounceStyle(scrollY, 2240, 0)}>
          <h2 className="text-base font-bold text-gray-900" style={useBounceStyle(scrollY, 2300, 0)}>Workshop location</h2>
          <div className="mt-3 flex items-start gap-3 rounded-2xl bg-vw-grey-light/70 px-3 py-3" style={useBounceStyle(scrollY, 2360, 0)}>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-vw-blue" aria-hidden="true" />
            <p className="min-w-0 text-xs font-semibold text-gray-900">{DUMMY.address}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2" style={useBounceStyle(scrollY, 2400, 0)}>
            <span className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-vw-grey/30 px-4 text-xs font-semibold text-gray-900"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />Open in Maps</span>
            <span className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-vw-grey/30 px-4 text-xs font-semibold text-gray-900"><Globe className="h-3.5 w-3.5" aria-hidden="true" />Visit Website</span>
            <span className="col-span-2 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-vw-blue px-4 text-xs font-semibold text-vw-blue"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />Book a service</span>
          </div>
        </section>

      </div>

      {/* Keep scrolled content below the phone camera cutout. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 z-30 bg-white"
        style={{ height: 56 }}
      />

    </div>
  </div>
  );
};

const WhatsAppIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="M3 21l1.65-4.9A9 9 0 1 1 8 19.4L3 21z" />
    <g transform="translate(6.6 6.6) scale(0.45)" strokeWidth="3.6">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </g>
  </svg>
);
