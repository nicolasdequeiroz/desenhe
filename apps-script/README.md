# Backend do livro de visitas (Apps Script + Planilha)

O rodapé do site tem um quadro onde o visitante desenha. Sem este passo, o
desenho fica salvo **só no navegador de quem desenhou** — ninguém mais vê.

Para que os desenhos apareçam para todo mundo, é preciso um lugar fora do site
guardando os dados. O site é estático (GitHub Pages), então usamos uma Planilha
Google com um Apps Script na frente — de graça e sem servidor.

> **Já tem uma planilha instalada e só precisa atualizar o código?** Pule
> para o editor do Apps Script dela (Extensões → Apps Script), substitua o
> conteúdo por [`Codigo.gs`](./Codigo.gs), salve, rode `testeEmail` uma vez
> (passo 7 abaixo — é o que garante o e-mail de aviso) e crie uma **nova
> versão** da implantação existente (Implantar → Gerenciar implantações →
> editar → Nova versão). A URL `/exec` não muda, então não precisa tocar em
> `guestbook.ts` de novo.

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
7. **Autorize o envio de e-mail à parte**: no editor, no menu de funções (ao
   lado do botão ▶ Executar), selecione `testeEmail` e clique em Executar.
   O Google vai pedir uma segunda autorização (agora para enviar e-mail em
   seu nome) — sem isso, os avisos de novo desenho falham em silêncio. Se o
   e-mail de teste chegar em `nicolasazevedo38@gmail.com`, está liberado.
8. Copie a **URL do app da Web**. Ela termina em `/exec`.
9. No repositório do site, abra `src/data/guestbook.ts` e cole a URL:

   ```ts
   export const GUESTBOOK_ENDPOINT = 'https://script.google.com/macros/s/AAAA.../exec';
   ```

10. Faça commit e push. O deploy no GitHub Pages é automático.

## Como moderar

Todo desenho novo entra **pendente**: fica invisível para todo mundo, exceto
para quem o desenhou (o próprio navegador guarda uma cópia local e mostra na
hora, então quem desenhou não percebe a espera).

A cada envio, `nicolasazevedo38@gmail.com` recebe um e-mail com **a prévia do
desenho** (imagem de verdade, embutida no corpo do e-mail) e dois botões,
**Aprovar** e **Recusar** — um clique em qualquer um já resolve, sem precisar
abrir a planilha. Cada link é assinado com `MOD_SECRET` (definido no topo do
`Codigo.gs`), então só quem recebeu o e-mail consegue moderar por esse
caminho.

Também dá pra moderar direto na planilha, se preferir: cada desenho é uma
linha da aba `desenhos`, com a mesma prévia inserida como imagem na coluna
**previa** (F) — não precisa decifrar o JSON da coluna **tracos** pra ver o
que foi desenhado. Escreva `ok` na coluna **status** para publicar, ou
qualquer outra coisa (ex.: `oculto`) para esconder — só o valor exato `ok`
fica visível no site. Os links do e-mail fazem exatamente essa troca por você.

## Detalhes que importam

- O desenho em si é gravado como **traços vetoriais** (coordenadas
  normalizadas): a célula fica pequena e o desenho é redesenhado nítido em
  qualquer tamanho no site. A prévia em PNG é gerada à parte, só na hora do
  envio, pra você ver a imagem sem precisar decifrar coordenadas.
- Instalação já existente, de antes da prévia em imagem? As linhas antigas
  não ganham a imagem retroativamente (só o que foi enviado antes não tinha
  esse dado) — a coluna **previa** também não existe no cabeçalho de
  planilhas criadas antes desta atualização; pode adicionar o rótulo à mão
  na célula F1, se quiser.
- O envio usa `Content-Type: text/plain` de propósito: o Apps Script não responde
  ao preflight `OPTIONS` do CORS, então a requisição precisa ser "simples".
- Cota do Apps Script: cerca de 20 mil execuções por dia — muito acima do
  movimento esperado do site. O envio de e-mail tem cota própria (bem mais
  apertada, ~100/dia numa conta pessoal do Gmail), mas uma falha aqui nunca
  derruba o envio do desenho, só o aviso.
- Se a planilha estiver fora do ar, o site não quebra: o desenho fica salvo no
  navegador de quem desenhou e a pilha mostra os que já tinham sido carregados.
- O site lê no máximo os 60 desenhos **aprovados** mais recentes e empilha os
  22 últimos.
- `MOD_SECRET` é uma proteção leve, não uma senha forte: qualquer um com esse
  valor consegue aprovar/recusar pelos links. Ele só existe no código-fonte
  (`Codigo.gs`, que não é público) e nos e-mails que você recebe, então é
  suficiente para o risco real aqui. Se algum dia vazar, troque o valor da
  constante e implante uma nova versão.
