import {useState} from 'react';

/**
 * Item de FAQ com painel animado: a altura interpola via `grid-template-rows`
 * (0fr a 1fr) em vez do corte seco do `<details>` nativo, a mesma técnica do
 * accordion mobile das linguagens de curso (ver StrandAccordions.tsx).
 * Usado no Coworking e nas páginas In Company; o estilo é `.coworking-faq`.
 */
export function FaqItem({question, answer}: {question: string; answer: string}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`coworking-faq__item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="coworking-faq__summary"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {question}
        <span className="coworking-faq__icon" aria-hidden="true" />
      </button>
      <div className="coworking-faq__panel">
        <div className="coworking-faq__panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
