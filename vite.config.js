import { defineConfig } from 'vite'

crossOriginIsolation = () => ({
  name: 'configure-server',

  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
      next()
    })
  },
})
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [crossOriginIsolation()],
})
