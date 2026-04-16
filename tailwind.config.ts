import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:    '#7B2CBF',
        'primary-hover': '#A66DD4',
        secondary:  '#7ED957',
        'secondary-light': '#A8E6A3',
        background: '#EDEDED',
        surface:    '#FFFFFF',
        text:       '#3A3A3A',
        muted:      '#A8A8A8',
        error:      '#C0392B',
        info:       '#2471A3',
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        dm:      ['var(--font-dm)', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card:   '12px',
        btn:    '8px',
        input:  '6px',
      },
      spacing: {
        sidebar: '240px',
        topbar:  '64px',
      },
    },
  },
};

export default config;