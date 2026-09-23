import { configDefaults, defineConfig } from 'vitest/config'
import { loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'

/*
 * Serves the Vercel-style functions in /api during `npm run dev`, so Ask the
 * Atlas works locally without the Vercel CLI. Server-only variables come from
 * .env (GEMINI_*, ASK_*, UPSTASH_*, GOOGLE_*) and are never exposed to the client.
 */
function atlasApi(): Plugin {
  return {
    name: 'atlas-api',
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), '')
      for (const [key, value] of Object.entries(env)) if (/^(GEMINI_|ASK_|UPSTASH_|GOOGLE_)/.test(key) && process.env[key] === undefined) process.env[key] = value
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/([a-z-]+)/)
        if (!match) return next()
        try {
          const module = await server.ssrLoadModule(`/api/${match[1]}.ts`)
          const handler = module[req.method ?? 'GET']
          if (typeof handler !== 'function') { res.statusCode = 405; res.end(); return }
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers(Object.entries(req.headers).flatMap(([key, value]) => (typeof value === 'string' ? [[key, value]] : [])))
          const request = new Request(`http://${req.headers.host ?? 'localhost'}${req.url}`, { method: req.method, headers, body: chunks.length ? Buffer.concat(chunks) : undefined })
          const response: Response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          if (!response.body) { res.end(); return }
          const reader = response.body.getReader()
          for (;;) { const { done, value } = await reader.read(); if (done) break; res.write(value) }
          res.end()
        } catch (error) {
          server.ssrFixStacktrace(error as Error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'API error in development server' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), atlasApi()],
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
    exclude: [...configDefaults.exclude, 'e2e/**', '.scratch/**'],
  },
})
