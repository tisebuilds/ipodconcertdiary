import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        /** LCD / menu / list — Chicago-adjacent system stack (see globals.css) */
        ipod: ["var(--font-ipod-ui)"],
      },
    },
  },
  plugins: [],
};

export default config;
