// Editor theme registry. Retro is the built-in default (:root in retro.css);
// the rest override the palette + structural tokens via [data-theme].

export type ThemeId = "retro" | "modern" | "linear" | "gmail";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  description: string;
  /** Preview swatches: [chrome/title, surface, accent]. */
  preview: { bar: string; barText: string; surface: string; accent: string; ink: string };
}

export const THEMES: ThemeMeta[] = [
  {
    id: "retro",
    name: "Retro",
    description: "Windows 3.1 monochrome chrome. Beveled, pixel-crisp, all business.",
    preview: { bar: "#000080", barText: "#ffffff", surface: "#c0c0c0", accent: "#000080", ink: "#000000" },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean slate neutrals with an indigo accent and soft rounded chrome.",
    preview: { bar: "#4f46e5", barText: "#ffffff", surface: "#f4f5f7", accent: "#4f46e5", ink: "#1f2430" },
  },
  {
    id: "linear",
    name: "Linear",
    description: "Dark, minimal, low-contrast surfaces with a violet accent.",
    preview: { bar: "#23253a", barText: "#e6e7ee", surface: "#191a23", accent: "#5e6ad2", ink: "#e6e7ee" },
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Airy light workspace, generous radius, signature red accent.",
    preview: { bar: "#d93025", barText: "#ffffff", surface: "#f6f8fc", accent: "#d93025", ink: "#202124" },
  },
];

const STORAGE_KEY = "gamefoo-tools-theme";
const DEFAULT_THEME: ThemeId = "retro";

export function isThemeId(v: unknown): v is ThemeId {
  return v === "retro" || v === "modern" || v === "linear" || v === "gmail";
}

export function loadTheme(): ThemeId {
  const saved = localStorage.getItem(STORAGE_KEY);
  return isThemeId(saved) ? saved : DEFAULT_THEME;
}

export function applyTheme(theme: ThemeId): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}
