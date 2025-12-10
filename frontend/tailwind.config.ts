// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      '5xl': '3840px',
    },
    fontFamily: {
      'sans': ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      'dm-sans': ['DM Sans', 'sans-serif'],
      'montserrat': ['Montserrat', 'sans-serif'],
      'nunito': ['Nunito', 'sans-serif'],
      'open-sans': ['Open Sans', 'sans-serif'],
    },
    colors: {
      // Minimal black, white, gray palette
      white: '#ffffff',
      black: '#000000',
      gray: {
        50: '#f8f9fa',
        100: '#f1f3f4',
        200: '#e8eaed',
        300: '#dadce0',
        400: '#bdc1c6',
        500: '#9aa0a6',
        600: '#80868b',
        700: '#5f6368',
        800: '#3c4043',
        900: '#202124',
      },
      // Enhanced Healing Greens color palette
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      // Essential accent colors
      red: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
      },
      blue: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
      },
      yellow: {
        50: '#fffbeb',
        400: '#facc15',
      },
    },
   
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    spacing: {
      '18': '4.5rem',
      '88': '22rem',
    },
    extend: {
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      cursor: {
        'pointer': 'pointer',
      },
    },
  },
  plugins: [],
};

export default config;