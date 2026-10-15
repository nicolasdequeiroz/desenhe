import type {Icon} from '@phosphor-icons/react';

export interface Fact {
  icon: Icon;
  label: string;
  value: string;
}

/**
 * Ficha em duas colunas (rótulo com ícone à esquerda, valor à direita), o
 * mesmo `.course-summary` do Coworking, do /sobre e do "Resumo do curso".
 * Quem chama decide o invólucro (`.about-facts` sob o hero, ou um bloco de
 * `.course-intro`).
 */
export function FactsSummary({items}: {items: Fact[]}) {
  return (
    <dl className="course-summary">
      {items.map(({icon: FactIcon, label, value}) => (
        <div className="course-summary__row" key={label}>
          <dt className="course-summary__term">
            <FactIcon size={18} weight="light" className="course-summary__icon" aria-hidden="true" />
            {label}
          </dt>
          <dd className="course-summary__detail">
            <span>{value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
