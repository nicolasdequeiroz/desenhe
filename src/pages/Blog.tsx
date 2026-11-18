import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from '@phosphor-icons/react';
import {Heading} from '../ui';
import {Seo} from '../components/Seo';
import {BlogCard} from '../components/BlogCard';
import {JsonLd} from '../components/JsonLd';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  asset,
  breadcrumbSchema,
  categorySlug,
  formatPostDate,
  formatPostDateShort,
} from '../data';

/** Parâmetro da URL que guarda o filtro: /blog?categoria=dicas-de-desenho. */
const PARAM = 'categoria';

/**
 * Lista do blog, com abertura de revista: o post mais recente abre a página
 * em destaque (capa grande, título e resumo) e os demais vêm na grade de
 * polaroids, do mais novo para o mais antigo.
 */
export function Blog() {
  const [featured, ...rest] = BLOG_POSTS;

  // Filtro por categoria. A página estática sai sempre com todos os posts
  // (é o que o Google lê); o filtro da URL só é aplicado depois de montar,
  // para o HTML do build e o da hidratação serem iguais. A troca usa
  // replaceState: filtrar não empilha histórico nem rola a página.
  const [active, setActive] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get(PARAM);
    if (!wanted || !BLOG_CATEGORIES.some((category) => category.slug === wanted)) return;
    setActive(wanted);
    // Quem chega pelo link de uma categoria (o rótulo no topo de um post) vai
    // direto para a grade filtrada, sem passar pelo destaque.
    requestAnimationFrame(() => barRef.current?.scrollIntoView({block: 'start'}));
  }, []);
  const choose = (slug: string | null) => {
    setActive(slug);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set(PARAM, slug);
    else url.searchParams.delete(PARAM);
    window.history.replaceState(window.history.state, '', url);
  };

  // No celular as pílulas correm de lado: a escolhida fica sempre à vista.
  useEffect(() => {
    const strip = barRef.current?.querySelector<HTMLElement>('.blog-filter');
    const chip = strip?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!strip || !chip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({left: chip.offsetLeft - strip.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth'});
  }, [active]);

  const activeCategory = BLOG_CATEGORIES.find((category) => category.slug === active);
  // Filtrado, a grade traz todos os posts da categoria, inclusive o do destaque.
  const listed = activeCategory
    ? BLOG_POSTS.filter((post) => post.category && categorySlug(post.category) === active)
    : rest;

  return (
    <>
      <Seo
        title="Blog: técnicas, materiais e bastidores da sala"
        description="O blog da Desenhe, escola de arte em Curitiba: técnicas de desenho e pintura, materiais, bastidores das aulas e trabalhos dos alunos e professores."
        path="/blog"
      />
      <JsonLd graph={[breadcrumbSchema([{name: 'Blog', path: '/blog'}])]} />

      <section className="section blog-index">
        <div className="container">
          <header className="blog-index__head">
            <span className="section__eyebrow">Blog</span>
            <Heading level={1} className="heading-style-h2">
              Arte com afeto e propósito
            </Heading>
            <p className="text-size-large text-color-secondary max-width-medium">
              Técnicas, materiais, bastidores da sala e o que os nossos alunos e professores andam
              produzindo.
            </p>
          </header>

          {featured && (
            <Link to={`/blog/${featured.slug}`} className="blog-feature">
              <div className="blog-feature__frame">
                <img
                  className="blog-feature__cover"
                  src={asset(featured.cover)}
                  alt={featured.coverAlt}
                  loading="eager"
                  width={1600}
                  height={1000}
                />
              </div>
              <div className="blog-feature__copy">
                {/* Categoria em laranja, data e leitura em cinza: duas informações
                    de peso diferente, em vez de uma fila só separada por pontos. */}
                <div className="blog-feature__meta text-style-label">
                  {featured.category && (
                    <span className="blog-feature__category">{featured.category}</span>
                  )}
                  <span className="blog-feature__when">
                    <time dateTime={featured.date} title={formatPostDate(featured.date)}>
                      {formatPostDateShort(featured.date)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{featured.readingMinutes} min de leitura</span>
                  </span>
                </div>
                <h2 className="heading-style-h3 blog-feature__title">{featured.title}</h2>
                <p className="text-size-large text-color-secondary">{featured.description}</p>
                <span className="blog-feature__more">
                  Ler o post <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <>
              <div className="blog-index__bar" ref={barRef}>
                <Heading level={2} className="heading-style-h4 blog-index__more">
                  {activeCategory ? activeCategory.name : 'Mais posts'}
                </Heading>
                {BLOG_CATEGORIES.length > 1 && (
                  <div className="blog-filter" role="group" aria-label="Filtrar posts por categoria">
                    <button
                      type="button"
                      className="blog-filter__chip"
                      aria-pressed={!activeCategory}
                      onClick={() => choose(null)}
                    >
                      Todos
                    </button>
                    {BLOG_CATEGORIES.map((category) => (
                      <button
                        key={category.slug}
                        type="button"
                        className="blog-filter__chip"
                        aria-pressed={active === category.slug}
                        onClick={() => choose(active === category.slug ? null : category.slug)}
                      >
                        {category.name}
                        <span className="blog-filter__count">{category.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="sr-only" aria-live="polite">
                {activeCategory
                  ? `${listed.length} ${listed.length === 1 ? 'post' : 'posts'} em ${activeCategory.name}`
                  : ''}
              </p>
              <div className="course-grid">
                {listed.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
