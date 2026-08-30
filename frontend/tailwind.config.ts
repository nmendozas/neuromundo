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
        // Azul profundo / marino (confianza, profesionalismo)
        navy: {
          50: "#F0F4FA",
          100: "#DCE7F3",
          200: "#B9CDE6",
          300: "#8FACD3",
          400: "#5F85B8",
          500: "#3A6395",
          600: "#284B77",
          700: "#1C3860",
          800: "#142B4D",
          900: "#0C1F3B",
          950: "#07152B",
        },
        // Verde esmeralda / turquesa clínico (salud, vitalidad)
        clinical: {
          50: "#EFFCF7",
          100: "#D8F6EC",
          200: "#B0ECDA",
          300: "#7ADCC2",
          400: "#3DC6A4",
          500: "#14A989",
          600: "#0E8A71",
          700: "#0F6E5C",
          800: "#10574B",
          900: "#11483E",
          950: "#072E27",
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
