/** @type {import('@tailwindcss/config').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#000000', // Jet Black
                secondary: '#FFFFFF', // Crisp White
                accent: '#D5001C', // Phoenix Red (Guards Red style)
                surface: '#F5F5F5', // Light Surface
                neutral: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#E5E5E5',
                    300: '#D4D4D4',
                    800: '#262626',
                    900: '#171717',
                }
            },
            fontFamily: {
                sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
                'roboto-slab': ['"Roboto Slab"', 'serif'],
            },
            borderRadius: {
                none: '0',
                sm: '0',
                DEFAULT: '0', // Sharp edges everywhere
                md: '0',
                lg: '0',
                xl: '0',
                '2xl': '0',
                '3xl': '0',
                full: '9999px', // Only for circular badges/avatars
            },
            letterSpacing: {
                tight: '-0.02em',
                wide: '0.05em',
                wider: '0.1em',
                widest: '0.2em', // Increased for headers
            },
            boxShadow: {
                'none': 'none',
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Minimal
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: true,
    },
}