import { configDefaults, defineConfig } from 'vitest/config'
import { loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'

/*
 * Serves the Vercel functions in /api during `npm run dev`, including the readable-layer rewrites
 * from vercel.json. Server-only PRACTICE_* and UPSTASH_* variables come from .env.local and are
 * never exposed to the client bundle.
 */
const readableFile = /^\/practice\/(?:p\/([A-Z]{2,3}-\d{2}\.(?:md|json))|(corpus\.json|schema\.json|llms\.txt|llms-full\.txt|changes\.json|changes\.xml|skill\.zip|SHA256SUMS|SHA256SUMS\.sig))$/
function atlasApi(): Plugin {
  return {
    name: 'atlas-api',
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), '')
      for (const [key, value] of Object.entries(env)) if (/^(PRACTICE_|UPSTASH_)/.test(key) && process.env[key] === undefined) process.env[key] = value
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        let url = req.url ?? '/'
        const readable = readableFile.exec(url.split('?')[0])
        if (readable) url = `/api/practice/file?path=${readable[1] ? `practices/${readable[1]}` : readable[2]}`
        const match = url.match(/^\/api\/((?:practice\/)?[a-z-]+)(?:\?|$)/)
        if (!match) return next()
        try {
          const module = await server.ssrLoadModule(`/api/${match[1]}.ts`)
          const handler = module[req.method ?? 'GET']
          if (typeof handler !== 'function') { res.statusCode = 405; res.end(); return }
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers(Object.entries(req.headers).flatMap(([key, value]) => (typeof value === 'string' ? [[key, value]] : [])))
          const request = new Request(`http://${req.headers.host ?? 'localhost'}${url}`, { method: req.method, headers, body: chunks.length ? Buffer.concat(chunks) : undefined })
          const response: Response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => { if (key !== 'set-cookie') res.setHeader(key, value) })
          const cookies = response.headers.getSetCookie()
          if (cookies.length) res.setHeader('set-cookie', cookies)
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.ssrFixStacktrace(error as Error)
          console.error(error)
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
