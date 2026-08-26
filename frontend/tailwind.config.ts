import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#0e1319',
        surface: '#151c24',
        surface2: '#10161d',
        border: '#232d38',
        borderSoft: '#1b232c',
        text: '#e9edf2',
        dim: '#97a4b2',
        faint: '#5b6673',
        mint: '#5fe3a4',
        mintDim: '#2c5c47',
        amber: '#f2b851',
        coral: '#ef7d63',
        trafficRed: '#5f4247',
        trafficYellow: '#5f5237',
        trafficGreen: '#3a5f47',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Space Grotesk"', '"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        blink: { '50%': { opacity: '0' } },
        statusPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(95,227,164,.45)' },
          '70%': { boxShadow: '0 0 0 8px rgba(95,227,164,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(95,227,164,0)' },
        },
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
        statusPulse: 'statusPulse 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
