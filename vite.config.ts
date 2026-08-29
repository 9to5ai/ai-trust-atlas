import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/')) return 'atlas-data'
          if (id.includes('/node_modules/motion/')) return 'motion'
          if (id.includes('/node_modules/@phosphor-icons/')) return 'icons'
          if (id.includes('/node_modules/react') || id.includes('/node_modules/scheduler/')) return 'react'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
