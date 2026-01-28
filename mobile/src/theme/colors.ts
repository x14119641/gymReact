// src/theme/colors.ts
import { palette } from "./palette";

export type ThemeColors = {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  title: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  link: string;
  overlay: string;
  modal: string;
  shadow: string;
  console: {
    bg: string;
    border: string;
    chipBg: string;
    chipBorder: string;
    prompt: string; // "$ status"
    value: string; // info values
    note: string; // notices
  };
};
export const lightColors: ThemeColors = {
  bg: "#F0EEE9", // Cloud Dancer-ish :contentReference[oaicite:2]{index=2}
  card: "#FFFFFF",
  text: "#102A43",
  subtext: "#486581",
  title: "#102A43",
  border: "rgba(16, 42, 67, 0.18)",

  accent: "#0077B6",
  success: "#2A9D8F",
  warning: "#F4A261",
  error: "#E63946",
  link: "#2563EB",

  overlay: "rgba(0,0,0,0.06)",
  modal: "#FFFFFF",
  shadow: "rgba(0,0,0,0.18)",

  console: {
    bg: "#F7F6F2", // solid “paper tint” (not transparent)
    border: "rgba(16, 42, 67, 0.14)",
    chipBg: "rgba(0, 119, 182, 0.10)",
    chipBorder: "rgba(0, 119, 182, 0.28)",
    prompt: "#0077B6",
    value: "#00A896",
    note: "#F4A261",
  },
};

export const darkColors: ThemeColors = {
  // Base
  bg: "#0B1E2D", // deep blue-black
  card: "#101820", // solid dark card
  text: "#CFE9F5", // misty cyan-white
  subtext: "rgba(207, 233, 245, 0.75)",
  title: "#102A43",
  border: "rgba(0, 180, 150, 0.28)",

  // Accents
  accent: "#7FDBFF", // soft cyan pop
  success: "#2ECF9A",
  warning: "#FFD084",
  error: "#FF6B6B",
  link: "#7AB6FF",

  // Effects
  overlay: "rgba(255,255,255,0.06)",
  modal: "rgba(255,255,255,0.04)",
  shadow: "rgba(0,0,0,0.6)",

  // Console surface (dark)
  console: {
    bg: "rgba(8, 12, 20, 0.55)", // smoky glass
    border: "rgba(0, 180, 150, 0.28)",
    chipBg: "rgba(0, 231, 179, 0.10)",
    chipBorder: "rgba(0, 231, 179, 0.35)",
    prompt: "#7FFF7F",
    value: "#00BFFF",
    note: "#FFD084",
  },
};
