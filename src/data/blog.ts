/**
 * Posts do blog.
 *
 * Cada post é um arquivo `content/blog/<slug>.md`: o nome do arquivo é o
 * endereço (`/blog/<slug>`) e o topo do arquivo traz os dados (título, data,
 * capa...). Quem escreve não mexe aqui: os posts nascem no ClickUp e o
 * `scripts/clickup-sync.mjs` grava o arquivo (ver README, seção Blog). O
 * plugin `scripts/blog-markdown.ts` valida cada arquivo e entrega o corpo já
 * em HTML.
 */

import {COURSES, type Course} from './courses';
import {TEACHERS, type Teacher} from './teachers';

export interface BlogPostMeta {
  slug: string;
  title: string;
  /** Resumo de uma ou duas frases: vai no card da lista e no Google. */
  description: string;
  /** AAAA-MM-DD. Post com data futura só aparece a partir do dia. */
  date: string;
  author: string;
  category?: string;
  /** Capa em WebP (`/images/blog/<slug>/capa.webp`). */
  cover: string;
  coverAlt: string;
  /** JPEG da capa para o preview do link (o WhatsApp não lê WebP). */
  ogImage?: string;
  /** Rascunho: fica no repositório, mas fora do site. */
  draft: boolean;
  /** URL antiga (sem a barra inicial) que passa a redirecionar para o post. */
  legacyPath?: string;
  readingMinutes: number;
  /** Curso relacionado, como veio do post: nome ou slug. Ver `relatedCourse`. */
  course?: string;
  /** Exercício do bloco "Sua vez", no fim do post. */
  exercise?: string;
  /** Lista sob o título "Materiais" do post: vira a ficha lateral. */
  materials?: string[];
  /** Lista sob o título "Paleta" ("Azul ultramar #1f3a93"): vira as amostras. */
  palette?: {name: string; hex: string}[];
  /**
   * De onde veio a paleta: da lista escrita no post (os pigmentos de verdade)
   * ou tirada sozinha das imagens no build (scripts/blog-palette.ts).
   */
  paletteSource?: 'texto' | 'imagens';
  /**
   * Imagens e vídeos do texto, na ordem, para o visor de ampliar. Num vídeo,
   * `src` é o cartaz e `video` traz o arquivo completo e o loop leve.
   */
  images: {src: string; alt: string; video?: {src: string; loop: string}}[];
}

export interface BlogPost extends BlogPostMeta {
  html: string;
  /** Curso que ensina o assunto do post ("Aprenda isso em aula"). */
  relatedCourse?: Course;
  /** Quando quem assina é professor da escola: foto, papel e link para a bio. */
  teacher?: Teacher;
}

const plain = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

/**
 * Acha o curso pelo slug ou pelo nome, com folga: "Aquarela" encontra
 * "Técnicas de Pintura a Base d'Água: Tinta Aquarela e Guache". Um nome que
 * não bate com nenhum curso (ou bate com mais de um) derruba o build, para o
 * erro aparecer para quem escreveu em vez de o card sumir em silêncio.
 */
function findCourse(value: string, slug: string): Course {
  const wanted = plain(value);
  const exact = COURSES.find(
    (c) => c.slug === wanted || plain(c.shortTitle) === wanted || plain(c.title) === wanted,
  );
  if (exact) return exact;
  const partial = COURSES.filter(
    (c) => plain(c.shortTitle).includes(wanted) || plain(c.title).includes(wanted),
  );
  if (partial.length === 1) return partial[0];
  throw new Error(
    `[blog] ${slug}.md: o curso relacionado "${value}" ${
      partial.length ? 'bate com mais de um curso' : 'não existe'
    }. Use um destes: ${COURSES.map((c) => c.shortTitle).join('; ')}.`,
  );
}

const modules = import.meta.glob<{meta: BlogPostMeta; html: string}>('/content/blog/*.md', {
  eager: true,
});

/** Data do build em Curitiba: é ela que decide se um post agendado já saiu. */
const TODAY = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo'}).format(new Date());

/** Posts publicados, do mais novo para o mais antigo. */
export const BLOG_POSTS: BlogPost[] = Object.values(modules)
  .map(({meta, html}) => ({
    ...meta,
    html,
    relatedCourse: meta.course ? findCourse(meta.course, meta.slug) : undefined,
    teacher: TEACHERS.find((t) => plain(t.name) === plain(meta.author)),
  }))
  .filter((post) => !post.draft && post.date <= TODAY)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

/** Endereço de uma categoria no filtro da /blog: "Dicas de desenho" vira "dicas-de-desenho". */
export function categorySlug(name: string) {
  return plain(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Categorias que têm post publicado, das mais usadas para as menos (empate
 * em ordem alfabética). Vêm dos próprios posts: categoria nova no ClickUp
 * aparece no filtro sozinha, e a que fica sem post some.
 */
export const BLOG_CATEGORIES = Object.values(
  BLOG_POSTS.reduce<Record<string, {name: string; slug: string; count: number}>>((all, post) => {
    if (!post.category) return all;
    const slug = categorySlug(post.category);
    all[slug] ??= {name: post.category, slug, count: 0};
    all[slug].count++;
    return all;
  }, {}),
).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'));

/**
 * Posts para o "Continue lendo" de um post: primeiro os da mesma categoria,
 * depois os que fecham no mesmo curso, e o resto pelo mais recente. Assim a
 * faixa nunca fica curta, mas puxa antes o que tem a ver com o que se leu.
 */
export function relatedPosts(post: BlogPost, limit = 3) {
  const score = (other: BlogPost) =>
    (post.category && other.category === post.category ? 2 : 0) +
    (post.relatedCourse && other.relatedCourse?.slug === post.relatedCourse.slug ? 1 : 0);
  return BLOG_POSTS.filter((other) => other.slug !== post.slug)
    .map((other, index) => ({other, index, score: score(other)}))
    // BLOG_POSTS já vem do mais novo para o mais antigo: o índice desempata.
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({other}) => other);
}

export function getPost(slug: string): BlogPost {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) throw new Error(`Post não encontrado: ${slug}`);
  return post;
}

const SHORT_MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

/** "19 AGO 2025": a data curta dos cards e do destaque, que cabe numa linha de rótulo. */
export function formatPostDateShort(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return `${day} ${SHORT_MONTHS[month - 1]} ${year}`;
}

/** "19 de agosto de 2025". A data é lida como dia local, sem fuso. */
export function formatPostDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}
