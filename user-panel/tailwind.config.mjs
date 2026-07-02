module.exports = {
  theme: {
    screens: {
      'xs': '475px',     // Custom extra small screen
      'sm': '640px',     // Small screen
      'md': '768px',     // Medium screen
      'lg': '1024px',    // Large screen
      'xl': '1280px',    // Extra large screen
      '2xl': '1536px',   // 2X Large screen
    },
    extend: {
      colors: {
        primary: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        secondary: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
    },
  },
}