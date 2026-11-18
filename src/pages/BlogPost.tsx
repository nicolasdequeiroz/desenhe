import {useCallback, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft, Check, LinkSimple, PencilSimple, WhatsappLogo} from '@phosphor-icons/react';
import {Button, Heading} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {BlogCard} from '../components/BlogCard';
import {JsonLd} from '../components/JsonLd';
import {PaintBlob} from '../components/PaintBlob';
import {WhatsCta} from '../components/WhatsCta';
import {useWorkLightbox} from '../components/WorkLightbox';
import {
  ORGANIZATION_ID,
  SITE,
  asset,
  breadcrumbSchema,
  categorySlug,
  formatPostDate,
  getPost,
  relatedPosts,
} from '../data';
import {openGuestbook} from '../data/guestbook';

/** Página de um post: cabeçalho, capa, texto com ficha lateral e fechos. */
export function BlogPost({slug}: {slug: string}) {
  const post = getPost(slug);
  const path = `/blog/${post.slug}`;
  const url = `${SITE.url}${path}`;
  const others = relatedPosts(post);
  const {teacher, relatedCourse: course} = post;

  // As imagens do texto abrem no mesmo visor das galerias dos cursos. O HTML
  // do post vem pronto do build, então o clique é capturado no contêiner.
  const bodyRef = useRef<HTMLDivElement>(null);
  const zoomButton = useCallback(
    (index: number) =>
      bodyRef.current?.querySelector<HTMLElement>(`[data-zoom="${index}"]`) ?? null,
    [],
  );
  const {openWork, lightbox} = useWorkLightbox({
    images: post.images.map((image) => image.src),
    caption: post.title,
    videos: post.images.map((image) => image.video),
    // Foto inteira, sem a moldura de papel dos trabalhos de aluno.
    framed: false,
    getOrigin: zoomButton,
    onClosed: useCallback((index: number) => zoomButton(index)?.focus(), [zoomButton]),
  });
  const onBodyClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-zoom]');
    if (button) openWork(Number(button.dataset.zoom), button);
  };

  // Vídeos do texto: tocam mudos, em loop, só enquanto estão à vista, como
  // os da parede de trabalhos (ver LoopVideo). Com "reduzir movimento"
  // ligado ficam parados no cartaz.
  useEffect(() => {
    const videos = bodyRef.current?.querySelectorAll<HTMLVideoElement>('video[data-loop]');
    if (!videos?.length) return;
    videos.forEach((video) => {
      video.muted = true;
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      {threshold: 0.25},
    );
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [post.slug]);

  // "Copiar link": o botão confirma por dois segundos e volta ao normal.
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const copyLink = () => {
    navigator.clipboard?.writeText(url).then(() => setCopied(true));
  };

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        path={path}
        image={post.ogImage}
        imageAlt={post.ogImage ? post.coverAlt : undefined}
      />
      <JsonLd
        graph={[
          {
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              '@type': 'Person',
              name: post.author,
              ...(teacher ? {jobTitle: teacher.role, worksFor: {'@id': ORGANIZATION_ID}} : {}),
            },
            publisher: {'@id': ORGANIZATION_ID},
            image: `${SITE.url}${post.ogImage ?? post.cover}`,
            mainEntityOfPage: url,
            inLanguage: 'pt-BR',
          },
          breadcrumbSchema([
            {name: 'Blog', path: '/blog'},
            {name: post.title, path},
          ]),
        ]}
      />

      <article className="blog-article">
        {/* Abertura: a capa sangra de ponta a ponta (como a home), por trás do
            header, em menos da metade da altura da tela. Embaixo ela se
            desfaz na cor da página e o título sobe por cima desse fade. */}
        <section className="blog-hero">
          <div className="blog-hero__media">
            <img
              className="blog-hero__image"
              src={asset(post.cover)}
              alt={post.coverAlt}
              loading="eager"
              fetchPriority="high"
              width={1600}
              height={1000}
            />
            <div className="blog-hero__fade" aria-hidden="true" />
          </div>
          <header className="container blog-article__header blog-hero__header">
            <Link to="/blog" className="blog-article__back text-style-label">
              <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Blog
            </Link>
            {post.category && (
              <Link
                to={`/blog?categoria=${categorySlug(post.category)}`}
                className="section__eyebrow blog-article__category"
              >
                {post.category}
              </Link>
            )}
            <Heading level={1} className="heading-style-h2 blog-article__title">
              {post.title}
            </Heading>
            {/* Assinatura: quem escreveu, logo abaixo do título. Professor da
                escola entra com a foto num círculo e o link para a bio. */}
            <div className="blog-byline">
              {teacher && (
                <Link
                  to={`/professores#${teacher.slug}`}
                  className="blog-byline__photo"
                  aria-label={`Bio de ${teacher.name}`}
                >
                  <img src={asset(teacher.photo)} alt="" width={64} height={64} loading="eager" />
                </Link>
              )}
              <div className="blog-byline__copy">
                <p className="blog-byline__name">
                  Por{' '}
                  {teacher ? (
                    <Link to={`/professores#${teacher.slug}`}>{post.author}</Link>
                  ) : (
                    post.author
                  )}
                </p>
                <p className="text-size-small text-color-secondary">
                  {teacher && <>{teacher.role} · </>}
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time> ·{' '}
                  {post.readingMinutes} min de leitura
                </p>
              </div>
            </div>
          </header>
        </section>

        <div className="container blog-article__layout">
          <div
            className="blog-article__body"
            ref={bodyRef}
            onClick={onBodyClick}
            // HTML gerado no build a partir do Markdown do post (scripts/blog-markdown.ts).
            dangerouslySetInnerHTML={{__html: post.html}}
          />

          {/* Ficha do post: o que foi usado e como passar adiante.
              Ao lado do texto no desktop (acompanha a leitura), antes dele no celular. */}
          <aside className="blog-sheet" aria-label="Ficha do post">
            {post.materials && (
              <div className="blog-sheet__block">
                <h2 className="text-style-label blog-sheet__label">Materiais</h2>
                <ul className="blog-sheet__materials">
                  {post.materials.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {post.palette && (
              <div className="blog-sheet__block">
                <h2 className="text-style-label blog-sheet__label">Paleta</h2>
                {post.paletteSource === 'imagens' && (
                  <p className="blog-sheet__note text-size-small text-color-secondary">
                    Cores tiradas das imagens do post.
                  </p>
                )}
                <ul className="blog-sheet__palette">
                  {post.palette.map((color, index) => (
                    <li key={color.hex + color.name} className="blog-sheet__color">
                      <PaintBlob
                        className="blog-sheet__swatch"
                        color={color.hex}
                        seed={`${post.slug}-${index}-${color.hex}`}
                      />
                      <span>
                        {color.name || color.hex}
                        {color.name && (
                          <span className="blog-sheet__hex text-size-small">{color.hex}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="blog-sheet__block">
              <span className="text-style-label blog-sheet__label">Compartilhar</span>
              <div className="blog-sheet__share">
                <a
                  className="blog-sheet__share-button"
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} ${url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappLogo size={18} weight="fill" aria-hidden="true" /> WhatsApp
                </a>
                <button type="button" className="blog-sheet__share-button" onClick={copyLink}>
                  {copied ? (
                    <Check size={18} weight="bold" aria-hidden="true" />
                  ) : (
                    <LinkSimple size={18} weight="bold" aria-hidden="true" />
                  )}
                  <span aria-live="polite">{copied ? 'Link copiado' : 'Copiar link'}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Sua vez: o exercício do post, feito ali mesmo no quadro do livro de
            visitas. O desenho vai para o mural do rodapé. */}
        {post.exercise && (
          <section className="container blog-turn" aria-labelledby="sua-vez">
            <div className="blog-turn__card">
              <div className="blog-turn__copy">
                <h2 id="sua-vez" className="section__eyebrow">
                  Sua vez
                </h2>
                <p className="heading-style-h3 blog-turn__exercise">{post.exercise}</p>
                <p className="text-size-large text-color-secondary">
                  Desenhe aqui mesmo, com o dedo ou o mouse. Seu desenho entra no mural do rodapé
                  do site, junto com os de quem passou por aqui.
                </p>
              </div>
              <Button
                label="Abrir o quadro"
                variant="primary"
                size="lg"
                onClick={() => openGuestbook(post.exercise)}
                className="blog-turn__button"
              />
              <PencilSimple className="blog-turn__pencil" weight="fill" aria-hidden="true" />
            </div>
          </section>
        )}

        {/* Fecho: o curso que ensina o assunto do post, numa faixa na cor da
            categoria dele (a mesma das páginas de curso), com a capa do curso
            num polaroid saindo pela borda. Sem curso, fica a chamada geral. */}
        {course ? (
          <section className="container blog-course" aria-labelledby="aprenda-em-aula">
            <div className={`blog-course__panel blog-course--${course.category}`}>
              <div className="blog-course__copy">
                <span className="blog-course__eyebrow text-style-label">Aprenda isso em aula</span>
                <Heading level={2} id="aprenda-em-aula" className="heading-style-h3 blog-course__title">
                  {course.shortTitle}
                </Heading>
                <p className="text-size-large blog-course__lead">{course.tagline}</p>
                {/* Ficha curta do curso: rótulo à esquerda, resposta à direita,
                    como a ficha das páginas de curso. */}
                <dl className="blog-course__facts">
                  <div className="blog-course__fact">
                    <dt className="text-style-label">Para quem</dt>
                    <dd>{course.audience}</dd>
                  </div>
                  <div className="blog-course__fact">
                    <dt className="text-style-label">Turmas</dt>
                    <dd>Até 8 alunos, com acompanhamento individual</dd>
                  </div>
                  <div className="blog-course__fact">
                    <dt className="text-style-label">Matrículas</dt>
                    <dd>Abertas o ano todo</dd>
                  </div>
                </dl>
                <div className="blog-course__actions">
                  <WhatsCta
                    message={`Olá! Li o post "${post.title}" no blog e quero saber mais sobre o curso de ${course.shortTitle}.`}
                    label="Agendar uma aula"
                    variant="secondary"
                    size="sm"
                  />
                  <Button
                    label="Ver o curso"
                    href={`/cursos/${course.slug}`}
                    variant="secondary"
                    size="sm"
                  />
                </div>
              </div>
              {(course.cover ?? course.gallery[0]) && (
                <Link to={`/cursos/${course.slug}`} className="blog-course__photo" tabIndex={-1} aria-hidden="true">
                  <img
                    src={asset(course.cover ?? course.gallery[0])}
                    alt=""
                    loading="lazy"
                    width={800}
                    height={800}
                  />
                </Link>
              )}
            </div>
          </section>
        ) : (
          <div className="container blog-article__cta">
            <p className="heading-style-h5">Quer desenhar com a gente?</p>
            <WhatsCta
              message={`Olá! Li o post "${post.title}" no blog e quero saber mais sobre as aulas.`}
              label="Fale com a escola"
              variant="secondary"
              size="sm"
            />
          </div>
        )}
      </article>

      {others.length > 0 && (
        <Section kicker="Blog" title="Continue lendo">
          <div className="course-grid">
            {others.map((other) => (
              <BlogCard key={other.slug} post={other} />
            ))}
          </div>
        </Section>
      )}

      {lightbox}
    </>
  );
}
