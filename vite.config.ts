import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [svgr(), react()],
    base: mode === 'development' ? '/' : '/dsssp-demo/',
    // base: '/',
    server: {
      port: 3003,
      open: true
    },
    build: {
      sourcemap: true,
      rollupOptions: {}
    }
  }
})
