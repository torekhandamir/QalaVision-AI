import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#071012",
        pearl: "#f5f7f3",
        civic: {
          cyan: "#65e3ff",
          mint: "#72f6b8",
          gold: "#f8d36b",
          coral: "#ff8d7a",
          plum: "#9b8cff"
        }
      },
      boxShadow: {
        glow: "0 0 42px rgba(101, 227, 255, 0.2)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.24)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 20%, rgba(101,227,255,0.18), transparent 32%), radial-gradient(circle at 80% 10%, rgba(114,246,184,0.13), transparent 28%), linear-gradient(135deg, rgba(7,16,18,0.98), rgba(13,28,30,0.94))"
      },
      fontFamily: {
        sans: ["Manrope", "Geist", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
