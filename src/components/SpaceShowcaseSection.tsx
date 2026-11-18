import {useEffect, useRef, type ReactElement} from 'react';
import {UsersThree, ChartLineUp} from '@phosphor-icons/react';
import {Button} from '../ui';
import {WhatsCta} from './WhatsCta';
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
    alt: 'Sala de aula com mesas de desenho',
    label: 'Sala de aula',
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
    alt: 'Sala de aula ampla com luz natural',
    label: 'Sala de aula',
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
/**
 * Movimento da galeria ao rolar, em três camadas:
 * 1. cada foto entra uma vez quando chega à tela, subindo de baixo e
 *    encaixando no lugar como peça de mosaico (as que chegam juntas entram
 *    em sequência; a etiqueta e a legenda vêm logo depois);
 * 2. enquanto a galeria está à vista, as duas colunas andam em velocidades
 *    diferentes (parallax leve, só no desktop, onde ficam lado a lado);
 * 3. cada foto começa um pouco ampliada e assenta no tamanho real conforme
 *    atravessa a tela.
 *
 * Tudo começa visível no HTML do build: só depois de montar, e se a pessoa
 * não pediu "reduzir movimento", a galeria ganha `is-armed` e as fotos
 * passam a esperar a vez delas. Sem JavaScript, nada fica escondido.
 */
function useGalleryMotion() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = ref.current;
    if (!gallery || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = Array.from(gallery.querySelectorAll<HTMLElement>('.space-showcase__gallery-item'));
    const columns = Array.from(gallery.querySelectorAll<HTMLElement>('.space-showcase__gallery-col'));
    const cards = Array.from(gallery.querySelectorAll<HTMLElement>('.space-showcase__gallery-card'));
    gallery.classList.add('is-armed');

    // 1. Entrada: uma vez por foto.
    // As que chegam juntas entram em sequência, de cima para baixo e da
    // esquerda para a direita, como peças de um mosaico.
    const reveal = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            return ra.top - rb.top || ra.left - rb.left;
          });
        arriving.forEach((item, order) => {
          item.style.setProperty('--enter-delay', `${order * 140}ms`);
          item.classList.add('is-in');
          reveal.unobserve(item);
        });
      },
      {rootMargin: '0px 0px -12% 0px', threshold: 0.15},
    );
    items.forEach((item) => reveal.observe(item));

    // 2 e 3. Parallax e zoom: só calculados enquanto a galeria está na tela.
    const sideBySide = window.matchMedia('(min-width: 701px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const box = gallery.getBoundingClientRect();
      // -1 quando a galeria entra por baixo, 1 quando sai por cima.
      const progress = Math.max(-1, Math.min(1, (viewport / 2 - (box.top + box.height / 2)) / (box.height / 2 + viewport / 2)));
      columns.forEach((column, index) => {
        const speed = index === 0 ? -36 : 44;
        column.style.setProperty('--col-shift', sideBySide.matches ? `${(progress * speed).toFixed(1)}px` : '0px');
      });
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        // 0 com a foto entrando por baixo, 1 quando ela chega ao meio da tela.
        const t = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport / 2 + rect.height / 2)));
        card.style.setProperty('--zoom', (1.12 - 0.12 * t).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const watch = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, {passive: true});
        window.addEventListener('resize', onScroll);
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    });
    watch.observe(gallery);

    return () => {
      reveal.disconnect();
      watch.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      gallery.classList.remove('is-armed');
    };
  }, []);

  return ref;
}

export function SpaceShowcaseSection() {
  const [g1, g2, g3, g4, g5] = GALLERY;
  const galleryRef = useGalleryMotion();

  return (
    <section className="section space-showcase">
      <div className="container">
        <div className="space-showcase__top">
          <div className="space-showcase__content">
            <span className="section__eyebrow">Nosso espaço</span>
            <h2 className="space-showcase__title">Um lugar feito para criar</h2>
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
              <WhatsCta
                message="Olá! Gostaria de agendar uma visita para conhecer a Desenhe."
                label="Agendar uma visita"
                size="sm"
              />
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

        <div className="space-showcase__gallery" aria-label="Imagens do espaço" ref={galleryRef}>
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
