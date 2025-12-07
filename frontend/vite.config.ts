import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const config: UserConfig = {
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
        // tailwindcss({
        //     optimize: true
        // })
    ],
    server: {
        host: "0.0.0.0",
        port: 5173
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/")
        }
    }
}

// https://vite.dev/config/
export default defineConfig(config)
