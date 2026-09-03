import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH é o caminho em que o site é servido: '/desenhe/' enquanto o
// endereço for <usuario>.github.io/desenhe/, '/' com o domínio próprio. Quem
// define isso na publicação é o env do .github/workflows/deploy.yml; o padrão
// aqui é a raiz, que é o que o dev server e o build local usam.
//
// BUILD_OUT_DIR muda a pasta de saída, útil para gerar um build de teste sem
// mexer no dist/.
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
