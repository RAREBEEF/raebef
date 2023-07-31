/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "5%",
        sm: "5%",
        md: "5%",
        lg: "5%",
        xl: "5%",
        "2xl": "5%",
      },
    },
    screens: {
      "2xl": { min: "1536px" },
      xl: { min: "1280px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      xs: { max: "500px" },
      "2xs": { max: "400px" },
    },
    extend: {
      keyframes: {
        skeleton: {
          "0%": { left: "-50%" },
          "100%": { left: "150%" },
        },
      },
      animation: {
        skeleton: "skeleton 1.5s 0.3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
