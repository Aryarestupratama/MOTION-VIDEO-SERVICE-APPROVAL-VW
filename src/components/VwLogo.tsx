import React from "react";
import { Img, staticFile } from "remotion";

// Aset public/vw-logo-white.png berukuran 666x375 dengan banyak ruang kosong.
// Emblem sebenarnya hanya kotak (246,100)-(420,275). Komponen ini memotong
// tepat ke emblem supaya ukuran logo bisa diatur lewat satu angka.
// Warna logo tidak diubah, tidak diputar, tidak diberi efek.
const SOURCE = { width: 666, height: 375 } as const;
const EMBLEM = { x: 246, y: 100, width: 174, height: 175 } as const;

type VwLogoProps = {
  /** Lebar emblem dalam piksel (tinggi mengikuti rasio asli). */
  size: number;
  style?: React.CSSProperties;
};

export const VwLogo: React.FC<VwLogoProps> = ({ size, style }) => {
  const scale = size / EMBLEM.width;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: EMBLEM.height * scale,
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <Img
        src={staticFile("vw-logo-white.png")}
        style={{
          position: "absolute",
          width: SOURCE.width * scale,
          height: SOURCE.height * scale,
          left: -EMBLEM.x * scale,
          top: -EMBLEM.y * scale,
          maxWidth: "none",
        }}
      />
    </div>
  );
};
