import {useEffect, useRef} from 'react';
import type {CourseStrand} from '../data';

/**
 * Blocos das linguagens de um curso guarda-chuva (ex.: Mangá, HQ, Cartoon).
 *
 * São renderizados como `<details open>` para o texto existir sem JS e para
 * os buscadores. Depois de hidratar: no desktop ficam sempre abertos (viram
 * três cards lado a lado, não colapsáveis); no mobile viram accordions e
 * começam fechados.
 */
export function StrandAccordions({strands}: {strands: CourseStrand[]}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mq = window.matchMedia('(max-width: 860px)');
    const items = Array.from(root.querySelectorAll('details'));
    const apply = () => {
      // Mobile: fechados (accordion). Desktop: sempre abertos.
      items.forEach((item) => {
        item.open = !mq.matches;
      });
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
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
            <p className="course-strand-card__text">{strand.description}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
