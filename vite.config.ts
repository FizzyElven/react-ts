import { defineConfig } from 'vitest/config'
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // Path to your new file
  },
})
