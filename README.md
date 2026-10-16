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

## URLs antigas

Todas as URLs do site Wix continuam funcionando: estão em `LEGACY_REDIRECTS`
(páginas, uma a uma) e `LEGACY_WILDCARDS` (posts, categorias do blog e páginas
de evento) em `src/routes.tsx`. Cada URL nomeada vira um HTML pré-renderizado
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

