import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        "auto-fill-32": "repeat(auto-fill, minmax(128px, 1fr))",
      },
      gridTemplateRows: {
        "auto-fill-32": "repeat(auto-fill, minmax(128px, 1fr))",
      },
      colors: {
        red: {
          50: "#FCF3F4",
          100: "#F9E7E8",
          200: "#F1CBCE",
          300: "#E9AAB0",
          400: "#DD7E86",
          500: "#C4343F",
          600: "#B5303B",
          700: "#A52C36",
          800: "#8D252E",
          900: "#751F26",
          950: "#5D191E",
        },
        orange: {
          50: "#FEF5F1",
          100: "#FDEFE7",
          200: "#FBD9C6",
          300: "#F9C5AA",
          400: "#F6AC84",
          500: "#F28B54",
          600: "#EF6F2A",
          700: "#DF5911",
          800: "#B94A0E",
          900: "#89370A",
          950: "#5F2607",
        },
        yellow: {
          50: "#FFFBF0",
          100: "#FFF7E0",
          200: "#FFF0C2",
          300: "#FFE699",
          400: "#FFDB70",
          500: "#FFD047",
          600: "#F5B800",
          700: "#D6A100",
          800: "#B38600",
          900: "#806000",
          950: "#614900",
        },
        lime: {
          50: "#F6FCF3",
          100: "#F0FAEA",
          200: "#DFF4D2",
          300: "#CDEEB9",
          400: "#B9E79C",
          500: "#A3E07E",
          600: "#79D142",
          700: "#62B92D",
          800: "#519825",
          900: "#3D731C",
          950: "#2A4E13",
        },
        green: {
          50: "#F4FBF5",
          100: "#ECF8EF",
          200: "#D6F0DC",
          300: "#BFE8C9",
          400: "#A5DEB3",
          500: "#89D49B",
          600: "#62C679",
          700: "#40B05A",
          800: "#35924B",
          900: "#266936",
          950: "#1A4724",
        },
        cyan: {
          50: "#F0FAF9",
          100: "#E0F5F2",
          200: "#BAE8E2",
          300: "#90DAD0",
          400: "#62CBBD",
          500: "#3BB3A3",
          600: "#35A193",
          700: "#2F8E81",
          800: "#267369",
          900: "#1C544D",
          950: "#143D38",
        },
        sky: {
          50: "#F1F8FE",
          100: "#E8F4FD",
          200: "#CCE7FA",
          300: "#ABD7F7",
          400: "#8AC8F4",
          500: "#5EB3F0",
          600: "#3BA3ED",
          700: "#158EE5",
          800: "#1174BB",
          900: "#0D5487",
          950: "#093A5D",
        },
        blue: {
          50: "#F3F5FC",
          100: "#E7EBF8",
          200: "#D0D6F1",
          300: "#B4BFE9",
          400: "#91A0DF",
          500: "#6278D1",
          600: "#556DCD",
          700: "#3E59C6",
          800: "#3148A6",
          900: "#233376",
          950: "#182453",
        },
        purple: {
          50: "#F6F3FB",
          100: "#F0EBF9",
          200: "#DBD0F1",
          300: "#C6B4E9",
          400: "#AB91DE",
          500: "#8662D0",
          600: "#7B52CB",
          700: "#6C3FC5",
          800: "#5831A5",
          900: "#43267E",
          950: "#2E1A56",
        },
        magenta: {
          50: "#FCF3F9",
          100: "#F9EBF6",
          200: "#F1D0E9",
          300: "#E9B4DC",
          400: "#E094CD",
          500: "#D162B6",
          600: "#CB4DAC",
          700: "#B93699",
          800: "#9A2D7F",
          900: "#6E205B",
          950: "#531844",
        },
        gray: {
          50: "#F0EFF5",
          100: "#E1E0EB",
          200: "#C1BED5",
          300: "#A39FC1",
          400: "#8680AD",
          500: "#696298",
          600: "#514C76",
          700: "#3C3857",
          800: "#29263B",
          900: "#13121C",
          950: "#0B0A10",
        },
        black: {
          50: "#5A5482",
          100: "#56507C",
          200: "#4D4870",
          300: "#454063",
          400: "#3A3654",
          500: "#312E47",
          600: "#29263B",
          700: "#201E2E",
          800: "#181622",
          900: "#0D0C13",
          950: "#09080C",
        },
        white: {
          50: "#EDECF3",
          100: "#E4E3ED",
          200: "#D6D4E3",
          300: "#C4C1D7",
          400: "#B2AECB",
          500: "#A19CBF",
          600: "#8F89B3",
          700: "#807AA9",
          800: "#6E679D",
          900: "#615A8B",
          950: "#5A5482",
        },
        primary: {
          dark: "#3E59C6", // Blue 700
          light: "#91A0DF", // Blue 
        },
        secondary: {
          dark: "#2F8E81", // Cyan 700
          light: "#62CBBD", // Cyan 
        },
        background: {
          dark: "#13121C", // Gray 900
          light: "#E1E0EB", // Gray 100
        },
        text: {
          dark: "#E1E0EB", // Gray 100
          light: "#29263B", // gray 800
        },
        error: {
          dark: "#A52C36", // Red 700
          light: "#DD7E86", // Red 
        },
        warning: {
          dark: "#DF5911", // Orange 700
          light: "#F6AC84", // Orange 400
        },
        success: {
          dark: "#62B92D", // Lime 700
          light: "#B9E79C", // Lime 
        },
        info: {
          dark: "#158EE5", // Cyan 700
          light: "#8AC8F4", // Cyan 
        },
      },
    },
  },
  plugins: [],
};
export default config;
