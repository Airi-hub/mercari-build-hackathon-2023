/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          50: "#ffffff",
          100:"#b3f3f7",
          200:"#87cbd6", //カテゴリー押す前
          300:"#4cdee9",
          400:"#a17d3e2",
          500:"#0098b0", //category等の文字、した
          600:"#0098b0", //検索のボタン
          700:"#007993",
          800:"#00b8cc", //header
          900:"#00b8cc" //itemの背景
        }
      },
      gridTemplateRows: {
        frame: '3rem 1fr 3rem',
      },
    },
  },
  plugins: [],
}

