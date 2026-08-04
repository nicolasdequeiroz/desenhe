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
