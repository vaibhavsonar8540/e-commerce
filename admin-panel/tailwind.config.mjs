export default {
  theme: {
    screens: {
      xss: "400px",
      xs: "475px", // Custom extra small screen
      sm: "640px", // Small screen
      md: "768px", // Medium screen
      lg: "1024px", // Large screen
      xl: "1280px", // Extra large screen
      "2xl": "1536px", // 2X Large screen
      "3xl": "1720px",
    },
    extend: {
      colors: {
        primary: "#47230B",
        secondary: "#FF6B35",
        "mid-grey": "#757575",
        "light-cream": "#F9ECE5",
        "light-grey": "#F3F4F6",
        whitesmoke: "#F5F5F5",
        "off-white" : "#F8F8F8"
      },
      fontFamily: {
        raleway: ["var(--font-raleway)"],
        sans: ["var(--font-raleway)"],
        playfair : ["var(--font-playfair)"]
      },
    },
  },
};
