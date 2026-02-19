/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cat-brown': '#562c2c',
                'cat-orange': '#f2542d',
                'cat-beige': '#f5dfbb',
                'cat-teal-light': '#0e9594',
                'cat-teal-dark': '#127475',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
