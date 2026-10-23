import type {Fact} from './FactsSummary';

/**
 * Ficha das páginas In Company em régua: os dados curtos (`stats`) lado a
 * lado, separados por fios, com o valor em destaque; os textos longos
 * (`notes`), se houver, numa segunda linha com os mesmos fios. Estilo em
 * `.ic-facts` (site.css).
 */
export function InCompanyFacts({stats, notes = []}: {stats: Fact[]; notes?: Fact[]}) {
  return (
    <div className="ic-facts">
      <dl className="ic-facts__stats">
        {stats.map(({icon: FactIcon, label, value}) => (
          <div className="ic-facts__item" key={label}>
            <dt className="ic-facts__term text-style-label">
              <FactIcon size={18} weight="light" className="ic-facts__icon" aria-hidden="true" />
              {label}
            </dt>
            <dd className="ic-facts__value text-size-large">{value}</dd>
          </div>
        ))}
      </dl>
      {notes.length > 0 && (
        <dl className="ic-facts__notes">
          {notes.map(({icon: FactIcon, label, value}) => (
            <div className="ic-facts__item" key={label}>
              <dt className="ic-facts__term text-style-label">
                <FactIcon size={18} weight="light" className="ic-facts__icon" aria-hidden="true" />
                {label}
              </dt>
              <dd className="ic-facts__text text-size-regular text-color-secondary">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
