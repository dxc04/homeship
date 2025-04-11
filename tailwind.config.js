/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./views/**/*.{js,ts,jsx,tsx,vto,svg}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
