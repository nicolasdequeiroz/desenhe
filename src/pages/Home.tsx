import {Link} from 'react-router-dom';
import {Button} from '../ui';
import {Seo} from '../components/Seo';
import {ColoniaPromoBar} from '../components/ColoniaPromoBar';
import {FeaturedCoursesSection} from '../components/FeaturedCoursesSection';
import {SpaceShowcaseSection} from '../components/SpaceShowcaseSection';
import {TestimonialsSection} from '../components/TestimonialsSection';
import {WhatsCta} from '../components/WhatsCta';
import {asset} from '../data';

export function Home() {
  return (
    <>
      <Seo path="/" />

      <ColoniaPromoBar />

      <section className="hero">
        <div className="hero__background" aria-hidden="true">
          <img
            src={asset('/images/espaco/professor-biblioteca.avif')}
            alt=""
            className="hero__background-image"
          />
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
                    message="Olá! Quero agendar uma aula experimental na Desenhe."
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

              <div className="hero__gallery">
                <span className="hero__gallery-badge">Em destaque</span>
                <Link to="/colonia-de-ferias" className="hero__featured-card">
                  <img
                    src={asset('/images/colonia/poster-hero.jpg')}
                    alt="Colônia de Férias de Inverno 2026, Desenhe, Curitiba"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedCoursesSection />

      <SpaceShowcaseSection />

      <TestimonialsSection />
    </>
  );
}
