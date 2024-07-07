import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import replace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Desactiva los mapas de origen para los archivos de salida
  },
  replace: {
    'process.env.REACT_APP_AUTH0_CLIENT_ID': JSON.stringify(process.env.REACT_APP_AUTH0_CLIENT_ID),
    'process.env.REACT_APP_AUTH0_DOMAIN': JSON.stringify(process.env.REACT_APP_AUTH0_DOMAIN)
  }
})
