import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        panel: "rgba(255,255,255,0.07)",
        gobeOrange: "#F26522",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 44px rgba(77, 248, 255, 0.25)",
        orangeGlow: "0 0 36px rgba(255, 107, 47, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
