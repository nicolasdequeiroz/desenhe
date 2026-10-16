import type {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {Text} from '../ui';
import {asset, whatsappLink, type InCompanyFormat, type InCompanyNeed} from '../data';

/**
 * Cor da etiqueta por necessidade. Reaproveita as cores de categoria dos
 * cursos só para variar a grade; aqui elas não têm o significado de lá.
 */
const NEED_TONE: Record<InCompanyNeed, string> = {
  inovacao: 'institucional',
  'bem-estar': 'pintura',
  eventos: 'infantil',
  outros: 'teorico',
};

/**
 * Card de formato In Company no mesmo desenho do card de curso (polaroid
 * torta, etiqueta sobre a foto, texto fora da moldura): usa as classes
 * `.course-card` de propósito. Formatos com página própria levam para ela;
 * os outros abrem o WhatsApp com o pedido de proposta.
 */
export function InCompanyFormatCard({format}: {format: InCompanyFormat}) {
  const body: ReactNode = (
    <>
      <div className="course-card__frame">
        <div className="course-card__cover">
          <img src={asset(format.image)} alt={format.imageAlt} loading="lazy" />
          <span className={`category-tag category-tag--${NEED_TONE[format.need]}`}>
            {format.needLabel}
          </span>
        </div>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{format.title}</h3>
        <Text type="body" color="secondary">
          {format.summary}
        </Text>
        <ul className="course-card__strands" aria-label="Ficha do formato">
          {format.facts.map((fact) => (
            <li key={fact.label} className="course-card__strand">
              {fact.value}
            </li>
          ))}
        </ul>
        <span className="course-card__cta">
          {format.page ? 'Conhecer o formato' : 'Peça uma proposta'}{' '}
          <span className="course-card__cta-arrow">→</span>
        </span>
      </div>
    </>
  );

  if (format.page) {
    return (
      <Link to={`/in-company/${format.slug}`} id={format.slug} className="course-card">
        {body}
      </Link>
    );
  }

  return (
    <a
      href={whatsappLink(`Olá! Quero uma proposta de In Company para "${format.title}".`)}
      target="_blank"
      rel="noopener noreferrer"
      id={format.slug}
      className="course-card"
    >
      {body}
    </a>
  );
}
