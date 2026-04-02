import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        anthracite: {
          50: "#f4f5f6",
          100: "#e2e4e7",
          200: "#c5c9ce",
          300: "#9ea4ac",
          400: "#717984",
          500: "#4b525c",
          600: "#3a4049",
          700: "#2f343c",
          800: "#23272e",
          900: "#1a1d22",
          950: "#121418",
        },
        navy: {
          50: "#e8eef7",
          100: "#c9d6eb",
          200: "#94a9cf",
          300: "#6b84b3",
          400: "#4a6494",
          500: "#354a78",
          600: "#2a3b61",
          700: "#1f2d4d",
          800: "#16233f",
          900: "#0f1930",
          950: "#0a1224",
        },
        gold: {
          50: "#fbf7ec",
          100: "#f3e8cc",
          200: "#e6cf9a",
          300: "#d4b066",
          400: "#c5963f",
          500: "#b3822f",
          600: "#9a6a28",
          700: "#7f5423",
          800: "#684520",
          900: "#563a1e",
          950: "#301f0f",
        },
        bronze: {
          50: "#f8f4ef",
          100: "#ebe0d2",
          200: "#d6c2a8",
          300: "#bc9f78",
          400: "#a68355",
          500: "#926d45",
          600: "#7d5a3c",
          700: "#684832",
          800: "#563c2c",
          900: "#473327",
          950: "#261a14",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 25px 60px -15px rgba(15, 25, 48, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
