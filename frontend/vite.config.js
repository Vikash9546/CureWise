import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        headers: {
            "Permissions-Policy": "federated-credential-management=(self \"https://accounts.google.com\")"
        }
    }
})
