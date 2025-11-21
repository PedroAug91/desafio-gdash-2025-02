import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

const config: UserConfig = {
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    server: {
        host: "0.0.0.0",
        port: 5173
    }
}

// https://vite.dev/config/
export default defineConfig(config)
