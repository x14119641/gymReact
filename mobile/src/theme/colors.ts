// src/theme/colors.ts
import { palette } from "./palette";

export type ThemeColors = {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  link: string;
  overlay: string;
  modal: string;
  shadow: string;
};

export const lightColors: ThemeColors = {
  bg: palette.ethereal100,
  card: palette.white,
  text: palette.neutral900,
  subtext: palette.neutral700,
  border: palette.ethereal200,
  accent: palette.primary400,   // orange highlight
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  link: palette.secondary400,
  overlay: "rgba(0,0,0,0.1)",
  modal: palette.white,
  shadow: "rgba(0,0,0,0.15)",
};

export const darkColors: ThemeColors = {
  bg: "#181818",
  card: "#1F1F1F",
  text: "#F7F7F7",
  subtext: "#CFCFCF",
  border: "#2A2A2A",
  accent: palette.primary600,   // deeper orange for dark
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  link: "#8C9EFF",
  overlay: "rgba(0,0,0,0.6)",
  modal: "#1F1F1F",
  shadow: "rgba(0,0,0,0.85)",
};
