import { loadFont } from "@remotion/google-fonts/Poppins";

export const COLORS = {
  vwBlue: "#161E59",
  offWhite: "#F2F2F2",
  white: "#FFFFFF",
  approved: "#2E7D32",
  lightBlue: "#00B0F0",
} as const;

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
