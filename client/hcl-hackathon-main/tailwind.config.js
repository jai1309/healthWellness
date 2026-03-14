/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        wellness: {
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      boxShadow: {
        soft: '0 18px 45px -20px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'hero-wash':
          'radial-gradient(circle at top left, rgba(14,165,233,0.18), transparent 36%), radial-gradient(circle at bottom right, rgba(34,197,94,0.16), transparent 30%)',
      },
    },
  },
  plugins: [],
};
