import {Link} from 'react-router-dom';
import {Button} from '../ui';
import {Seo} from '../components/Seo';
import {FeaturedCoursesSection} from '../components/FeaturedCoursesSection';
import {SpaceShowcaseSection} from '../components/SpaceShowcaseSection';
import {TestimonialsSection} from '../components/TestimonialsSection';
import {WhatsCta} from '../components/WhatsCta';
import {asset} from '../data';

export function Home() {
  return (
    <>
      <Seo path="/" />

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
          <div className="hero__main">
            <div className="hero__bottom">
              <div className="hero__subheading">
                <div className="hero__heading">
                  <span className="section__eyebrow">
                    Escola de arte em Curitiba · desde 1988
                  </span>
                  <h1 className="hero__title">
                    Aqui você aprende a desenhar!
                  </h1>
                  <p className="hero__lead">
                    Técnica e desenvolvimento criativo são as bases da arte de
                    alto nível. 38 anos de experiência para todas as idades.
                  </p>
                </div>
                <div className="hero__actions">
                  <WhatsCta
                    message="Olá! Quero agendar uma aula experimental na Desenhe."
                    label="Agendar aula experimental"
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
                <span className="section__eyebrow">Em destaque</span>
                <Link to="/colonia-de-ferias" className="hero__featured-card">
                  <img
                    src={asset('/images/colonia/poster-hero.jpg')}
                    alt="Colônia de Férias de Inverno 2026 — Desenhe, Curitiba"
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
