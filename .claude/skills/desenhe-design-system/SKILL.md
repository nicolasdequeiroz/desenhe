---
name: desenhe-design-system
description: Design system do site da Desenhe (Client-First adaptado, tokens de tokens.css, componentes de src/ui e padrões de página). Use SEMPRE antes de mexer em qualquer coisa visual do site da Desenhe, mesmo um ajuste pequeno, e antes de escrever ou revisar CSS, className, cor, tamanho de fonte, espaçamento, seção nova, componente, imagem de primeira dobra ou layout. Também para responder dúvidas sobre a paleta, a tipografia ou como estilizar algo no site.
---

# Design system da Desenhe

Guia de como estilizar o site (Vite + React, CSS puro). Siga isto antes de escrever qualquer CSS ou `className`. Os valores reais vivem no código; este guia diz onde estão e quais regras valem.

## Onde as coisas vivem

`src/index.css` importa, nesta ordem:

1. `styles/reset.css`
2. `styles/tokens.css`: **todas** as variáveis (cor, tipografia, espaçamento, raio, sombra, duração) em `:root`.
3. `ui/ui.css`: estilo dos componentes de `src/ui/` (Button, Text, Heading, Badge, Card, Divider, Blockquote, EmptyState). Importe sempre de `'../ui'`.
4. `site.css`: CSS estrutural de páginas e seções (classes BEM).
5. `styles/utilities.css`: classes utilitárias globais, por último para vencer.

Não há Tailwind, CSS-in-JS nem CSS modules. Não reintroduza `@astryxdesign/*`.

## Dois tipos de classe (o underline decide)

- **Utilitária, sem underline**, em `utilities.css`: global, sem contexto, empilhável. Ex.: `heading-style-h2`, `text-size-large`, `text-color-secondary`, `margin-bottom margin-medium`.
- **Custom, com underline**, em `site.css`: BEM `bloco__elemento--modificador` (`.course-card__title`, `.ic-why__card`). Cuida de layout, estrutura e o que é específico de um componente. Não renomeie BEM existente para o formato `pasta_elemento` do Client-First; classes novas seguem o BEM.

## Tipografia: nunca invente um tamanho

Todo `font-size` vem da escala semântica de `tokens.css`: pela classe utilitária no JSX ou pelo token `--heading-*` / `--text-size-*` no CSS. Nada de `clamp()`, `px` ou `rem` novos em `site.css`, e nada de usar direto os `--font-size-*` crus (eles só alimentam os tokens semânticos e os `h1` a `h6` base). Única exceção: um tamanho em `em` relativo ao pai, para um trecho inline de um título (ex.: `.featured-courses__link-subtitle` a `0.5em`).

| Papel | Classe utilitária | Token | Tamanho |
| --- | --- | --- | --- |
| `h1` de hero, título de faixa colorida de CTA | `heading-style-display` | `--heading-display` | 30 a 48px |
| Título de seção (`h2`) | `heading-style-h2` | `--heading-h2` | 28 a 40px |
| Título dentro de cartão grande (formulário, contato) | `heading-style-h3` | `--heading-h3` | 24 a 32px |
| Título de bloco, citação destacada | `heading-style-h4` | `--heading-h4` | 23px |
| Título de card | `heading-style-h5` | `--heading-h5` | 19px |
| Título pequeno | `heading-style-h6` | `--heading-h6` | 15px |
| Texto de apoio de seção (lead) | `text-size-large` | `--text-size-large` | 16px |
| Texto corrido | `text-size-regular` | `--text-size-regular` | 15px |
| Legenda, nota, dica | `text-size-small` | `--text-size-small` | 12px |
| Rótulo em caixa alta (ficha, metadado) | `text-style-label` / `text-size-tiny` | `--text-size-tiny` | 10px |

- `heading-style-*` já traz o visual de título (Courier Prime, bold, caixa alta, entrelinha curta): o título não precisa de regra de tipografia própria.
- `<Text type="large">` e `<Section lead>` já saem em `--text-size-large`; um lead escrito à mão usa o mesmo tamanho, nunca maior.
- Uma nota ao lado de título ("Não achou a sua? Chame no WhatsApp") é texto corrido (`text-size-regular`), não lead.
- Kicker de seção continua com `.section__eyebrow`.
- 48px (`--heading-display`) é o teto. Se pedirem um título "bem maior", use `--heading-display`; passar disso é abrir exceção à escala, e isso se confirma antes com quem pediu.
- Para conferir: `grep -n "font-size: " src/site.css | grep -v "var(--heading\|var(--text-size"` só deve listar os casos em `em`.

## Espaçamento

- Prefira `gap` no pai.
- Quando um elemento sozinho precisa de espaço, use o par Client-First: classe de direção + classe de tamanho (`margin-top margin-small`, `padding-bottom padding-large`).

| Classe de tamanho | Valor | Token no CSS |
| --- | --- | --- |
| `tiny` | 4px | `--spacing-1` |
| `xxsmall` | 8px | `--spacing-2` |
| `xsmall` | 16px | `--spacing-4` |
| `small` | 24px | `--spacing-6` |
| `medium` | 32px | `--spacing-8` |
| `large` | 48px | `--spacing-12` |
| `xlarge` | 64px | `calc(var(--spacing-8) * 2)` |
| `xxlarge` | 80px | `calc(var(--spacing-10) * 2)` |

Os tokens de CSS são **numéricos** (`--spacing-1`, `-2`, `-3`, `-4`, `-5`, `-6`, `-8`, `-10`, `-12`); não existe `--spacing-small` nem `--spacing-xsmall`. CSS custom usa `var(--spacing-*)`, nunca pixels soltos para margem e padding.

Larguras máximas utilitárias: `max-width-small` (28rem), `max-width-medium` (36rem), `max-width-large` (44rem).

## Cor e superfícies

O site é **dark fixo** (`color-scheme: dark`, independente do sistema).

| Uso | Token | Valor |
| --- | --- | --- |
| Fundo da página | `--color-background-body` | `#171310` |
| Card, fundo "muted" | `--color-background-card` / `--color-background-muted` | `#1d1813` |
| Superfície mais clara (contraste deliberado) | `--color-background-surface` | `#282219` |
| Texto principal | `--color-text-primary` | `#eee0d7` |
| Texto secundário | `--color-text-secondary` | `#bba79c` |
| Laranja da marca (acento) | `--color-accent` | `#f67800` |
| Borda | `--color-border` / `--color-border-emphasized` | translúcida / `#53443a` |
| Marrom café (faixas de In Company) | `--color-corporate` | `#6b4630` |

- Texto colorido via `text-color-primary` / `text-color-secondary` / `text-color-accent` (ou os tokens).
- Fundo de seção é a cor padrão da página; `section--muted` e `--color-background-surface` só para contraste deliberado.
- Cores de categoria de curso (`--color-category-*`), de professor (`--color-teacher-tone-*`) e da grade de horários (`--color-course-*`) têm uso próprio: não reaproveite como cor de interface genérica.
- O creme "papel" (`--surface-warm-*`, `#fff4e0`) é o light mode da Desenhe e fica **reservado** aos depoimentos e ao rodapé. Não use em blocos novos.
- Título é de uma cor só; não pinte uma palavra de laranja. **Exceção:** o `h1` das páginas de In Company destaca uma palavra-chave com `text-color-accent` (nas páginas de formato ela vem de `titleHighlight` em `src/data/inCompany.ts`).
- Uma cor nova vira token em `tokens.css` com um comentário de uso; nunca hex solto em `site.css`. O fundo `#171310` aparece escrito direto em vários `color-mix()` antigos: em código novo, use `var(--color-background-body)`.
- Fora da paleta e aceitos de propósito: verde do WhatsApp (`#25d366`), vermelho de erro do livro de visitas (`#a33333`), cores de pincel do livro de visitas, branco e preto da Central da Marca, preto translúcido em sombras. Os selos (`Badge`, em `ui.css`) também saem da paleta: laranja do acento, texto principal e o âmbar `--color-category-infantil` no `warning`.

## Botões

Os botões de `/componentes` são a verdade absoluta: `Button` (`src/ui/Button.tsx`) com as variantes `primary`, `secondary`, `ghost`, `tint` e os tamanhos `sm`, `md`, `lg`. O `.btn` fixa `--color-accent` e `--color-on-accent` nos tokens da marca (`--color-accent-brand`, `--color-on-accent-brand`), então o laranja é o mesmo em qualquer página, inclusive nas de curso que trocam `--color-accent` pela cor da categoria. Não sobrescreva cor, tamanho ou fonte de `.btn` por página ou contexto; ajuste de layout (largura, margem) pode. Se um fundo não combinar com o primário, troque a variante (`secondary`, `ghost`), não a cor. Botão novo usa o componente, não uma classe própria. Texto de botão curto (até 3 palavras): o contexto vem do título, não do botão.

## Reaproveite antes de inventar

A página escondida `/componentes` (`src/pages/Componentes.tsx`, fora do menu, do sitemap e com `noindex`) mostra cores, tipografia, espaçamento e cada componente renderizado com dados reais. Consulte antes de criar algo e, ao criar um componente novo, acrescente um exemplo lá.

Antes de criar seção ou componente, procure um existente e adapte com props ou um override escopado:

- `Section` (kicker, título, lead, children): qualquer seção com título.
- `Timeline`: processos passo a passo ("Como funciona", "Como trabalhamos").
- `NoteGrid`, com notas `icon` dentro de `.coworking-highlights`: cards curtos de título + texto.
- `.course-grid` + `.course-card` (polaroids): lista de ofertas com foto.
- `.course-summary` (via `FactsSummary`): ficha de fatos em duas colunas sob um hero. Em In Company, `InCompanyFacts` (régua de dados curtos + linha de textos, com fios).
- `.course-deck`: primeira dobra colorida com baralho de fotos em leque. `.hero` com `hero__background`: primeira dobra com foto sangrando.
- `.course-deck__relics`: objetos recortados (PNG/WebP transparente) no lugar do baralho, como em História da Arte e In Company.
- `CourseGallery` (parede de polaroids com visor): aceita `videos` no mesmo índice de `images` (a imagem vira o cartaz). Na parede o vídeo toca mudo, em loop e só enquanto está à vista (`LoopVideo`, arquivo `-loop.mp4` leve e sem áudio); no visor abre o arquivo completo com som e controles nativos, sem moldura e na proporção dele. Vídeo novo: H.264 + AAC, `+faststart`, 720px de largura no completo e 540px sem áudio no loop, em `public/videos/`. Vídeo de iPhone vem em HLG (HDR): converter para SDR com tone mapping, senão fica lavado.
- `FaqItem` dentro de `.coworking-faq`: FAQ. `.course-cta`: faixa colorida de fechamento.

## Padrões de In Company (páginas de formato)

- Faixa de abertura e faixa final em `--color-corporate`; a abertura tem gradiente leve de café sob um quadriculado de blueprint (`.ic-page--formato .course-deck`).
- Objetos da primeira dobra vêm de `relics` em `src/data/inCompany.ts`, cada um com `scale` (altura relativa), `translucent` (vidro, acetato, acrílico) e `overlap` (aproxima do vizinho mantendo a fileira centralizada). No celular os objetos deslizam em loop.
- Objeto de vidro ou acrílico: deixe translúcida só a parte transparente editando a imagem, não com `mix-blend-mode` (multiply some no fundo escuro).
- Imagens de objeto: WebP com fundo transparente, 900px de altura (`cwebp -q 85 -alpha_q 100 -resize 0 900`), em `public/images/in-company/`.
- Ajuste de uma página só: cada página de formato tem a classe `ic-page--{slug}`.

## SEO

- `<Seo>` em toda página (title, description, canonical, og). Preview de link só em JPEG ou PNG (o WhatsApp não gera de `.webp`); In Company tem a imagem própria de cada página em `public/images/og/`, gerada por `scripts/og-in-company.py` com a mesma cena dos cards (`.ic-card-scene`: fundo café quadriculado e os objetos do serviço sobrepostos), sem título na imagem.
- Dados estruturados (JSON-LD) saem dos dados da tela, em `src/data/seo.ts`, injetados por `<JsonLd graph={[...]} />`: Service, FAQPage, Person e BreadcrumbList nas páginas de formato, ItemList e FAQPage no hub, organização local na home. O que está no JSON-LD tem que estar visível na página.
- O sitemap é gerado no fim do `npm run build` (`scripts/sitemap.mjs`), a partir das páginas pré-renderizadas: entra sozinho o que for indexável e fica de fora `noindex` e redirecionamento. Não existe mais `public/sitemap.xml` para editar à mão.
- URL de página de serviço leva o termo buscado; ao renomear uma que já está no ar, acrescentar a antiga em `LEGACY_REDIRECTS` (`src/routes.tsx`). O H1 de In Company é o termo buscado + o nome do serviço (`page.h1`), e a etiqueta do card é o termo (`typeLabel`).
- Imagem de primeira dobra: `loading="eager"` e `width`/`height` (CSS fixa a altura). Foto real leva `alt` descritivo com o termo buscado de forma natural; objeto decorativo fica com `alt=""`.

## Escrita

Nunca use travessão (—) nem meia-risca (–) como pontuação, em texto do site, comentário, commit ou qualquer coisa escrita no repo. Use vírgula, dois-pontos, ponto e vírgula, ponto ou parênteses. Só intervalos numéricos (`14h–16h`) podem manter a meia-risca.

## Antes de terminar

1. `npm run build` passa (roda `tsc -b` antes do build).
2. Nada de `font-size`, cor ou espaçamento solto fora dos tokens.
3. Conferir no navegador, desktop e celular, quando a mudança é visível.
