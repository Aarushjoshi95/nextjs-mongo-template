/** @type {import('tailwindcss').Config} */
module.exports = {
    // `overline` is a Tailwind utility; without this an app's own eyebrow-label class draws a line above the text.
    blocklist: ["overline"],
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px'
        }
      },
      extend: {
        // Tokens in globals.css hold space-separated RGB channels, so opacity
        // modifiers (`border-accent/30`) work. `paper` is the page background (--bg).
        colors: {
          paper: 'rgb(var(--bg) / <alpha-value>)',
          surface: 'rgb(var(--surface) / <alpha-value>)',
          ink: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--muted) / <alpha-value>)',
          line: 'rgb(var(--line) / <alpha-value>)',
          accent: 'rgb(var(--accent) / <alpha-value>)',
          positive: 'rgb(var(--positive) / <alpha-value>)'
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
          'accordion-down': {
            from: {
              height: '0'
            },
            to: {
              height: 'var(--radix-accordion-content-height)'
            }
          },
          'accordion-up': {
            from: {
              height: 'var(--radix-accordion-content-height)'
            },
            to: {
              height: '0'
            }
          }
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out'
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
  }