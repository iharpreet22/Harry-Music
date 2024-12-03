import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: {
    port: 5174,
    strictPort: true,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'https://api.spotify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['./src/services/spotify.js', './src/services/audioService.js', './src/services/playerService.js']
        }
      }
    }
  }
});