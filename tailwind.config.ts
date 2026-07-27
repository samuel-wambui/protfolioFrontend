import type { Config } from "tailwindcss";

type FontSizeValue = [fontSize: string, configuration: { lineHeight: string }];

const reducedFontSizes: Record<string, FontSizeValue> = {
  xs: ["0.61875rem", { lineHeight: "0.825rem" }],
  sm: ["0.721875rem", { lineHeight: "1.03125rem" }],
  base: ["0.825rem", { lineHeight: "1.2375rem" }],
  lg: ["0.928125rem", { lineHeight: "1.44375rem" }],
  xl: ["1.03125rem", { lineHeight: "1.44375rem" }],
  "2xl": ["1.2375rem", { lineHeight: "1.65rem" }],
  "3xl": ["1.546875rem", { lineHeight: "1.85625rem" }],
  "4xl": ["1.85625rem", { lineHeight: "2.0625rem" }],
  "5xl": ["2.475rem", { lineHeight: "1" }],
  "6xl": ["3.09375rem", { lineHeight: "1" }],
  "7xl": ["3.7125rem", { lineHeight: "1" }],
  "8xl": ["4.95rem", { lineHeight: "1" }],
  "9xl": ["6.6rem", { lineHeight: "1" }],
};

const reducedLineHeights: Record<string, string> = {
  3: "0.61875rem",
  4: "0.825rem",
  5: "1.03125rem",
  6: "1.2375rem",
  7: "1.44375rem",
  8: "1.65rem",
  9: "1.85625rem",
  10: "2.0625rem",
};

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: reducedFontSizes,
      lineHeight: reducedLineHeights,
      colors: {
        navy: {
          950: "#0B1120",
          900: "#111827",
          800: "#172033",
        },
        electric: {
          500: "#3B82F6",
          600: "#2563EB",
        },
        success: {
          500: "#10B981",
        },
      },
      boxShadow: {
        glow: "0 0 44px rgba(59, 130, 246, 0.24)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
