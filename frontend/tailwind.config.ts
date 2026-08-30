import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azul navy / marino (confianza, profesionalismo) — alineado a NeuroMundo_Portafolio_Servicios.html
        navy: {
          50: "#EEF2F8",
          100: "#DDE4EE",
          200: "#B9C7DC",
          300: "#8FA3C1",
          400: "#6E87AC",
          500: "#4F81BB",
          600: "#3D6289",
          700: "#2C3952",
          800: "#1E2B42",
          900: "#17223A",
          950: "#0F1826",
        },
        // Dorado elegante (referencial premium) — alineado a NeuroMundo_Portafolio_Servicios.html
        gold: {
          50: "#F9F4E8",
          100: "#F3E9D3",
          200: "#E9D8AE",
          300: "#E3CB94",
          400: "#D5B374",
          500: "#C9A15C",
          600: "#B08A44",
          700: "#8F6F35",
          800: "#6E5529",
          900: "#4E3A1C",
          950: "#2E2310",
        },
        // Fondo papel crema del portafolio
        paper: {
          50: "#FBF9F5",
          100: "#F8F6F1",
          200: "#EFECE3",
          300: "#E3DFD3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(12, 31, 59, 0.04), 0 16px 32px rgba(12, 31, 59, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
