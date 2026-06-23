/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      spacing: {
        sidebar: '13.75rem',
      },
      colors: {
        accent: '#E87D2F',
        'accent-dark': '#D06B20',
        'accent-light': '#F5A623',
        teal: '#2E7D8A',
        'teal-dark': '#236570',
        sidebar: '#1C1F26',
        'sidebar-hover': '#2A2D35',
        'sidebar-muted': '#6B7280',
        surface: '#F5F2ED',
        'surface-light': '#FAF8F5',
        card: '#FFFFFF',
        text: '#1C1F26',
        'text-muted': '#8E8E93',
        border: '#E5E0D8',
        success: '#3A9D5E',
        danger: '#D1453B',
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(28, 31, 38, 0.06), 0 1px 2px rgba(28, 31, 38, 0.04)',
        'card-hover': '0 4px 12px rgba(28, 31, 38, 0.08)',
        'accent-glow': '0 0 8px rgba(232, 125, 47, 0.3)',
      },
    },
  },
  plugins: [],
};
