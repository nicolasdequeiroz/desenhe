import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {PromoBar} from '../components/PromoBar';
import {FeaturedCoursesSection} from '../components/FeaturedCoursesSection';
import {SpaceShowcaseSection} from '../components/SpaceShowcaseSection';
import {TestimonialsSection} from '../components/TestimonialsSection';
import {WhatsCta} from '../components/WhatsCta';
import {asset, FEATURED_PROMO} from '../data';

/**
 * No mobile o fundo do hero vira um vídeo curto em loop (a versão desktop
 * segue com a foto). O vídeo só é montado quando a tela é estreita e o
 * usuário não pediu "menos movimento", pra não baixar os ~4 MB à toa.
 */
function useHeroVideo(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 900px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(narrow.matches && !calm.matches);
    update();
    narrow.addEventListener('change', update);
    calm.addEventListener('change', update);
    return () => {
      narrow.removeEventListener('change', update);
      calm.removeEventListener('change', update);
    };
  }, []);

  return enabled;
}

/**
 * Vídeo de fundo do hero no mobile. O atributo `muted` do JSX não basta:
 * o React nem sempre reflete isso na propriedade do elemento, e sem
 * `video.muted === true` o iOS bloqueia o autoplay e desenha aquele botão
 * de play gigante no meio. Aqui forçamos `muted` na marra e chamamos
 * `play()` (inclusive ao voltar pra aba). Se o autoplay for barrado
 * mesmo assim (ex.: Modo de Baixo Consumo do iOS), o CSS esconde os
 * controles nativos e sobra só o poster, sem botão nenhum.
 */
function HeroBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const play = () => {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {});
      }
    };

    play();
    const onVisible = () => {
      if (document.visibilityState === 'visible') play();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  return (
    <video
      ref={ref}
      className="hero__background-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={asset('/images/espaco/hero-mobile-poster.webp')}
    >
      <source src={asset('/videos/hero-mobile.webm')} type="video/webm" />
      <source src={asset('/videos/hero-mobile.mp4')} type="video/mp4" />
    </video>
  );
}

export function Home() {
  const heroVideo = useHeroVideo();

  return (
    <>
      <Seo path="/" image="/images/brand/og-home.jpg" />

      {FEATURED_PROMO && <PromoBar promo={FEATURED_PROMO} />}

      <section className="hero">
        <div className="hero__background" aria-hidden="true">
          <img
            src={asset('/images/espaco/fachada-desenhe.webp')}
            alt=""
            className="hero__background-image"
          />
          {heroVideo && <HeroBackgroundVideo />}
          <div className="hero__background-overlay" />
        </div>

        <div className="container hero__inner">
          <div className="hero__top">
            <span className="section__eyebrow hero__top-eyebrow">
              Desde 1988 ensinando
              <br />
              arte em Curitiba
            </span>
          </div>
          <div className="hero__main">
            <div className="hero__bottom">
              <div className="hero__subheading">
                <div className="hero__heading">
                  <h1 className="hero__title">
                    Aqui você aprende a desenhar!
                  </h1>
                  <p className="hero__lead">
                    Aulas de desenho e pintura para todas as idades e níveis,
                    do primeiro traço à técnica avançada, em turmas pequenas e
                    no ritmo de cada aluno.
                  </p>
                </div>
                <div className="hero__actions">
                  <WhatsCta
                    message="Olá! Quero agendar a primeira aula na Desenhe."
                    label="Agende sua primeira aula"
                    size="sm"
                  />
                  <Button
                    label="Ver cursos"
                    href="/cursos"
                    variant="secondary"
                    size="sm"
                  />
                </div>
              </div>

              {FEATURED_PROMO && (
                <div className="hero__gallery">
                  <span className="hero__gallery-badge">
                    {FEATURED_PROMO.hero.badge}
                  </span>
                  <Link to={FEATURED_PROMO.path} className="hero__featured-card">
                    <img
                      src={asset(FEATURED_PROMO.hero.image)}
                      alt={FEATURED_PROMO.hero.imageAlt}
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FeaturedCoursesSection />

      <SpaceShowcaseSection />

      <TestimonialsSection />

      {/* Fecha a home na mesma faixa colorida das páginas de curso e de /sobre. */}
      <section className="course-cta course-cta--desenho">
        <div className="container course-cta__inner">
          <div className="course-cta__copy">
            <span className="course-cta__eyebrow">Matrículas abertas o ano todo</span>
            <Heading level={2} className="course-cta__headline">
              Comece{' '}
              <span className="course-cta__highlight">pelo primeiro traço.</span>
            </Heading>
            <Text type="large" color="inherit" display="block" className="course-cta__lead">
              Turmas de no máximo 8 alunos, cronograma no seu ritmo e uma
              primeira aula (experimental) para você sentir como é.
            </Text>
            <div className="course-cta__action">
              <WhatsCta
                message="Olá! Quero agendar a primeira aula na Desenhe."
                label="Agendar primeira aula"
                size="sm"
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
