import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ["react", "react-dom", "react-router-dom"],
          redux:   ["@reduxjs/toolkit", "react-redux"],
          motion:  ["motion/react"],
          icons:   ["lucide-react"],
          ui:      ["@radix-ui/react-slot", "@radix-ui/react-dialog", "@radix-ui/react-select"],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  }
})