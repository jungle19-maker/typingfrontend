/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00F0FF', // Neon Cyan
                secondary: '#FF003C', // Neon Pink
                accent: '#Fcee0a', // Cyber Yellow
                dark: '#0B0B0E', // Deep Space Black
                surface: '#16161D', // Slightly Lighter Black
                textMain: '#FFFFFF',
                textMuted: '#888899',
                success: '#00FF9D',
                error: '#FF003C',
                warning: '#Fcee0a',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
            },
            boxShadow: {
                'neon-blue': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
                'neon-pink': '0 0 10px rgba(255, 0, 60, 0.5), 0 0 20px rgba(255, 0, 60, 0.3)',
            }
        },
    },
    plugins: [],
}
