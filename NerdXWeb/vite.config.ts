import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          const normalizedId = id.replace(/\\/g, '/');
          const [, modulePath = ''] = normalizedId.split('/node_modules/');
          const parts = modulePath.split('/');
          const pkg = parts[0]?.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];

          if (pkg === 'tldraw' || pkg?.startsWith('@tldraw/')) return 'whiteboard';
          if (pkg === '@jitsi/react-sdk') return 'video';
          if (pkg === 'katex' || pkg === 'mathjs') return 'math';
          if (pkg === '@supabase/supabase-js' || pkg?.startsWith('@supabase/')) return 'supabase';
          if (pkg === 'axios') return 'network';
          if (pkg === 'lucide-react') return 'icons';
          if (pkg === 'react' || pkg === 'react-dom' || pkg === 'scheduler') return 'react-core';
          if (pkg === 'react-router' || pkg === 'react-router-dom') return 'router';

          return 'vendor';
        },
      },
    },
  },
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
