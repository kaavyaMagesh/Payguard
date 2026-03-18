export const Colors = {
  primary: "#00C853",
  primaryDark: "#00A041",
  primaryLight: "#E8F5E9",
  accent: "#FFD600",
  accentLight: "#FFF9C4",
  background: "#F7F9F7",
  surface: "#FFFFFF",
  surfaceSecondary: "#F2F4F2",
  text: "#0D1B0F",
  textSecondary: "#5A6B5C",
  textMuted: "#9BA89C",
  border: "#E2EBE3",
  success: "#00C853",
  warning: "#FFD600",
  danger: "#FF5252",
  info: "#2196F3",
  card: "#FFFFFF",
  shadow: "rgba(0, 0, 0, 0.08)",
  overlay: "rgba(0, 0, 0, 0.5)",

  tier: {
    basic: { bg: "#E8F5E9", text: "#2E7D32", badge: "#4CAF50" },
    standard: { bg: "#E3F2FD", text: "#1565C0", badge: "#1E88E5" },
    premium: { bg: "#FFF9C4", text: "#F57F17", badge: "#FFD600" },
  },

  trigger: {
    aqi: "#FF7043",
    rain: "#1E88E5",
    heat: "#FF8F00",
    curfew: "#7E57C2",
    flood: "#0277BD",
  },

  gradient: {
    hero: ["#1B5E20", "#2E7D32", "#388E3C"] as const,
    card: ["#FFFFFF", "#F7FBF7"] as const,
    premium: ["#F57F17", "#FFD600"] as const,
    standard: ["#1565C0", "#42A5F5"] as const,
    basic: ["#2E7D32", "#66BB6A"] as const,
  },
};

export default Colors;
