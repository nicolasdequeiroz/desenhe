import {useEffect, useRef} from 'react';
import type {CourseStrand} from '../data';

const MOBILE_QUERY = '(max-width: 860px)';

/**
 * Blocos das linguagens de um curso guarda-chuva (ex.: Mangá, HQ, Cartoon).
 *
 * São renderizados como `<details open>` para o texto existir sem JS e para
 * os buscadores. Depois de hidratar: no desktop ficam sempre abertos (viram
 * três cards lado a lado, não colapsáveis); no mobile viram accordions.
 *
 * A abertura no mobile é animada só via CSS: um `data-open` no card controla
 * o painel, que interpola de `grid-template-rows: 0fr` a `1fr` (bem mais
 * suave que o salto do `<details>` nativo). O atributo `open` fica sempre
 * ligado, então o texto continua no DOM mesmo fechado; quem esconde é o
 * painel. O clique no summary tem o toggle nativo cancelado para não brigar
 * com isso.
 */
export function StrandAccordions({strands}: {strands: CourseStrand[]}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mq = window.matchMedia(MOBILE_QUERY);
    const cards = Array.from(
      root.querySelectorAll<HTMLDetailsElement>('.course-strand-card'),
    );

    const sync = () => {
      const mobile = mq.matches;
      cards.forEach((card) => {
        card.open = true;
        if (mobile) {
          if (card.dataset.open === undefined) card.dataset.open = 'false';
        } else {
          delete card.dataset.open;
        }
      });
    };

    const onSummaryClick = (event: MouseEvent) => {
      if (!mq.matches) return;
      // Sem isto o `<details>` tira o atributo `open` e o painel some de
      // vez, sem a transição.
      event.preventDefault();
      const summary = event.currentTarget as HTMLElement;
      const card = summary.closest<HTMLDetailsElement>('.course-strand-card');
      if (!card) return;
      card.dataset.open = card.dataset.open === 'true' ? 'false' : 'true';
    };

    const summaries = cards
      .map((card) =>
        card.querySelector<HTMLElement>('.course-strand-card__summary'),
      )
      .filter((el): el is HTMLElement => el !== null);

    summaries.forEach((summary) =>
      summary.addEventListener('click', onSummaryClick),
    );
    sync();
    // As transições só entram depois do primeiro estado aplicado, senão os
    // três painéis "fecham" animando no carregamento do mobile.
    const raf = requestAnimationFrame(() =>
      root.classList.add('course-strands--ready'),
    );
    mq.addEventListener('change', sync);

    return () => {
      cancelAnimationFrame(raf);
      summaries.forEach((summary) =>
        summary.removeEventListener('click', onSummaryClick),
      );
      mq.removeEventListener('change', sync);
    };
  }, [strands]);

  return (
    <div className="course-strands" ref={ref}>
      <div
        className={`course-strands__grid course-strands__grid--${strands.length}`}
      >
        {strands.map((strand) => (
          <details key={strand.name} className="course-strand-card" open>
            <summary className="course-strand-card__summary">
              <h2 className="course-strand-card__title">
                Curso de {strand.name}
              </h2>
              <span className="course-strand-card__chevron" aria-hidden="true" />
            </summary>
            <div className="course-strand-card__panel">
              <div className="course-strand-card__panel-inner">
                <p className="course-strand-card__text">{strand.description}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
