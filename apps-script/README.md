# Backend do livro de visitas (Apps Script + Planilha)

O rodapé do site tem um quadro onde o visitante desenha. Sem este passo, o
desenho fica salvo **só no navegador de quem desenhou** — ninguém mais vê.

Para que os desenhos apareçam para todo mundo, é preciso um lugar fora do site
guardando os dados. O site é estático (GitHub Pages), então usamos uma Planilha
Google com um Apps Script na frente — de graça e sem servidor.

## Passo a passo (uma vez só, ~5 min)

1. Crie uma planilha em <https://sheets.new> e dê um nome (ex.: `Desenhe — livro de visitas`).
2. Nela, vá em **Extensões → Apps Script**.
3. Apague o conteúdo do editor e cole tudo o que está em [`Codigo.gs`](./Codigo.gs).
4. Salve (ícone de disquete).
5. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa** ← precisa ser este, senão o site não consegue ler
6. Autorize quando o Google pedir (vai aparecer um aviso de "app não verificado";
   é o seu próprio script — siga em *Avançado → Acessar projeto*).
7. Copie a **URL do app da Web**. Ela termina em `/exec`.
8. No repositório do site, abra `src/data/guestbook.ts` e cole a URL:

   ```ts
   export const GUESTBOOK_ENDPOINT = 'https://script.google.com/macros/s/AAAA.../exec';
   ```

9. Faça commit e push. O deploy no GitHub Pages é automático.

## Como moderar

Cada desenho é uma linha da aba `desenhos`. Para esconder um desenho do site,
escreva `oculto` na coluna **status** — ou simplesmente apague a linha.

## Detalhes que importam

- O desenho é gravado como **traços vetoriais** (coordenadas normalizadas), não
  como imagem. A célula fica pequena e o desenho é redesenhado nítido em
  qualquer tamanho.
- O envio usa `Content-Type: text/plain` de propósito: o Apps Script não responde
  ao preflight `OPTIONS` do CORS, então a requisição precisa ser "simples".
- Cota do Apps Script: cerca de 20 mil execuções por dia — muito acima do
  movimento esperado do site.
- Se a planilha estiver fora do ar, o site não quebra: o desenho fica salvo no
  navegador de quem desenhou e a pilha mostra os que já tinham sido carregados.
- O site lê no máximo os 60 desenhos mais recentes e empilha os 22 últimos.
