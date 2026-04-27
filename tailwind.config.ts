import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand
        emerald: {
          DEFAULT: '#00C896',
          light: '#00E6A8',
          deep: '#00A87E',
          muted: 'rgba(0,200,150,0.1)',
        },
        gold: {
          DEFAULT: '#D4A843',
          light: '#E8C878',
          muted: 'rgba(212,168,67,0.1)',
        },
        sapphire: {
          DEFAULT: '#64A0FF',
          muted: 'rgba(100,160,255,0.1)',
        },
        coral: {
          DEFAULT: '#F47B7B',
          muted: 'rgba(244,123,123,0.1)',
        },
        // Dark backgrounds
        void: '#06090F',
        abyss: '#0C1219',
        depth: '#0F1822',
        slate: {
          dark: '#141F2E',
          navy: '#192536',
          mid: '#1E2D40',
          border: '#1A2333',
          border2: '#243040',
        },
        // Text dark
        ink: {
          primary: '#E8EDF5',
          secondary: '#8FA8C0',
          muted: '#4A6580',
          hint: '#2A3E52',
        },
        // Light backgrounds
        frost: '#F0F4FA',
        mist: '#E8EFF8',
        pearl: '#F8FBFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
      fontSize: {
        'display': ['64px', { lineHeight: '1.05', letterSpacing: '-1px' }],
        'h1': ['48px', { lineHeight: '1.1', letterSpacing: '-0.5px' }],
        'h2': ['36px', { lineHeight: '1.2', letterSpacing: '-0.3px' }],
        'h3': ['24px', { lineHeight: '1.3' }],
        'h4': ['18px', { lineHeight: '1.4' }],
        'body-lg': ['18px', { lineHeight: '1.7' }],
        'body': ['16px', { lineHeight: '1.7' }],
        'body-sm': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.5', letterSpacing: '0.5px' }],
        'label': ['11px', { lineHeight: '1.4', letterSpacing: '1.8px' }],
      },
      borderRadius: {
        'xs': '6px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '28px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'slide-in': 'slideIn 0.5s ease both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'ticker': 'ticker 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.4)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.5)',
        'emerald': '0 0 24px rgba(0,200,150,0.15)',
        'emerald-strong': '0 0 40px rgba(0,200,150,0.25)',
        'gold': '0 0 24px rgba(212,168,67,0.15)',
        'glow': '0 0 60px rgba(0,200,150,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
