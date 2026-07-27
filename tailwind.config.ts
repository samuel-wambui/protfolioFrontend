import type { Config } from "tailwindcss";

type FontSizeValue = [fontSize: string, configuration: { lineHeight: string }];

const reducedFontSizes: Record<string, FontSizeValue> = {
  xs: ["0.5625rem", { lineHeight: "0.75rem" }],
  sm: ["0.65625rem", { lineHeight: "0.9375rem" }],
  base: ["0.75rem", { lineHeight: "1.125rem" }],
  lg: ["0.84375rem", { lineHeight: "1.3125rem" }],
  xl: ["0.9375rem", { lineHeight: "1.3125rem" }],
  "2xl": ["1.125rem", { lineHeight: "1.5rem" }],
  "3xl": ["1.40625rem", { lineHeight: "1.6875rem" }],
  "4xl": ["1.6875rem", { lineHeight: "1.875rem" }],
  "5xl": ["2.25rem", { lineHeight: "1" }],
  "6xl": ["2.8125rem", { lineHeight: "1" }],
  "7xl": ["3.375rem", { lineHeight: "1" }],
  "8xl": ["4.5rem", { lineHeight: "1" }],
  "9xl": ["6rem", { lineHeight: "1" }],
};

const reducedLineHeights: Record<string, string> = {
  3: "0.5625rem",
  4: "0.75rem",
  5: "0.9375rem",
  6: "1.125rem",
  7: "1.3125rem",
  8: "1.5rem",
  9: "1.6875rem",
  10: "1.875rem",
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
