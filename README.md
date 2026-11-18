# Desenhe — Escola de Arte

Novo site institucional da [Desenhe](https://www.desenhe.com.br) (Curitiba/PR), construído com:

- **Vite + React + TypeScript**
- **Design system próprio** em CSS puro: tokens em `src/styles/tokens.css` e
  componentes em `src/ui/` (sem dependências de UI de terceiros)
- **vite-react-ssg** para pré-renderizar cada página em HTML estático (SEO)
- **GitHub Pages** como hospedagem, com deploy automático a cada push na `main`

## Desenvolvimento

```bash
npm install
npm run dev        # dev server em http://localhost:5173
npm run build      # build estático em dist/ (14+ páginas pré-renderizadas)
npm run preview    # serve o build de produção
```

## Estrutura

```
src/
  styles/tokens.css       Tokens da marca (cores, tipografia, espaçamento) + reset tipográfico
  styles/reset.css        Reset de CSS mínimo
  ui/                     Componentes de UI (Button, Text, Heading, Badge, Card…)
  ui/ui.css               Estilos dos componentes de UI
  site.css                Estilos estruturais do site (header, hero, seções, botões…)
  data/                   Todo o conteúdo do site (cursos, professores, preços…)
  components/             Header, footer, seções, CTAs de WhatsApp, efeito de tinta
  pages/                  Uma página por rota
  routes.tsx              Rotas + redirects das URLs do site antigo
public/images/            Imagens otimizadas (WebP) extraídas do site Wix
```

O conteúdo editável (textos, preços, horários) vive todo em `src/data/` — para
atualizar um preço ou horário, basta editar o arquivo correspondente e fazer
push: o deploy é automático.

## Design system

Tokens definidos em `src/styles/tokens.css` (`:root`), consumidos via
`var(--...)` no `site.css` e nos componentes de `src/ui/`:

- **Acento:** laranja da marca `#F67800`
- **Fundos:** tons de papel/gesso quentes; site travado em modo escuro
  (`color-scheme: dark`), com as seções de Depoimentos e footer em superfície
  clara própria (variáveis `--surface-warm-*`)
- **Tipografia:** Courier Prime (títulos) + Manrope (corpo), via Google Fonts

## Deploy

Automático: **todo push na `main` publica**. O workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) instala as
dependências, roda o build e manda o resultado direto para o GitHub Pages. O
repositório guarda só o código-fonte, nenhum HTML gerado (antes o site era uma
pasta `docs/` commitada, que obrigava a rodar o build à mão e a revisar 130
arquivos gerados a cada troca de texto).

Em Settings > Pages, **Source** precisa estar em **GitHub Actions**. A primeira
execução do workflow já muda isso sozinha (`configure-pages` com
`enablement: true`), mas dá para mudar no dropdown também.

Para reproduzir na sua máquina exatamente o que o CI faz:

```bash
BASE_PATH=/desenhe/ npm run build:deploy   # build + 404.html + .nojekyll, em dist/
npm run preview                            # serve o resultado
```

O `BASE_PATH` é o caminho em que o site é servido. Ele mora numa linha só, no
`env` do workflow, e é o **único** lugar a mudar no dia do domínio próprio.

## Antes de publicar em www.desenhe.com.br

Um roteiro, na ordem. O corte de DNS é o último passo porque é ele que tira o
site antigo (Wix) do ar.

1. **Conteúdo em dia.** Preços, horários e a página da Colônia de Férias (hoje
   escondida do índice de busca, ver `noindex` em `src/pages/ColoniaDeFerias.tsx`).
2. **Livro de visitas.** `GUESTBOOK_ENDPOINT` em `src/data/guestbook.ts` está
   vazio: enquanto estiver assim, cada desenho fica salvo só no navegador de
   quem desenhou e ninguém mais vê o mural do rodapé. Para ligar, siga
   [`apps-script/README.md`](./apps-script/README.md) (uns 5 min: planilha,
   script, colar a URL `/exec`).
3. **Base na raiz.** Em `.github/workflows/deploy.yml`, troque
   `BASE_PATH: /desenhe/` por `BASE_PATH: /` e faça push. Não precisa de
   arquivo `CNAME`: com publicação por workflow, o domínio fica salvo em
   Settings > Pages.
4. **DNS no registro.br.** `CNAME` de `www` apontando para
   `<usuario>.github.io` e registros `A` do apex para os IPs do GitHub Pages
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153). Se os
   nameservers do domínio ainda estiverem no Wix, é lá que a mudança precisa
   acontecer.
5. **Domínio e HTTPS.** Em Settings > Pages, preencha *Custom domain* com
   `www.desenhe.com.br` e marque *Enforce HTTPS* assim que o certificado sair.
6. **Depois do corte.** Reenviar `https://www.desenhe.com.br/sitemap.xml` no
   Google Search Console e conferir no relatório de cobertura se as URLs
   antigas do Wix estão sendo consolidadas nas novas.

## Blog

Os posts moram em `content/blog/<slug>.md` (o nome do arquivo é o endereço,
`/blog/<slug>`) e as imagens em `public/images/blog/<slug>/`. Quem escreve
não mexe no repositório: os posts nascem no **ClickUp** e um workflow os traz
para cá.

### Como um post chega ao site

1. Cada tarefa da lista do blog no ClickUp é um post: o **nome** da tarefa é o
   título e a **descrição** é o texto (Título 1 vira subtítulo no site).
2. Quando a tarefa vai para o status **publicar**, o workflow
   [`blog-clickup.yml`](.github/workflows/blog-clickup.yml) (de hora em hora,
   das 8h às 23h) roda `scripts/clickup-sync.mjs`: baixa texto e imagens,
   converte as fotos para WebP (e a capa também para um JPEG de preview de
   link), grava o post, confere com o build, faz o commit e dispara o deploy.
3. A tarefa vai para **publicado** e ganha um comentário com o link. Se faltar
   algo (resumo, capa) ou o build recusar o post, ela volta para
   **escrevendo** com um comentário dizendo o que ajustar; o site no ar não
   muda.

Para atualizar um post já publicado, basta voltar a tarefa para **publicar**:
ele é regravado no mesmo endereço. Mexer na tarefa sem mudar o status não
altera o site. Para publicar sem esperar a próxima hora: aba Actions >
*Blog (ClickUp)* > *Run workflow*.

Todo post do site tem a sua tarefa: os que existiam antes do sync (os
migrados do Wix e os primeiros escritos aqui) foram copiados para a lista
em 18/11/2026, já em **publicado**, e cada arquivo guarda o id da tarefa em
`clickupId`. Editar um post à mão no repositório funciona, mas a próxima
publicação pelo ClickUp regrava o arquivo com o que está na tarefa. O
`legacyPath` é a exceção: ele não existe no ClickUp e o sync o mantém.

### Configurar o ClickUp (uma vez)

Na lista do blog:

- **Status**: `pauta`, `escrevendo`, `publicar`, `publicado` (os três últimos
  são os que o script usa; nomes diferentes vão nas variáveis
  `CLICKUP_STATUS_READY`, `CLICKUP_STATUS_ERROR` e `CLICKUP_STATUS_DONE` do
  workflow).
- **Campos personalizados** (o script acha pelo nome, sem ligar para acento):

  | Campo | Tipo | Obrigatório | Se vazio |
  | --- | --- | --- | --- |
  | Resumo | texto | sim | a tarefa volta com aviso |
  | Data de publicação | data | não | dia em que foi publicado |
  | Autora | texto ou lista | não | quem criou a tarefa |
  | Categoria | lista suspensa | não | sem categoria |
  | Descrição da capa | texto | não | o título (melhor preencher: é o texto alternativo da foto) |
  | Endereço | texto | não | gerado do título |
  | Curso relacionado | lista suspensa ou texto | não | sem o bloco "Aprenda isso em aula" |
  | Sua vez | texto | não | sem o exercício no fim do post |

- **Vídeos**: também como anexo (ver "Vídeo" abaixo).
- **Capa**: anexo da tarefa, de preferência com o nome começando por `capa`
  (senão vale a primeira imagem anexada). JPG ou PNG; HEIC do iPhone não é
  lido.

### O que a pessoa escreve vira o quê

- **Categoria**: vira uma pílula do filtro da `/blog`, com a contagem de
  posts. Categoria nova aparece no filtro sozinha. O filtro tem endereço
  próprio (`/blog?categoria=dicas-de-desenho`), e a categoria no topo de cada
  post leva até ele. Vale usar sempre os mesmos nomes no ClickUp: "Dicas de
  desenho" e "Dica de desenho" virariam duas pílulas.
- **Curso relacionado**: o nome do curso (basta um pedaço que só um curso
  tenha, como "Aquarela" ou "Figura Humana"). O post fecha com o card do curso
  e um botão de WhatsApp. Um nome que não bate com nenhum curso devolve a
  tarefa com a lista dos nomes válidos.
- **Sua vez**: um exercício de uma frase ("Pinte uma esfera com três tons da
  mesma cor"). Vira um bloco no fim do post que abre o quadro de desenho do
  livro de visitas; o desenho vai para o mural do rodapé.
- **Materiais**: no texto, um título "Materiais" seguido de uma lista. Sai do
  texto corrido e vira a ficha ao lado do post.
- **Paleta**: sai sozinha. No build, as cores principais das imagens do
  post (capa, fotos e cartazes dos vídeos) viram as amostras da ficha, com
  um nome descritivo ("Vermelho", "Bege", "Azul escuro") e a nota "Cores
  tiradas das imagens do post". Imagens quase sem cor não rendem paleta.
  Para mostrar os pigmentos de verdade, escreva um título "Paleta" seguido de
  uma lista com nome e código da cor em cada linha
  (`Azul ultramar #1f3a93`): essa lista substitui a automática.
- **Autora**: se o nome for igual ao de um professor de `/professores`, a
  assinatura embaixo do título mostra a foto dele num círculo, o papel e o
  link para a bio.
- **Duas ou três imagens seguidas** (sem linha em branco entre elas) ficam
  lado a lado, no mesmo recorte em pé. Uma imagem sozinha ocupa a coluna.
- **Vídeo**: anexe o arquivo à tarefa (MOV ou MP4, até 90 segundos) e, no
  texto, escreva o nome do arquivo sozinho numa linha, no lugar em que ele
  deve aparecer. Pode vir com "Vídeo:" na frente e a legenda depois:
  `Vídeo: tomates.mov - Aula de pintura a óleo`. O sync converte sozinho
  (inclusive os vídeos HDR de iPhone) e gera a versão que toca em loop na
  página, a completa com som para o visor e o cartaz. Colado a uma imagem,
  sem linha em branco, os dois ficam lado a lado. Vídeo anexado que não for
  citado no texto fica de fora, e o comentário de "publicado" avisa.
- **Tabela**: vira a tabela comparativa do post, com rolagem lateral em telas
  muito estreitas.
- **Imagens do texto**: abrem ampliadas no visor ao clicar. Para dar uma
  legenda, escreva uma linha em itálico logo abaixo da imagem, sem linha em
  branco entre as duas: ela sai do texto e aparece embaixo da foto. (O
  ClickUp não guarda legenda de imagem, por isso o itálico.)
- **Links para o site**: cole o endereço completo
  (`https://www.desenhe.com.br/cursos`); o sync troca por um caminho do
  próprio site. Link relativo (`/cursos`) o ClickUp estraga.

No GitHub (Settings > Secrets and variables > Actions):

- *Secret* `CLICKUP_TOKEN`: token pessoal do ClickUp (Settings > Apps > API
  Token, começa com `pk_`). O ideal é gerar com uma conta que só tenha acesso
  ao espaço do blog.
- *Variable* `CLICKUP_LIST_ID`: o número que aparece na URL da lista
  (`.../li/<id>`).

Post com **data futura** fica no repositório mas só aparece no site no dia: o
`deploy.yml` roda sozinho todo dia às 6h05 para isso.

Um vídeo num post escrito à mão (sem ClickUp) usa o mesmo formato que o
sync grava: `![descrição](/videos/blog/<slug>/nome.mp4 "legenda")`, com
`nome.mp4`, `nome-loop.mp4` e `nome.webp` em `public/videos/blog/<slug>/`.
Quem gera os três é o `saveVideo` de `scripts/blog-video.mjs` (precisa de
`ffmpeg`), e o build avisa se faltar algum.

Para testar o sync na sua máquina sem esperar o workflow:

```bash
CLICKUP_TOKEN=pk_... CLICKUP_LIST_ID=... node scripts/clickup-sync.mjs --check
```

## URLs antigas

Todas as URLs do site Wix continuam funcionando: estão em `LEGACY_REDIRECTS`
(páginas, uma a uma, mais os posts migrados do blog, que declaram a URL
antiga no campo `legacyPath`) e `LEGACY_WILDCARDS` (posts não migrados,
categorias e tags do blog, páginas de evento) em `src/routes.tsx`. Cada URL nomeada vira um HTML pré-renderizado
com `meta refresh` de 0s mais `canonical` do destino (ver
`src/components/Redirect.tsx`), que é o mais perto de um 301 possível no GitHub
Pages, que não emite redirect de servidor.

Ao renomear uma rota, acrescente a URL antiga em `LEGACY_REDIRECTS` e tire a
antiga do `public/sitemap.xml`: só o endereço novo entra no sitemap.

## Campanhas em destaque (`FEATURED_PROMOS`)

O espaço "Em destaque" do site (Colônia de Férias de inverno, Colônia de
verão, Coworking, o que vier depois) é controlado por um único ponto:
`src/data/promo.ts`.

Cada campanha é um objeto `FeaturedPromo` (id, rota, rótulo de nav, imagem do
card e texto da faixa). A lista `FEATURED_PROMOS` diz o que está em cartaz, na
ordem de exibição; vazia, nada é divulgado:

```ts
// src/data/promo.ts
export const FEATURED_PROMOS: FeaturedPromo[] = [];                                  // nada em cartaz
// export const FEATURED_PROMOS: FeaturedPromo[] = [COWORKING_PROMO];                 // uma só, fixa
// export const FEATURED_PROMOS: FeaturedPromo[] = [COWORKING_PROMO, COLONIA_INVERNO_2026]; // giram
```

Campanha **sem página própria** (um evento, como a exposição de fim de ano)
não leva `path`: preenche `event` (título, texto, ficha com quando, onde e
entrada, e a mensagem do WhatsApp), e o card abre um pop-up
(`src/components/PromoEventModal.tsx`) em vez de levar a uma rota. Ela não
entra no menu do topo. Com `until: 'AAAA-MM-DD'`, a campanha sai do destaque
sozinha no primeiro build depois desse dia (o deploy roda todo dia às 6h05).
`seal: true` põe o selo animado da exposição de fim de ano
(`src/components/ExpoSeal.tsx`, desenhado no Figma) no canto do card e do
pop-up; o componente pode ser usado em qualquer outro lugar da exposição.

O site inteiro lê essa lista:

- **`src/components/SiteHeader.tsx`**: cada campanha vira um link
  `nav.label → path` na navegação (desktop e menu mobile), logo depois de
  "Professores".
- **`src/pages/Home.tsx`**: mostra o card "Em destaque" (`FeaturedPromoCard`)
  ao lado do texto do hero no desktop e numa seção própria logo abaixo do hero
  no mobile/tablet (`.promo-section`, escondida no desktop). Com mais de uma
  campanha, o card se reveza sozinho a cada `PROMO_ROTATION_MS` (6 s) e ganha
  pontos para trocar na mão. A rotação pausa com o mouse em cima e não roda
  para quem pediu "menos movimento" no sistema. Com a lista vazia, o layout do
  hero se ajusta sozinho e a seção do mobile some.

Fora da lista, a página promovida (ex.: `/colonia-de-ferias`) continua
acessível por URL direta; ela só some da divulgação.

### Trocar as campanhas

1. Em `src/data/promo.ts`, defina um novo preset `FeaturedPromo` ou ajuste um
   existente.
2. Coloque as duas imagens do card em `public/images/<campanha>/`: uma em
   retrato 4:5 para o desktop (`hero.image`, ex.: 900×1125) e uma quadrada
   1:1 para o mobile (`hero.imageMobile`, ex.: 900×900). Preencha também
   `hero.imageAlt` e o `summary` (título, texto e link da seção do mobile).
3. Edite `FEATURED_PROMOS` (acrescente, tire ou reordene) e faça push: o
   deploy é automático.

