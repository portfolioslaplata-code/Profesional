import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { portfolio } from './src/data/portfolio.js'
import { renderHead } from './src/utils/seo.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'portfolio-metadata',
      transformIndexHtml(html) {
        return html
          .replace('lang="es-AR"', `lang="${portfolio.locale || 'es-AR'}"`)
          .replace('<!--portfolio-head-->', renderHead(portfolio))
      },
    },
  ],
})
