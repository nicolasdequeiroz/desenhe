# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Institutional site for **Desenhe · Escola de Arte** (an art school in Curitiba, PR, Brazil), rebuilt from a Wix site. Content is in Portuguese. Vite + React + TypeScript, statically pre-rendered via `vite-react-ssg` and deployed to GitHub Pages.

## Writing style

Never use em dashes (—) or en dashes as sentence punctuation (–), in site copy, comments, commit messages, or any other text you write in this repo. Use a comma, colon, semicolon, period, or parentheses instead. This applies everywhere except literal numeric ranges (e.g. schedule times like `14h–16h`), which may keep an en dash.

## Commands

```bash
npm run dev          # dev server at http://localhost:5173
npm run build        # tsc -b && vite-react-ssg build: outputs static HTML for every route into dist/
npm run preview      # serve the production build
npm run lint         # oxlint
npm run build:deploy # what CI runs: build + copy 404.html + touch .nojekyll, into dist/
```

There is no test suite. `npm run build` is the main correctness check: it runs the full TypeScript compile (`tsc -b`) before the SSG build, so type errors fail the build.

Deploy is automatic: every push to `main` runs `.github/workflows/deploy.yml`, which installs, builds, and uploads the result straight to GitHub Pages (Settings > Pages > Source: **GitHub Actions**). Nothing generated is committed. The one knob is `BASE_PATH` in the workflow's `env`: `/desenhe/` while the site is served from `https://<user>.github.io/desenhe/`, `/` once the custom domain is in place. `vite.config.ts` reads it, and `asset()` in `src/data/site.ts` prefixes every image path with it, so getting it wrong breaks every asset and link. There is no `CNAME` file: with workflow-based publishing the custom domain is stored in the Pages settings. An earlier setup published a committed `docs/` folder; that folder is gone and gitignored. The launch checklist (including turning the guestbook on) is in the README.

## Classes (Client-First, adapted)

Styling follows a trimmed-down version of Finsweet's Client-First. Read this before writing any CSS or `className`.

**Two kinds of class, told apart by the underscore.**
- **Utility classes have no underscore** and live in `src/styles/utilities.css`. They are global, context-free and stackable: `heading-style-h2`, `text-size-large`, `text-color-secondary`, `margin-bottom margin-medium`.
- **Custom classes have an underscore** (the existing BEM `block__element--modifier`, e.g. `.course-card__title`, `.ic-why__card`) and live in `site.css`. They handle layout, structure and anything specific to one component. Don't rename existing BEM classes to Client-First's `folder_element` form; new custom classes keep the BEM shape.

**Typography: never invent a size.** Every `font-size` comes from the semantic scale in `tokens.css`, either through a utility class in JSX or a `--heading-*` / `--text-size-*` token in custom CSS. No new `clamp()`, `px` or `rem` font sizes in `site.css`, and no direct use of the raw `--font-size-*` steps either (they only feed the semantic tokens and the bare `h1` to `h6` defaults). The only allowed exception is an `em` size relative to its parent, for an inline part of a heading (e.g. `.featured-courses__link-subtitle` at `0.5em`). The whole site already follows this; `grep -n "font-size: " src/site.css | grep -v "var(--heading\|var(--text-size"` should only list those `em` cases.

| Role | Utility class | Token | Size |
| --- | --- | --- | --- |
| Hero `h1`, colored CTA band headline | `heading-style-display` | `--heading-display` | 30 to 48px |
| Section title (`h2`) | `heading-style-h2` | `--heading-h2` | 28 to 40px |
| Title inside a large card (form, contact block) | `heading-style-h3` | `--heading-h3` | 24 to 32px |
| Block title, pull quote | `heading-style-h4` | `--heading-h4` | 23px |
| Card title | `heading-style-h5` | `--heading-h5` | 19px |
| Small heading | `heading-style-h6` | `--heading-h6` | 15px |
| Section lead (text under a section title) | `text-size-large` | `--text-size-large` | 16px |
| Body copy | `text-size-regular` | `--text-size-regular` | 15px |
| Caption, note, hint | `text-size-small` | `--text-size-small` | 12px |
| Uppercase label (fact sheet, metadata) | `text-style-label` / `text-size-tiny` | `--text-size-tiny` | 10px |

The `heading-style-*` classes carry the site's heading look (Courier Prime, bold, uppercase, tight leading), so a heading needs no custom typography rule at all. `<Text type="large">` and `<Section lead>` already render at `--text-size-large`; a hand-written lead must match it, not be bigger. A note next to a title (e.g. "Não achou a sua? Chame no WhatsApp") is body copy (`text-size-regular`), not a lead. Section kickers keep using `.section__eyebrow`.

**Spacing.** Prefer `gap` on the parent. When a single element needs space, use a Client-First pair: a direction class plus a size class (`margin-top margin-small`, `padding-bottom padding-large`). Sizes map to the `--spacing-*` tokens: `tiny` 4, `xxsmall` 8, `xsmall` 16, `small` 24, `medium` 32, `large` 48, `xlarge` 64, `xxlarge` 80. Custom CSS uses `var(--spacing-*)`, never raw pixels for margins and paddings.

**Color and surfaces.** Text colors come from `text-color-primary` / `text-color-secondary` / `text-color-accent` (or the matching tokens). Section backgrounds are the default page color; `section--muted` and `--color-background-surface` (a lighter brown) are for deliberate contrast only. The cream "warm paper" surface (`--surface-warm-*`) is reserved for the testimonials section and the footer: don't use it for new blocks. Don't color a word inside a heading in orange; headings are one color.

**Reuse before inventing.** Before writing a new section or component, look for an existing one and adapt it with props or a scoped override. The ones that keep coming up:
- `Section` (kicker, title, lead, children) for any titled section.
- `Timeline` for step-by-step processes ("Como funciona", "Como trabalhamos").
- `NoteGrid`, with `icon` notes inside `.coworking-highlights`, for short title + text cards.
- `.course-grid` + `.course-card` (polaroid cards) for any list of offerings with a photo.
- `.course-summary` (via `FactsSummary`) for the two-column fact sheet under a hero.
- `.course-deck` for a colored first fold with a fanned deck of photos; `.hero` with `hero__background` for a full-bleed photo first fold.
- `FaqItem` inside `.coworking-faq` for FAQs; `.course-cta` for the closing colored band.

## Architecture

**Static-site generation, not a typical SPA/client app.** `vite-react-ssg` (`src/main.tsx`) renders every route in `src/routes.tsx` to its own static HTML file at build time (`dist/cursos/desenho-artistico.html`, etc.) for SEO, then hydrates client-side. Routes are defined as a `RouteRecord[]` tree, all nested under a single `RootLayout` (`src/components/RootLayout.tsx`: header + `<Outlet/>` + footer + floating WhatsApp button). Course detail routes are generated by mapping over the `COURSES` data array rather than using a dynamic `:slug` param + `getStaticPaths`, specifically so each course gets its own pre-rendered HTML file.

**Content lives in `src/data/`, not hardcoded in JSX.** Course copy, teacher bios, pricing tiers, weekly schedule, and site-wide constants (address, WhatsApp number, social links) are plain TypeScript data files (`courses.ts`, `teachers.ts`, `pricing.ts`, `schedule.ts`, `site.ts`), re-exported through `src/data/index.ts`. Pages import from `../data` and map over it: updating a price or schedule slot means editing a data file, not a component. `src/data/site.ts` also exports two helpers used everywhere: `whatsappLink(message)` (builds a `wa.me`-style link with a pre-filled message; this is the site's only "form", there's no backend) and `asset(path)` (prefixes a path with `import.meta.env.BASE_URL` so images resolve correctly whether the site is served from `/` or a GitHub Pages subpath).

**No UI framework dependency: `src/ui/` is a small hand-rolled component library.** (An earlier version of this project used the Astryx design system; it was fully removed and replaced with this local equivalent, so don't reintroduce `@astryxdesign/*`.) `Button`, `Text`, `Heading`, `Badge`, `Card`, `Divider`, `Blockquote`, `EmptyState` live in `src/ui/` and are re-exported from `src/ui/index.ts`; import from `'../ui'`, not individual files. `Button` renders a react-router `<Link>` for internal hrefs, a plain `<a>` for external ones, or a `<button>` if there's no href. Visual styling for these primitives comes from `src/ui/ui.css` plus token variables, not component-level CSS-in-JS.

**Design tokens are plain CSS custom properties, cascaded through one entry point.** `src/index.css` imports, in order: `styles/reset.css` → `styles/tokens.css` (all color/spacing/typography/radius tokens as `--variables` on `:root`) → `ui/ui.css` → `site.css` (2000+ lines, all page/section-specific structural CSS, BEM-ish class names like `.space-showcase__gallery-item--sm`) → `styles/utilities.css` (global utility classes, last so they win; see "Classes" below). There is no CSS-in-JS, CSS modules, or Tailwind. The site is locked to dark mode (`color-scheme: dark` is forced regardless of OS preference) except the testimonials section and footer, which intentionally use a separate light "warm paper" surface (`--surface-warm-*` tokens) for visual contrast.

**Page composition pattern:** most pages are `<Seo/>` (sets title/description/canonical/OG/Twitter tags via `vite-react-ssg`'s `<Head>`; it falls back to the school's facade photo for `og:image` since WhatsApp does not preview the site's `.webp` images, and takes a `noindex` prop for pages that stay online but out of search, currently the off-season Colônia de Férias) followed by a `<Section/>` (generic kicker/title/lead/children wrapper, `src/components/Section.tsx`) or bespoke section components for the home page (`FeaturedCoursesSection`, `SpaceShowcaseSection`, `TestimonialsSection`). Course detail pages (`CursoDetalhe.tsx`) are driven entirely by a `slug` prop looked up against `COURSES`.

**Legacy URL redirects.** Every URL from the old Wix site is preserved: `LEGACY_REDIRECTS` in `src/routes.tsx` maps each old page one by one (e.g. `/precos-mensalidades` to `/precos`, `/oscar-pedroso` to `/professores#oscar-pedroso`), and `LEGACY_WILDCARDS` catches the Wix families with no equivalent here (blog posts, blog categories, event pages). Each named redirect is pre-rendered to a real HTML file whose head carries a 0s `meta refresh` plus a `canonical` pointing at the destination (`src/components/Redirect.tsx`): GitHub Pages cannot issue a 301, and a client-only redirect would reach crawlers as an empty page, losing the old URL's search history. Wildcards have no file of their own and redirect through the `404.html` fallback. When adding or renaming a route, add the old path to `LEGACY_REDIRECTS` and keep only the new URL in `public/sitemap.xml`.

**The footer is a drawing guestbook.** Visitors draw in a small canvas panel (`GuestbookPanel.tsx`, opened by the star button) and the drawing drops into a physics pile of polaroid cards at the bottom of the page (`DoodlePile.tsx`, matter-js, dynamically imported, and the only user of that dep). Drawings are stored as **vector strokes with normalized 0..1 coordinates** (`src/data/guestbook.ts`), never as images, so the same record is redrawn crisply at any size and fits in a spreadsheet cell.

Persistence is a **Google Apps Script web app backed by a Google Sheet**: the site is static on GitHub Pages and has no server of its own. Paste the deployed `/exec` URL into `GUESTBOOK_ENDPOINT` in `src/data/guestbook.ts` to turn it on; with it empty, drawings are saved to `localStorage` and are only visible to whoever drew them. The script and setup steps live in `apps-script/`. Moderation is done by writing `oculto` in the sheet's status column. The POST deliberately uses `Content-Type: text/plain` because Apps Script does not answer the CORS preflight.
