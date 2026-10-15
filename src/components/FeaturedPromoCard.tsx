import {useRef, useState, type CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight, CaretLeft, CaretRight} from '@phosphor-icons/react';
import {asset, type FeaturedPromo} from '../data';
import {usePromoRotation} from './usePromoRotation';

/** Distância mínima (px) de um arrasto horizontal para contar como swipe. */
const SWIPE_THRESHOLD = 40;

/**
 * Card "Em destaque" da home. No desktop fica ao lado do texto do hero; no
 * mobile/tablet a home renderiza outra cópia numa seção logo abaixo do hero
 * (`.promo-section`) e o CSS mostra só a do tamanho de tela certo. Com mais
 * de uma campanha em `FEATURED_PROMOS`, as fotos correm num carrossel, com
 * pontos e setas (ao lado do selo, no desktop) para trocar na mão e swipe no
 * touch. A rotação pausa com o mouse em
 * cima, o dedo na tela ou o foco do teclado dentro do card.
 *
 * `withSummary` (a versão da seção do mobile) usa a imagem quadrada
 * `hero.imageMobile` em vez da retrato e acrescenta acima do carrossel o
 * `summary` de cada campanha: título, texto e link, alinhados à esquerda. Os
 * textos de todas as campanhas ficam empilhados na mesma célula e só o da
 * ativa aparece, então a altura é a do maior e o carrossel não pula quando a
 * campanha troca.
 */
export function FeaturedPromoCard({
  promos,
  withSummary = false,
}: {
  promos: FeaturedPromo[];
  withSummary?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = usePromoRotation(promos.length, paused);
  const touchStartX = useRef<number | null>(null);
  const active = promos[index];

  const go = (step: number) =>
    setIndex((index + step + promos.length) % promos.length);

  // Setas de anterior/próxima ladeando o selo, só no card do desktop (no
  // mobile o topo já tem os pontos e o swipe).
  const arrows = !withSummary && promos.length > 1;

  const dots = promos.length > 1 && (
    <div className="hero__featured-dots">
      {promos.map((promo, i) => (
        <button
          key={promo.id}
          type="button"
          className={`hero__featured-dot${i === index ? ' is-active' : ''}`}
          aria-label={`Mostrar ${promo.nav.label}`}
          aria-pressed={i === index}
          onClick={() => setIndex(i)}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`hero__gallery${withSummary ? ' hero__gallery--summary' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero__gallery-top">
        {arrows && (
          <button
            type="button"
            className="hero__featured-arrow"
            aria-label="Campanha anterior"
            onClick={() => go(-1)}
          >
            <CaretLeft size={12} weight="bold" aria-hidden="true" />
          </button>
        )}
        <span className="hero__gallery-badge">{active.hero.badge}</span>
        {arrows && (
          <button
            type="button"
            className="hero__featured-arrow"
            aria-label="Próxima campanha"
            onClick={() => go(1)}
          >
            <CaretRight size={12} weight="bold" aria-hidden="true" />
          </button>
        )}
        {withSummary && dots}
      </div>
      {withSummary && (
        <div className="promo-summary">
          {promos.map((promo, i) => (
            <div
              key={promo.id}
              className={`promo-summary__item${i === index ? ' is-active' : ''}`}
              aria-hidden={i === index ? undefined : true}
            >
              <h2 className="promo-summary__title">{promo.summary.title}</h2>
              <p className="promo-summary__text">{promo.summary.text}</p>
              <Link
                to={promo.path}
                className="promo-summary__link"
                tabIndex={i === index ? undefined : -1}
              >
                {promo.summary.cta}
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      )}
      <div
        className="hero__featured-stack"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          setPaused(false);
          if (start === null || promos.length < 2) return;
          const delta = event.changedTouches[0].clientX - start;
          if (Math.abs(delta) >= SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
        }}
      >
        <div
          className="hero__featured-track"
          style={{'--index': index} as CSSProperties}
        >
          {promos.map((promo, i) => (
            <Link
              key={promo.id}
              to={promo.path}
              className="hero__featured-card"
              aria-hidden={i === index ? undefined : true}
              tabIndex={i === index ? undefined : -1}
              draggable={false}
            >
              <img
                src={asset(withSummary ? promo.hero.imageMobile : promo.hero.image)}
                alt={promo.hero.imageAlt}
                draggable={false}
              />
            </Link>
          ))}
        </div>
      </div>
      {!withSummary && dots}
    </div>
  );
}
