export type ThemeColor = (typeof THEME_COLORS)[number];

export const THEME_COLORS = [
  "green",
  "periwinkle",
  "mango",
  "blue",
  "pink",
] as const;

export const COLOR_CLASS: Record<ThemeColor, string> = {
  green: "[--color-theme:var(--color-theme-green)]",
  periwinkle: "[--color-theme:var(--color-theme-periwinkle)]",
  mango: "[--color-theme:var(--color-theme-mango)]",
  blue: "[--color-theme:var(--color-theme-blue)]",
  pink: "[--color-theme:var(--color-theme-pink)]",
};

// Keep in sync with the page theme colors in styles/main.css for OG images.
export const THEME_HEX: Record<ThemeColor, string> = {
  pink: "#e08dac",
  green: "#94bfa7",
  mango: "#f4b886",
  periwinkle: "#7f7ec9",
  blue: "#72a1e5",
};
