/**
 * Plugin do Vite que transforma cada post do blog (`content/blog/*.md`) num
 * módulo JS com os metadados validados e o corpo já convertido em HTML.
 *
 * A conversão acontece só no build (Node): o navegador recebe o HTML pronto,
 * sem biblioteca de Markdown no bundle. Um post com campo faltando ou data
 * inválida derruba o build com uma mensagem em português dizendo qual arquivo
 * e qual campo, e como o deploy só publica build que passou, o site no ar
 * continua o anterior.
 */
import {existsSync} from 'node:fs';
import {basename, resolve} from 'node:path';
import {Marked, type Tokens} from 'marked';
import {parse as parseYaml} from 'yaml';
import type {Plugin} from 'vite';
import {extractPalette} from './blog-palette.ts';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Campos obrigatórios do topo de cada post. */
const REQUIRED = ['title', 'description', 'date', 'author', 'cover', 'coverAlt'] as const;

/** Palavras por minuto de leitura, para o "X min de leitura". */
const WORDS_PER_MINUTE = 200;

/** Escapa texto que vai dentro de um atributo HTML (alt, title, href). */
const attr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function fail(file: string, message: string): never {
  throw new Error(`[blog] ${basename(file)}: ${message}`);
}

/** Texto de um token inline, sem marcação: vira o `id` âncora de um subtítulo. */
function anchorId(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Sem acento e em minúsculas, para comparar títulos de seção. */
const plain = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

/** Títulos de seção que viram a ficha lateral do post em vez de texto corrido. */
const MATERIALS_HEADINGS = ['materiais', 'material', 'materiais usados', 'o que usei', 'o que usamos'];
const PALETTE_HEADINGS = ['paleta', 'paleta de cores', 'cores', 'cores usadas'];

const HEX = /#([0-9a-f]{6}|[0-9a-f]{3})\b/i;

export function blogMarkdown(): Plugin {
  let base = '/';
  /** Imagens locais do post em transformação, na ordem: abrem no visor. */
  let zoomable: {src: string; alt: string; video?: {src: string; loop: string}}[] = [];
  /** Arquivo do post em transformação, para as mensagens de erro. */
  let current = '';

  /** Caminho absoluto do site ganha o base path do deploy, como o `asset()`. */
  const withBase = (href: string) =>
    href.startsWith('/') && !href.startsWith('//') ? `${base.replace(/\/$/, '')}${href}` : href;

  const marked = new Marked({
    gfm: true,
    renderer: {
      // O título do post é o h1 da página: no texto, `#` vira h2 e o resto desce junto.
      heading({tokens, depth}: Tokens.Heading) {
        const level = Math.min(depth + 1, 4);
        const text = this.parser.parseInline(tokens);
        const id = anchorId(text.replace(/<[^>]+>/g, ''));
        return `<h${level} id="${id}">${text}</h${level}>\n`;
      },
      // Parágrafo só de imagens vira uma galeria (uma, duas ou três lado a
      // lado) em vez de <p>: figure dentro de <p> é HTML inválido, e imagens
      // em pé ficam altas demais sozinhas na coluna.
      paragraph({tokens}: Tokens.Paragraph) {
        const images = tokens.filter((token) => token.type === 'image');
        const onlyImages =
          images.length > 0 &&
          tokens.every(
            (token) =>
              token.type === 'image' ||
              token.type === 'br' ||
              (token.type === 'text' && !token.text.trim()),
          );
        if (!onlyImages) return `<p>${this.parser.parseInline(tokens)}</p>\n`;
        const count = Math.min(images.length, 3);
        return `<div class="blog-article__gallery blog-article__gallery--${count}">${this.parser.parseInline(images)}</div>\n`;
      },
      image({href, title, text}: Tokens.Image) {
        let img: string;
        if (/\.mp4$/i.test(href) && href.startsWith('/')) {
          // Vídeo: escrito como uma imagem que aponta para o .mp4. Ao lado dele
          // moram a versão leve e muda que toca em loop na página (-loop.mp4)
          // e o cartaz (.webp). O completo, com som, abre no visor.
          const loop = href.replace(/\.mp4$/i, '-loop.mp4');
          const poster = href.replace(/\.mp4$/i, '.webp');
          for (const file of [href, loop, poster]) {
            if (!existsSync(`public${file}`)) {
              fail(current, `o vídeo ${href} precisa de três arquivos e faltou public${file}.`);
            }
          }
          const index = zoomable.push({src: poster, alt: text, video: {src: href, loop}}) - 1;
          const label = text ? `Assistir ao vídeo: ${text}` : 'Assistir ao vídeo';
          img = `<button type="button" class="blog-article__zoom blog-article__zoom--video" data-zoom="${index}" aria-label="${attr(label)}"><video src="${attr(withBase(loop))}" poster="${attr(withBase(poster))}" muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1" data-loop></video></button>`;
        } else {
          img = `<img src="${attr(withBase(href))}" alt="${attr(text)}" loading="lazy" decoding="async">`;
          // Imagem do próprio site abre no visor de trabalhos (ver BlogPost):
          // o botão em volta dá o clique e o foco de teclado.
          if (href.startsWith('/') && !href.startsWith('//')) {
            const index = zoomable.push({src: href, alt: text}) - 1;
            const label = text ? `Ampliar imagem: ${text}` : 'Ampliar imagem';
            img = `<button type="button" class="blog-article__zoom" data-zoom="${index}" aria-label="${attr(label)}">${img}</button>`;
          }
        }
        // Imagem com legenda (o "título" do Markdown) vira figure + figcaption.
        return title
          ? `<figure>${img}<figcaption>${attr(title)}</figcaption></figure>`
          : img;
      },
      link({href, title, tokens}: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.includes('desenhe.com.br');
        const attrs = [
          `href="${attr(withBase(href))}"`,
          title ? `title="${attr(title)}"` : '',
          external ? 'target="_blank" rel="noopener"' : '',
        ]
          .filter(Boolean)
          .join(' ');
        return `<a ${attrs}>${text}</a>`;
      },
    },
  });

  return {
    name: 'desenhe-blog-markdown',
    configResolved(config) {
      base = config.base;
    },
    async transform(source, id) {
      if (!id.endsWith('.md') || !id.includes('/content/blog/')) return null;

      const slug = basename(id, '.md');
      if (!SLUG.test(slug)) {
        fail(id, 'o nome do arquivo vira o endereço do post e só pode ter letras minúsculas sem acento, números e hífens.');
      }

      const match = source.match(FRONTMATTER);
      if (!match) fail(id, 'faltou o bloco de dados entre as linhas "---" no começo do arquivo.');
      const data = (parseYaml(match[1]) ?? {}) as Record<string, unknown>;
      const body = match[2].trim();

      for (const field of REQUIRED) {
        if (typeof data[field] !== 'string' || !(data[field] as string).trim()) {
          fail(id, `faltou o campo "${field}".`);
        }
      }
      // O YAML lê 2026-11-16 como Date: aceita os dois e guarda como texto.
      const rawDate = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
      if (typeof rawDate !== 'string' || !DATE.test(rawDate)) {
        fail(id, `a data "${String(data.date)}" precisa estar no formato AAAA-MM-DD.`);
      }
      if (!body) fail(id, 'o post está sem texto.');

      const words = body.split(/\s+/).filter(Boolean).length;
      const meta = {
        slug,
        title: data.title,
        description: data.description,
        date: rawDate,
        author: data.author,
        category: typeof data.category === 'string' ? data.category : undefined,
        cover: data.cover,
        coverAlt: data.coverAlt,
        ogImage: typeof data.ogImage === 'string' ? data.ogImage : undefined,
        draft: data.draft === true,
        // Curso relacionado: nome ou slug, resolvido em src/data/blog.ts.
        course: typeof data.course === 'string' && data.course.trim() ? data.course.trim() : undefined,
        // Exercício do "Sua vez", no fim do post.
        exercise: typeof data.exercise === 'string' && data.exercise.trim() ? data.exercise.trim() : undefined,
        legacyPath: typeof data.legacyPath === 'string' ? data.legacyPath.replace(/^\//, '') : undefined,
        readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      };

      // "Materiais" e "Paleta" seguidos de uma lista saem do texto corrido e
      // viram a ficha lateral do post. Quem escreve só usa título + lista.
      const tokens = marked.lexer(body);
      const materials: string[] = [];
      const palette: {name: string; hex: string}[] = [];
      for (let i = 0; i < tokens.length; i++) {
        const heading = tokens[i];
        if (heading.type !== 'heading') continue;
        const name = plain(heading.text.replace(/[:.]$/, ''));
        const isMaterials = MATERIALS_HEADINGS.includes(name);
        const isPalette = PALETTE_HEADINGS.includes(name);
        if (!isMaterials && !isPalette) continue;
        let next = i + 1;
        while (tokens[next]?.type === 'space') next++;
        const list = tokens[next];
        if (list?.type !== 'list') continue;
        const items = (list as Tokens.List).items.map((item) => item.text.trim());
        if (isPalette) {
          // Paleta só vale se toda linha trouxer a cor: "Azul ultramar #1f3a93".
          if (!items.every((item) => HEX.test(item))) continue;
          for (const item of items) {
            const hex = item.match(HEX)![0].toLowerCase();
            palette.push({name: item.replace(HEX, '').replace(/[\s:,;()-]+$/, '').trim(), hex});
          }
        } else {
          // Texto simples: marcação inline (negrito, link) não entra na ficha.
          materials.push(...items.map((item) => item.replace(/[*_`]|\[([^\]]+)\]\([^)]*\)/g, '$1')));
        }
        tokens.splice(i, next - i + 1);
        i--;
      }

      zoomable = [];
      current = id;
      // Tabela ganha um contêiner com rolagem lateral, para não estourar no celular.
      const html = marked
        .parser(tokens)
        .replace(/<table>/g, '<div class="blog-article__table"><table>')
        .replace(/<\/table>/g, '</table></div>');
      // Sem lista "Paleta" no texto, a paleta sai sozinha das imagens do
      // post (capa, fotos e cartazes dos vídeos). Ver scripts/blog-palette.ts.
      let paletteSource: 'texto' | 'imagens' | undefined = palette.length ? 'texto' : undefined;
      if (!palette.length) {
        const files = [data.cover as string, ...zoomable.map((item) => item.src)]
          .filter((src) => src.startsWith('/'))
          .map((src) => resolve('public', `.${src}`));
        palette.push(...(await extractPalette(files)));
        if (palette.length) paletteSource = 'imagens';
      }
      Object.assign(meta, {
        images: zoomable,
        ...(materials.length ? {materials} : {}),
        ...(palette.length ? {palette, paletteSource} : {}),
      });

      return {
        code: `export const meta = ${JSON.stringify(meta)};\nexport const html = ${JSON.stringify(html)};\n`,
        map: null,
      };
    },
  };
}
