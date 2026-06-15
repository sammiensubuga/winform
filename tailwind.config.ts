import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0F1E',
        card: '#111827',
        'card-hover': '#1A2234',
        elevated: '#1E2A3A',
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        'text-primary': '#F0F4F8',
        'text-secondary': '#8896A7',
        'text-tertiary': '#4A5568',
        border: {
          DEFAULT: '#1E2D40',
          strong: '#2A3F55',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config