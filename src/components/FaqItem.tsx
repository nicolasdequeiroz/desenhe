import {useState, type ReactNode} from 'react';

/**
 * Item de FAQ com painel animado: a altura interpola via `grid-template-rows`
 * (0fr a 1fr) em vez do corte seco do `<details>` nativo, a mesma técnica do
 * accordion mobile das linguagens de curso (ver StrandAccordions.tsx).
 * Usado no Coworking, nas páginas In Company e nos acordeões da Central da
 * Marca (com `children` no lugar de `answer`); o estilo é `.coworking-faq`.
 */
export function FaqItem({
  question,
  answer,
  children,
}: {
  question: string;
  answer?: string;
  children?: ReactNode;
}) {
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
          {answer && <p>{answer}</p>}
          {children && <div className="coworking-faq__panel-body">{children}</div>}
        </div>
      </div>
    </div>
  );
}
