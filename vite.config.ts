import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from'vite-plugin-mkcert'

export default defineConfig({
    plugins: [react(), mkcert()],
    server: {
        https   :   true,
        host    :   "0.0.0.0",
        port    :   3000,
        proxy   :   {
            '/graphql': {
                target          :   'http://app.buyerstage.io:8080',
                changeOrigin    :   true,
                secure          :   false
            },
        },
    },
    preview: {
        https   :   true,
        port    :   5000,
    },
    base: "https://static.buyerstage.io/20250404_1",
    define: {
        'process.env': process.env
    }
})
