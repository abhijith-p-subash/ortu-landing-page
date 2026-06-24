/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Color tokens are defined in src/index.css via the Tailwind v4 @theme
      // block (the source of truth). Kept here only for tooling that reads
      // the JS config; keep these in sync with @theme.
      colors: {
        bg: "#08090c",
        surface: "#13151b",
        raised: "#1c1f28",
        fg: "#ffffff",
        accent: {
          DEFAULT: "#ff8a3d", // brand orange
          hover: "#ff9a56",
        },
        sage: "#aeb291", // secondary accent
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
