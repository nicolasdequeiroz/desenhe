/**
 * Gera o sitemap.xml a partir das páginas já pré-renderizadas em dist/.
 *
 * A lista nunca fica desatualizada: toda página nova entra sozinha, e ficam
 * de fora as que não devem ser indexadas (as com `noindex`, como a Colônia
 * de Férias e a /componentes) e os redirecionamentos das URLs antigas do Wix
 * (meta refresh). O endereço de cada página é o `canonical` dela, o mesmo que
 * o Google vai ler. Roda no fim do `npm run build`.
 *
 * Sem `lastmod` de propósito: uma data que muda a cada deploy, sem a página
 * ter mudado, faz o Google desconfiar de todas.
 */
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const DIST = process.env.BUILD_OUT_DIR || 'dist';
const SITE_URL = 'https://www.desenhe.com.br';

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html') && entry.name !== '404.html') yield path;
  }
}

const canonicalOf = (html) =>
  html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1] ??
  html.match(/<link[^>]*href="([^"]+)"[^>]*rel="canonical"/i)?.[1];

const urls = new Set();
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  if (/http-equiv="refresh"/i.test(html)) continue;
  if (/<meta[^>]*name="robots"[^>]*noindex/i.test(html)) continue;
  const canonical = canonicalOf(html);
  if (!canonical) throw new Error(`Sem canonical em ${file}`);
  if (!canonical.startsWith(SITE_URL)) throw new Error(`Canonical fora do domínio em ${file}: ${canonical}`);
  urls.add(canonical);
}
if (urls.size === 0) throw new Error('Nenhuma página encontrada para o sitemap.');

const sorted = [...urls].sort((a, b) => a.length - b.length || a.localeCompare(b));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sorted.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${sorted.length} páginas`);
