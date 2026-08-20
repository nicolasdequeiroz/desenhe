import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type {Icon} from '@phosphor-icons/react';
import {Heading, Text} from '../ui';
import type {CourseCategory} from '../data';

/**
 * Progresso (0 a 1) de rolagem por dentro de um elemento: 0 quando o topo
 * dele encosta na base da viewport, 1 quando a base dele encosta no topo.
 * Usado para o rastro colorido que cresce dentro da linha do tempo.
 */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const value = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return [ref, progress] as const;
}

/**
 * "Sticky" manual: o header da linha do tempo precisa grudar no topo
 * enquanto a lista ao lado rola. `position: sticky` não funciona aqui porque
 * o `.site-shell` (ver RootLayout.tsx) usa `overflow: hidden` para recortar
 * os cantos arredondados e para o efeito de gaveta do rodapé, o que impede
 * qualquer sticky nativo dentro dele. O wrapper (`boundsRef`) fica no fluxo
 * normal, esticado pela grid até a altura da lista; o conteúdo (`innerRef`)
 * alterna entre estático (antes de alcançar o topo), fixo (colado no topo
 * enquanto o wrapper ainda "sobra" espaço abaixo) e absoluto no fim do
 * wrapper (parado quando a lista termina), replicando sticky com um fallback
 * para o fim do contêiner.
 */
function useStickyColumn<B extends HTMLElement, I extends HTMLElement>(
  topOffset: number,
) {
  const boundsRef = useRef<B>(null);
  const innerRef = useRef<I>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const bounds = boundsRef.current;
    const inner = innerRef.current;
    if (!bounds || !inner) return;

    let frame = 0;
    const update = () => {
      // Abaixo de 760px a grid empilha em 1 coluna (ver media query no CSS):
      // o header some do "bounds" wrapper e volta ao fluxo normal.
      if (window.innerWidth <= 760) {
        setStyle({});
        return;
      }

      const boundsRect = bounds.getBoundingClientRect();
      const innerHeight = inner.offsetHeight;

      if (boundsRect.top > topOffset) {
        setStyle({});
      } else if (boundsRect.bottom < topOffset + innerHeight) {
        setStyle({position: 'absolute', bottom: 0, left: 0, width: '100%'});
      } else {
        setStyle({
          position: 'fixed',
          top: topOffset,
          left: boundsRect.left,
          width: boundsRect.width,
        });
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [topOffset]);

  return {boundsRef, innerRef, style};
}

export interface TimelineItem {
  /** Rótulo de ordem, ex.: "Módulo 1" ou "Etapa 1". */
  label: string;
  heading: string;
  description: string;
}

interface Props {
  kicker: string;
  title: string;
  lead: string;
  items: TimelineItem[];
  /** Ícones em rodízio pelo índice: não há ícone próprio por item. */
  icons: Icon[];
  /** Define a cor do rastro e dos ícones (ver tokens de categoria). */
  tone?: CourseCategory;
  /** Conteúdo extra abaixo do texto do cabeçalho, ex.: um botão. */
  headerExtra?: ReactNode;
  id?: string;
}

/**
 * Linha do tempo: cabeçalho que gruda no topo à esquerda, uma trilha central
 * cujo rastro colorido cresce conforme a lista rola, e os itens à direita.
 * Usada nos módulos da página de curso e no percurso do aluno em /sobre.
 */
export function Timeline({
  kicker,
  title,
  lead,
  items,
  icons,
  tone = 'desenho',
  headerExtra,
  id,
}: Props) {
  const [listRef, progress] = useScrollProgress<HTMLOListElement>();
  const stickyHeader = useStickyColumn<HTMLDivElement, HTMLDivElement>(96);

  return (
    <section
      id={id}
      className={`section section--muted course-timeline course-timeline--${tone}`}
    >
      <div className="container course-timeline__layout">
        {/*
          "Sticky" manual (ver useStickyColumn): o wrapper abaixo fica no
          fluxo normal da grid, esticado até a altura da lista; o header
          dentro dele é quem recebe a posição calculada.
        */}
        <div className="course-timeline__header-bounds" ref={stickyHeader.boundsRef}>
          <div
            className="course-timeline__header"
            ref={stickyHeader.innerRef}
            style={stickyHeader.style}
          >
            <span className="section__eyebrow">{kicker}</span>
            <Heading level={2}>{title}</Heading>
            <Text as="p" color="secondary">
              {lead}
            </Text>
            {headerExtra}
          </div>
        </div>

        {/*
          Trilha central: fica numa coluna própria, exatamente entre as
          outras duas (que têm a mesma largura, 1fr cada), então cai no
          centro horizontal do .container, o mesmo eixo em que a logo
          DESENHE do header se centraliza.
        */}
        <div className="course-timeline__track" aria-hidden="true">
          <div
            className="course-timeline__track-fill"
            style={{height: `${progress * 100}%`}}
          />
        </div>

        <ol className="course-timeline__list" ref={listRef}>
          {items.map((item, i) => {
            const ItemIcon = icons[i % icons.length];
            return (
              <li key={item.label} className="course-timeline__item">
                <div className="course-timeline__meta">
                  <ItemIcon
                    size={20}
                    weight="light"
                    className="course-timeline__icon"
                  />
                  <span className="course-timeline__label">{item.label}</span>
                </div>
                <Heading level={3} className="course-timeline__heading">
                  {item.heading}
                </Heading>
                <Text color="secondary">{item.description}</Text>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
