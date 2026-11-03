/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        "surface-alt": "rgb(var(--color-surface-alt) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--color-ink-soft) / <alpha-value>)",
        "mid-gray": "rgb(var(--color-mid-gray) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          pressed: "rgb(var(--color-primary-pressed) / <alpha-value>)",
          soft: "rgb(var(--color-primary-soft) / <alpha-value>)",
          ring: "rgb(var(--color-primary-ring) / <alpha-value>)",
        },
        destructive: "rgb(var(--color-destructive) / <alpha-value>)",
      },
      borderRadius: {
        nested: "10px",
        pill: "18px",
        card: "24px",
      },
      spacing: {
        card: "20px",
      },
      boxShadow: {
        card: "0 0 0 1px rgba(23,23,23,0.05), 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
