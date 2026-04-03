import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        art: {
          cream: 'var(--color-cream)',
          sage: 'var(--color-sage)',
          terracotta: 'var(--color-terracotta)',
          taupe: 'var(--color-taupe)',
          beige: 'var(--color-beige)',
          gold: 'var(--color-gold)',
          lavender: 'var(--color-lavender)',
          clay: 'var(--color-clay)',
          green: 'var(--color-soft-green)',
          charcoal: 'var(--color-charcoal)'
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-text-primary)',
        border: 'var(--color-border)'
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Lora', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif']
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
        hover: 'var(--shadow-hover)'
      },
      borderRadius: {
        gentle: '1rem'
      },
      transitionDuration: {
        calm: '250ms',
        slower: '300ms'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 500ms ease-out both'
      },
      spacing: {
        card: '1.75rem'
      },
      lineHeight: {
        calm: '1.6'
      },
      letterSpacing: {
        calm: '0.5px'
      }
    }
  },
  plugins: []
};

export default config;
