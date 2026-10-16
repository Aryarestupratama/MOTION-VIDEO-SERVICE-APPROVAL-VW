// Tiga peran font (MOTION-DESIGN.md bagian 4). Hanya file ini yang memuat font.
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

export const headlineFont = loadPoppins("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const accentFont = loadInstrumentSerif("italic", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

export const labelFont = loadJetBrainsMono("normal", {
  weights: ["500"],
  subsets: ["latin"],
}).fontFamily;
