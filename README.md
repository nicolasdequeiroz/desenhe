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

## Campanha em destaque (`FEATURED_PROMO`)

O espaço "Em destaque" do site (Colônia de Férias de inverno, Colônia de
verão, Coworking, o que vier depois) é controlado por um único ponto:
`src/data/promo.ts`.

Cada campanha é um objeto `FeaturedPromo` (id, rota, rótulo de nav, imagem do
card e texto da faixa). A constante `FEATURED_PROMO` aponta para a campanha em
cartaz, ou é `null` quando não há nenhuma:

```ts
// src/data/promo.ts
export const FEATURED_PROMO: FeaturedPromo | null = null;        // nada em cartaz
// export const FEATURED_PROMO: FeaturedPromo | null = COLONIA_INVERNO_2026;
```

O site inteiro lê essa constante:

- **`src/components/SiteHeader.tsx`** — com `FEATURED_PROMO` definido, o link
  `nav.label → path` entra na navegação (desktop e menu mobile), logo depois
  de "Professores". Com `null`, o link não aparece.
- **`src/pages/Home.tsx`** — mostra o card "Em destaque" ao lado do hero (desktop)
  e a faixa `PromoBar` no topo (mobile/tablet), ambos a partir dos campos de
  `FEATURED_PROMO`. Com `null`, o layout do hero se ajusta sozinho.

Com `null`, a página promovida (ex.: `/colonia-de-ferias`) continua acessível
por URL direta; ela só some da divulgação.

### Trocar a campanha

1. Em `src/data/promo.ts`, defina um novo preset `FeaturedPromo` (há um exemplo
   de `COWORKING` comentado no arquivo) ou ajuste um existente.
2. Coloque a imagem do card em `public/images/<campanha>/` e aponte
   `hero.image`/`hero.imageAlt` para ela.
3. Aponte `FEATURED_PROMO` para o preset (ou `null` para desligar) e faça
   push: o deploy é automático.

O `id` de cada campanha é a chave do "fechar" da faixa no `sessionStorage`:
trocar de campanha faz a faixa reaparecer mesmo para quem fechou a anterior.
