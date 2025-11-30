import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep lake waters
        lake: {
          50: '#e6f4f1',
          100: '#b3ddd4',
          200: '#80c6b7',
          300: '#4daf9a',
          400: '#26997f',
          500: '#0d7a61',
          600: '#0a6350',
          700: '#074c3e',
          800: '#04352b',
          900: '#021e19',
        },
        // Warm sunset amber
        amber: {
          50: '#fff8e6',
          100: '#ffeab3',
          200: '#ffdb80',
          300: '#ffcc4d',
          400: '#ffbe26',
          500: '#e6a300',
          600: '#b38000',
          700: '#805c00',
          800: '#4d3700',
          900: '#1a1300',
        },
        // Forest greens
        forest: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        // Soft cream
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#fbf3e7',
          300: '#f7ead6',
          400: '#f2dfc3',
          500: '#ebd3ae',
          600: '#d9bc8e',
          700: '#c4a06a',
          800: '#a68347',
          900: '#7a5f32',
        },
        // Alert coral
        coral: {
          50: '#fff0ed',
          100: '#ffd6cc',
          200: '#ffb3a3',
          300: '#ff8f79',
          400: '#ff6b50',
          500: '#e64a2e',
          600: '#c43a22',
          700: '#9c2c18',
          800: '#741f10',
          900: '#4c1309',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'lake-surface': 'linear-gradient(180deg, #0d7a61 0%, #074c3e 50%, #021e19 100%)',
        'sunset-glow': 'linear-gradient(135deg, #ffcc4d 0%, #e64a2e 50%, #9c2c18 100%)',
      },
    },
  },
  plugins: [],
}

export default config

