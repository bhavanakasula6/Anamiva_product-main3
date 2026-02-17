/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand – Mint (replaces blue as primary)
        primary: {
          50: '#E6FAF6',
          100: '#CFF5EC',
          200: '#A3EADF',
          300: '#76DFD1',
          400: '#55CBB4',
          500: '#55CBB4', // canonical
          600: '#3FB8A1',
          700: '#2E9C87',
          800: '#1F7A6A',
          900: '#145A4F',
        },

        // Accent – Coral (replaces purple as secondary)
        secondary: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#FF7072', // canonical coral
          600: '#E85558',
          700: '#BE3A3D',
          800: '#9F2F32',
          900: '#7F1D1D',
        },

        // Success (medical green)
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },

        // Warning (warm yellow)
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FFD972',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // Danger (medical red – keep)
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },

        // Surfaces
        surface: {
          app: '#FFF9F4',
          card: '#F7F8F6',
          elevated: '#FFFFFF',
        },

        // Text
        text: {
          primary: '#23344D',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
}
