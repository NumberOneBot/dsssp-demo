/* eslint-disable @typescript-eslint/no-unused-vars */
import react from '@vitejs/plugin-react-swc'
import path from 'path'
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
    // resolve: {
    //   alias: [
    //     {
    //       find: 'dsssp/font',
    //       replacement: path.resolve(__dirname, '../dsssp-io/dist/index.css')
    //     },
    //     {
    //       find: 'dsssp',
    //       replacement: path.resolve(__dirname, '../dsssp-io/dist')
    //     }
    //   ]
    // },
    server: {
      port: 3003,
      open: true,
      host: true,
      cors: true,
      historyApiFallback: true
    },
    build: {
      sourcemap: true,
      rollupOptions: {}
    }
  }
})
