import defaultTheme from 'tailwindcss/defaultTheme'
import noScrollbar from 'tailwindcss-no-scrollbar'

/** @type {import('tailwindcss').Config} */
export default {
    // darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans]
        },
        extend: {},
    },
    plugins: [noScrollbar],
}

