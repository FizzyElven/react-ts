import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group firebase into its own file
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Group react core to keep it stable
          // 'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
