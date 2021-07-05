import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [vue(), svgLoader()]

})


