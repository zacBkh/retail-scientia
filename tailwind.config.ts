import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],

  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}', // Fixed the path here
  ],

  theme: {
    extend: {
      fontSize: {
        xxs: '0.625rem', // You can adjust the value as needed
      },
    },
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
    },
  },
}

export default config
