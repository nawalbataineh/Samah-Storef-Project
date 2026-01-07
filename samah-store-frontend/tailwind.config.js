/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ══════════════════════════════════════════════════════════════════
      // GLOBAL FEMININE FASHION PALETTE (LOCKED)
      // Benchmark: Zara Women / Mango / & Other Stories
      // ══════════════════════════════════════════════════════════════════
      colors: {
        // Primary: Soft Rose
        rose: {
          50: '#FFF7F3',
          100: '#FFF1EC',
          200: '#F2C6CF',
          300: '#E7A6B2',
          400: '#D98A98',
          500: '#B54B63',
          600: '#9E3D53',
          700: '#872F43',
          800: '#702434',
          900: '#5A1B28',
        },
        // Background: Ivory & Cream
        ivory: {
          50: '#FFFAF8',
          100: '#FFF7F3',
          200: '#FFF1EC',
          300: '#FFE9E2',
          400: '#FFDFD5',
          500: '#F5D0C4',
        },
        // Accent: Elegant Berry
        berry: {
          50: '#FDF2F5',
          100: '#FCE7EC',
          200: '#F9CFD9',
          300: '#F4A7BA',
          400: '#E87591',
          500: '#B54B63',
          600: '#9E3D53',
          700: '#852F43',
        },
        // Neutral: Warm Charcoal
        charcoal: {
          50: '#F9F8F8',
          100: '#F2F0F0',
          200: '#E6D6D9',
          300: '#D4C4C7',
          400: '#A89A9D',
          500: '#6F6668',
          600: '#5A5153',
          700: '#453D3F',
          800: '#2E2A2B',
          900: '#1A1718',
        },
        // Semantic Tokens
        brand: {
          primary: '#E7A6B2',
          secondary: '#F2C6CF',
          accent: '#B54B63',
          bg: '#FFF7F3',
          surface: '#FFF1EC',
          text: '#2E2A2B',
          muted: '#6F6668',
          border: '#E6D6D9',
        },
      },

      // ══════════════════════════════════════════════════════════════════
      // TYPOGRAPHY - Fashion Editorial
      // Headlines: Playfair Display | Body: Inter
      // ══════════════════════════════════════════════════════════════════
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '500' }],
        'display': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '500' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '500' }],
        'heading': ['1.75rem', { lineHeight: '1.3', fontWeight: '500' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7' }],
        'body': ['0.9375rem', { lineHeight: '1.7' }],
        'caption': ['0.8125rem', { lineHeight: '1.5' }],
        'small': ['0.75rem', { lineHeight: '1.4' }],
      },

      // ══════════════════════════════════════════════════════════════════
      // SPACING & LAYOUT
      // ══════════════════════════════════════════════════════════════════
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      
      maxWidth: {
        'content': '1240px',
        'narrow': '680px',
      },

      // ══════════════════════════════════════════════════════════════════
      // EFFECTS
      // ══════════════════════════════════════════════════════════════════
      boxShadow: {
        'soft': '0 2px 20px -4px rgba(46, 42, 43, 0.08)',
        'card': '0 4px 24px rgba(46, 42, 43, 0.06)',
        'elevated': '0 12px 40px rgba(46, 42, 43, 0.1)',
      },

      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },

      aspectRatio: {
        'product': '3 / 4',
        'hero': '16 / 9',
        'square': '1 / 1',
      },
    },
  },
  plugins: [],
}

