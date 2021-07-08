module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif']
    },
    extend: {
      scale: {
        '-1': '-1'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
