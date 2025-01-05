/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    function ({ addBase, theme }) {
      const colors = theme('colors')
      const variables = Object.entries(colors).reduce((acc, [key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([shade, hex]) => {
            acc[`--color-${key}-${shade}`] = hex
          })
        } else {
          acc[`--color-${key}`] = value
        }
        return acc
      }, {})

      addBase({
        ':root': variables
      })
    }
  ]
}
