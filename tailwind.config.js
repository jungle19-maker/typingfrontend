/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                accent: 'var(--accent)',
                bg: 'var(--bg-drak)',
                textMain: 'var(--text-main)',
                textMuted: 'var(--text-muted)',
                success: 'var(--success)',
                error: 'var(--error)',
                warning: 'var(--warning)',
            }
        },
    },
    plugins: [],
}
