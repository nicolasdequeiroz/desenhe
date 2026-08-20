import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH permite servir de um subcaminho (ex.: /repo/ no GitHub Pages
// antes do domínio próprio). Com domínio custom, fica na raiz '/'.
//
// BUILD_OUT_DIR muda a pasta de saída do build: 'dist' no dia a dia,
// 'docs' quando o build é para o GitHub Pages publicar direto da branch
// main (ver "npm run build:pages" e Settings > Pages > Deploy from a
// branch > main > /docs).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  build: {
    outDir: process.env.BUILD_OUT_DIR || 'dist',
  },
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
