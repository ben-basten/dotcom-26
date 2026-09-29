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
