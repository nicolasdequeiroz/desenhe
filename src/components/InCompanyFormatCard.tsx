import type {CSSProperties, ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {Text} from '../ui';
import {asset, whatsappLink, type InCompanyFormat} from '../data';

/**
 * Card de formato In Company no mesmo desenho do card de curso (polaroid
 * torta, texto fora da moldura), sem a etiqueta sobre a foto: usa as classes
 * `.course-card` de propósito. Formatos com página própria levam para ela;
 * os outros abrem o WhatsApp com o pedido de proposta.
 */
/** Giro de cada objeto na cena do card, alternando os lados. */
const SCENE_TILT = [-8, 5, -4, 7];

export function InCompanyFormatCard({format, featured = false}: {format: InCompanyFormat; featured?: boolean}) {
  // Destaque: foto grande à esquerda e texto ao lado, ocupando a linha inteira.
  // Só ele leva a ficha: nos cards pequenos ficam foto, título e resumo.
  const className = featured ? 'course-card course-card--featured' : 'course-card';
  // Cards pequenos mostram até quatro objetos do formato em vez da foto.
  const scene = !featured && format.page?.relics ? format.page.relics.slice(0, 4) : null;
  const body: ReactNode = (
    <>
      <div className="course-card__frame">
        {scene ? (
          /* Cena com os objetos recortados do formato (os mesmos da primeira
             dobra da página), no lugar da foto. No hover eles se abrem em
             leque e sobem (ver .ic-card-scene). */
          <div className="ic-card-scene" role="img" aria-label={format.imageAlt}>
            {scene.map(({src, width, scale = 1, translucent}, i) => (
              <img
                key={src}
                src={asset(src)}
                alt=""
                width={width}
                height={900}
                className={`ic-card-scene__item${translucent ? ' ic-deck__relic--translucent' : ''}`}
                style={
                  {
                    '--scene-x': (i - (scene.length - 1) / 2) * (scene.length > 3 ? 19 : 25),
                    '--scene-r': SCENE_TILT[i % SCENE_TILT.length],
                    '--scene-i': i,
                    '--relic-scale': scale,
                  } as CSSProperties
                }
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="course-card__cover">
            <img src={asset(format.image)} alt={format.imageAlt} loading="lazy" />
          </div>
        )}
      </div>
      <div className="course-card__body">
        <span className="ic-type-tag text-style-label">{format.typeLabel}</span>
        <h3 className="course-card__title">{format.title}</h3>
        <Text type="body" color="secondary">
          {format.summary}
        </Text>
        {featured && (
          <ul className="course-card__strands" aria-label="Ficha do formato">
            {format.facts.map((fact) => (
              <li key={fact.label} className="course-card__strand">
                {fact.value}
              </li>
            ))}
          </ul>
        )}
        <span className="course-card__cta">
          {format.page ? 'Conhecer o formato' : 'Peça uma proposta'}{' '}
          <span className="course-card__cta-arrow">→</span>
        </span>
      </div>
    </>
  );

  if (format.page) {
    return (
      <Link to={`/in-company/${format.slug}`} id={format.slug} className={className}>
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
      className={className}
    >
      {body}
    </a>
  );
}
