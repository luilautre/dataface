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
        facebook: {
          blue: "#1877F2",
          dark: "#166FE5",
          light: "#E7F3FF",
          gray: "#F0F2F5",
          text: "#050505",
          muted: "#65676B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
