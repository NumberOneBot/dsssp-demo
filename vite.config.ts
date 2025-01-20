import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const getBase = (mode: string) => {
  switch (mode) {
    case 'github':
      return '/dsssp-demo/'
    case 'landing':
      return '/demo'
    case 'development':
    default:
      return '/'
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [svgr(), react()],
    base: getBase(mode),
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
