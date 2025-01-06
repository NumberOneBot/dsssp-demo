import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === 'development' ? '/' : '/sound/dsssp/',
    server: {
      port: 3030,
      open: true
    },
    build: {
      sourcemap: true,
      rollupOptions: {}
    }
  }
})
