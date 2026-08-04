import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH permite servir de um subcaminho (ex.: /repo/ no GitHub Pages
// antes do domínio próprio). Com domínio custom, fica na raiz '/'.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
