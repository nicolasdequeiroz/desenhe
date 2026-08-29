# Desenhe — Escola de Arte

Novo site institucional da [Desenhe](https://www.desenhe.com.br) (Curitiba/PR), construído com:

- **Vite + React + TypeScript**
- **Design system próprio** em CSS puro: tokens em `src/styles/tokens.css` e
  componentes em `src/ui/` (sem dependências de UI de terceiros)
- **vite-react-ssg** para pré-renderizar cada página em HTML estático (SEO)
- **GitHub Pages** como hospedagem, com deploy automático via GitHub Actions

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
push; o deploy é automático.

## Design system

Tokens definidos em `src/styles/tokens.css` (`:root`), consumidos via
`var(--...)` no `site.css` e nos componentes de `src/ui/`:

- **Acento:** laranja da marca `#F67800`
- **Fundos:** tons de papel/gesso quentes; site travado em modo escuro
  (`color-scheme: dark`), com as seções de Depoimentos e footer em superfície
  clara própria (variáveis `--surface-warm-*`)
- **Tipografia:** Courier Prime (títulos) + Manrope (corpo), via Google Fonts

## Deploy e domínio

O push na branch `main` dispara o workflow `.github/workflows/deploy.yml`, que
builda e publica no GitHub Pages (Settings → Pages → Source: **GitHub Actions**).

Para publicar no domínio próprio:

1. Em **Settings → Pages → Custom domain**, informe `www.desenhe.com.br`
   (isso cria o arquivo `CNAME` automaticamente).
2. No DNS (registro.br), crie um `CNAME` de `www` apontando para
   `<usuario>.github.io` e registros `A`/`ALIAS` do apex para os IPs do
   GitHub Pages.
3. Enquanto o domínio não estiver ativo, o site fica em
   `https://<usuario>.github.io/<repo>/` — nesse caso, descomente o
   `BASE_PATH` no workflow.

## URLs antigas

As URLs do site Wix redirecionam client-side (ver `LEGACY_REDIRECTS` em
`src/routes.tsx`): `/precos-mensalidades` → `/precos`,
`/pintura-a-oleo-ou-acrilica` → `/cursos/pintura-a-oleo-ou-acrilica`,
`/cursos/para-alem-do-canone` → `/cursos/historia-da-arte`, `/blog` → `/`.

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
3. Aponte `FEATURED_PROMO` para o preset (ou `null` para desligar) e faça push;
   o deploy é automático.

O `id` de cada campanha é a chave do "fechar" da faixa no `sessionStorage`:
trocar de campanha faz a faixa reaparecer mesmo para quem fechou a anterior.
