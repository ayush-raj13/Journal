/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        'varela-round': ['Varela Round', 'sans-serif']

      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
