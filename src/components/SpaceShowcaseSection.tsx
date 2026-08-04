import type {ReactElement} from 'react';
import {UsersThree, ChartLineUp} from '@phosphor-icons/react';
import {Button} from '../ui';
import {asset} from '../data';

interface GalleryItem {
  src: string;
  alt: string;
  label: string;
  number: string;
  /** Legenda breve, opcional: só as fotos "grandes" costumam ter. */
  caption?: string;
}

/** Cinco imagens do espaço, em ordem fixa para a diagramação abaixo. */
const GALLERY: GalleryItem[] = [
  {
    src: '/images/espaco/atelie-galeria.webp',
    alt: 'Galeria de exposições da escola',
    label: 'Galeria',
    number: '01',
  },
  {
    src: '/images/espaco/sala-01-mesas.webp',
    alt: 'Ateliê 01 com mesas de desenho',
    label: 'Ateliê',
    number: '02',
  },
  {
    src: '/images/espaco/biblioteca.webp',
    alt: 'Biblioteca de arte da escola',
    label: 'Biblioteca',
    number: '03',
    caption:
      'Uma biblioteca de arte para consultar referências, folhear catálogos e se inspirar entre uma aula e outra.',
  },
  {
    src: '/images/espaco/sala-02.webp',
    alt: 'Ateliê 02',
    label: 'Ateliê',
    number: '04',
    caption:
      'Salas amplas e luz natural, pensadas para turmas pequenas trabalharem lado a lado sem perder a atenção individual.',
  },
  {
    src: '/images/espaco/cozinha.webp',
    alt: 'Cozinha e café da escola',
    label: 'Cozinha',
    number: '05',
  },
];

interface Highlight {
  icon: () => ReactElement;
  title: string;
  body: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    icon: () => <UsersThree size={22} aria-hidden="true" />,
    title: 'Para todas as idades',
    body: 'Crianças, adolescentes e adultos aprendem lado a lado, cada um no seu próprio ritmo.',
  },
  {
    icon: () => <ChartLineUp size={22} aria-hidden="true" />,
    title: 'Para todos os níveis',
    body: 'Do amador ao profissional, o curso acompanha desde o primeiro traço até o aperfeiçoamento técnico.',
  },
];

function GalleryFigure({
  item,
  className,
}: {
  item: GalleryItem;
  className?: string;
}) {
  return (
    <figure className={['space-showcase__gallery-item', className].filter(Boolean).join(' ')}>
      <div className="space-showcase__gallery-card">
        <div className="space-showcase__gallery-badge">
          <span>{item.label}</span>
          <span>{item.number}</span>
        </div>
        <img src={asset(item.src)} alt={item.alt} loading="lazy" />
      </div>
      {item.caption && (
        <figcaption className="space-showcase__gallery-caption">{item.caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * Seção do espaço. No topo, texto ao lado de dois cards de destaque
 * (idades / níveis). Abaixo, uma galeria editorial: duas colunas, cada
 * uma uma pilha vertical independente de fotos de tamanhos e larguras
 * variados, com grandes vãos entre elas e leve desalinhamento horizontal
 * (jitter) entre os itens; sem grade rígida, sem auto-scroll. As fotos
 * maiores levam uma legenda breve. O espaço vazio generoso é
 * intencional: o scroll da seção é longo.
 */
export function SpaceShowcaseSection() {
  const [g1, g2, g3, g4, g5] = GALLERY;

  return (
    <section className="section space-showcase">
      <div className="container">
        <div className="space-showcase__top">
          <div className="space-showcase__content">
            <span className="section__eyebrow">Nosso espaço</span>
            <h2 className="space-showcase__title">Um ateliê feito para criar</h2>
            <div className="space-showcase__body">
              <p className="space-showcase__lead">
                Por mais de 30 anos temos ajudado profissionais do mercado e
                artistas a levar sua arte para o próximo nível. Acreditamos que
                o ensino das técnicas do desenho artístico, aliados com o
                desenvolvimento criativo, são os alicerces da arte de alto
                nível.
              </p>
              <p className="space-showcase__lead">
                O que mais queremos é estudantes que sejam apaixonados pela
                arte e queiram aprender, intensamente curiosos e com a mente
                aberta, compartilhando experiências e ideias com todos que
                estão à sua volta.
              </p>
            </div>
            <div className="space-showcase__actions">
              <Button
                label="Conheça a escola"
                href="/sobre"
                variant="secondary"
                size="sm"
              />
            </div>
          </div>

          <div className="space-showcase__highlights">
            <div className="space-showcase__highlight-grid">
              {HIGHLIGHTS.map(({icon: Icon, title, body}) => (
                <div className="space-showcase__highlight" key={title}>
                  <div className="space-showcase__highlight-head">
                    <span className="space-showcase__highlight-icon">
                      <Icon />
                    </span>
                    <span className="space-showcase__highlight-title">{title}</span>
                  </div>
                  <p className="space-showcase__highlight-body">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-showcase__gallery" aria-label="Imagens do ateliê">
          <div className="space-showcase__gallery-col">
            <GalleryFigure
              item={g1}
              className="space-showcase__gallery-item--sm space-showcase__gallery-item--start"
            />
            <GalleryFigure
              item={g2}
              className="space-showcase__gallery-item--sm space-showcase__gallery-item--end"
            />
            <GalleryFigure
              item={g3}
              className="space-showcase__gallery-item--lg space-showcase__gallery-item--center"
            />
          </div>

          <div className="space-showcase__gallery-col">
            <GalleryFigure
              item={g4}
              className="space-showcase__gallery-item--xl space-showcase__gallery-item--start"
            />
            <GalleryFigure
              item={g5}
              className="space-showcase__gallery-item--sm space-showcase__gallery-item--center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
