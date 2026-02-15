import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
      // Proxy /admin/* to the Flask backend which serves the admin dashboard
      '/admin': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        // Log proxy requests for debugging
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('[proxy error]', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('[proxy] ->', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('[proxy] <-', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy /logout to Flask backend (admin logout)
      '/logout': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
})
