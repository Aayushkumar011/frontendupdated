/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        sidebarWidthDesktop: '16rem', // Now usable as ml-sidebarWidthDesktop
      },
      colors: {
        theme: {
          'nav-bg': 'var(--color-nav-bg)',
          'border': 'var(--color-border)',
          'heading-primary': 'var(--color-heading-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          'button-secondary-bg': 'var(--color-button-secondary-bg)',
          'button-secondary-text': 'var(--color-button-secondary-text)',
          'button-secondary-hover': 'var(--color-button-secondary-hover)',
          'text': 'var(--color-text)',
          'hero-bg': 'var(--color-hero-bg)',
          'hero-heading': 'var(--color-hero-heading)',
          'hero-text': 'var(--color-hero-text)',
          'section-bg': 'var(--color-section-bg)',
          'card-bg': 'var(--color-card-bg)',
          'card-bg-light': 'var(--color-card-bg-light)',
          'card-hover-bg-light': 'var(--color-card-hover-bg-light)',
          'input-bg': 'var(--color-input-bg)',
          'progress-bar-bg': 'var(--color-progress-bar-bg)',
          'stat-number': 'var(--color-stat-number)',
          'stat-label': 'var(--color-stat-label)',
          'stat-icon-bg': 'var(--color-stat-icon-bg)',
          'stat-icon-color': 'var(--color-stat-icon-color)',
          'stat-icon-hover-bg': 'var(--color-stat-icon-hover-bg)',
          'heading-step': 'var(--color-heading-step)',
          'step-arrow': 'var(--color-step-arrow)',
        },
      },
    },
  },
  plugins: [],
};
