const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter Variable'", ...defaultTheme.fontFamily.sans],
        passero: ["'Passero One'"],
        passion: ["'Passion One'"],
      },
      colors: {
        "dark-blue": "#1E3557",
        "bold-blue": "#0754C4",
        "bright-red": "#EE5151",
        "warning-yellow": "#FAC515",
        "warm-white": "#FAF7EE",
        "dark-cream": "#DDD9CB",
      },
    },
  },
  plugins: [],
};
