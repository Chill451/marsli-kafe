/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        background: '#0B0A0E',     // Deep space black
        surface: '#120F18',        // Slightly lighter dark for cards
        card: '#1A1622',           // Card backgrounds
        mars_orange: '#C86B3C',    // Primary rusty orange
        dusty_red: '#9F4A3A',      // Darker red for depth
        sand_beige: '#E8CFA8',     // For secondary text/accents
        cream_text: '#F5E6D3',     // Primary text color
        muted_text: '#A69B97',     // Muted text
        accent: '#F09A5B',         // Bright accent orange
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}
