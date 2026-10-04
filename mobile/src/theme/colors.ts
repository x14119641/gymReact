export type SemanticThemeColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;

  text: string;
  textMuted: string;

  primary: string;
  primaryPressed: string;
  onPrimary: string;

  border: string;
  borderStrong: string;

  success: string;
  warning: string;
  danger: string;

  highlight: string;
  onHighlight: string;

  shadow: string;
};

// Migration debt: remove each legacy role after its last consumer migrates.
type LegacyThemeColors = {
  /** @deprecated Use background. */
  bg: string;
  /** @deprecated Use surface. */
  card: string;
  /** @deprecated Use textMuted. */
  subtext: string;
  /** @deprecated Use primary. */
  accent: string;
  /** @deprecated Use danger. */
  error: string;
};

export type ThemeColors = SemanticThemeColors & LegacyThemeColors;

// Provisional palette, not finalized branding. Adjust semantic values here.
const lightSemanticColors: SemanticThemeColors = {
  background: "#F4F6F4",
  surface: "#FFFFFF",
  surfaceSecondary: "#EDF2EE",

  text: "#1C2A1C",
  textMuted: "#526457",

  primary: "#007C41",
  primaryPressed: "#006333",
  onPrimary: "#FFFFFF",

  border: "#CBD5CD",
  borderStrong: "#7B8A7F",

  success: "#3E6A3D",
  warning: "#8A5700",
  danger: "#B42332",

  highlight: "#ADFF2F",
  onHighlight: "#1C2A1C",

  shadow: "rgba(0,0,0,0.18)",
};

const darkSemanticColors: SemanticThemeColors = {
  background: "#0C1310",
  surface: "#151F19",
  surfaceSecondary: "#202E25",

  text: "#E8F0EA",
  textMuted: "#A7B8AA",

  primary: "#4ADE80",
  primaryPressed: "#22C55E",
  onPrimary: "#0C1310",

  border: "#34463A",
  borderStrong: "#617D69",

  success: "#8DCB8B",
  warning: "#F2C166",
  danger: "#FF8A94",

  highlight: "#ADFF2F",
  onHighlight: "#1C2A1C",

  shadow: "rgba(0,0,0,0.6)",
};

function withLegacyColors(colors: SemanticThemeColors): ThemeColors {
  return {
    ...colors,
    bg: colors.background,
    card: colors.surface,
    subtext: colors.textMuted,
    accent: colors.primary,
    error: colors.danger,
  };
}

export const lightColors: ThemeColors = withLegacyColors(lightSemanticColors);
export const darkColors: ThemeColors = withLegacyColors(darkSemanticColors);
