import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const port = env.REACT_PORT ? env.REACT_PORT : 3002;
    return {
        plugins: [react()],
        base: "/display/",
        preview: {
            port: port,
            strictPort: true,
        },
        server: {
            port: port,
            strictPort: true,
            host: true,
            origin: "http://localhost:" + port,
            proxy: {
                '/api': 'http://localhost:8084',
                '/image': 'http://localhost:8084',
                '/websocket': {
                    target: 'ws://localhost:8084',
                    ws: true,
                    rewriteWsOrigin: true,
                },

            },
        },

    }
})
