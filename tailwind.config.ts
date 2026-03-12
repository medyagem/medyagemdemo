import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'hero-bg',
    'bg-hero-bg',
    'bg-surface',
    'hero-bg-anim',
    'bg-brand-glow',
    'bg-brand-primary',
    'hero-content-wrapper'
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--color-bg)",
          secondary: "var(--color-bg-secondary)",
        },
        foreground: "var(--color-text-main)",
        main: "var(--color-text-main)",
        desc: "var(--color-text-desc)",
        meta: "var(--color-text-meta)",
        disabled: "var(--color-text-disabled)",
        heading: "var(--color-text-heading)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        brand: {
          primary: "#2D6BFF",
          "primary-blue": "#2D6BFF",
          "secondary-blue": "#5DA9FF",
          purple: "#8B3DFF",
          violet: "#5A4DFF",
          "neon-accent": "#7C8CFF"
        },
        state: {
          "success": "#16C784",
          "warning": "#F5A623",
          "error": "#FF4D4F",
          "info": "#2D6BFF"
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-primary": "linear-gradient(135deg, #2D6BFF 0%, #5A4DFF 45%, #8B3DFF 100%)",
        "brand-glow": "linear-gradient(135deg, #5DA9FF 0%, #8B3DFF 100%)",
        "hero-bg": "linear-gradient(180deg, #0A0A0F 0%, #111321 100%)"
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
      },
      boxShadow: {
        "hover-glow": "0 0 20px rgba(93,169,255,0.25), 0 0 40px rgba(139,61,255,0.2)"
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 0.3s ease-out",
      }
    },
  },
  plugins: [],
};
export default config;
