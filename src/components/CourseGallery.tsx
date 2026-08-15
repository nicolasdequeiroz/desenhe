import {useCallback, useEffect, useRef} from 'react';
import {MagnifyingGlassPlus} from '@phosphor-icons/react';
import {asset, UNCREDITED_AUTHOR, type GalleryCredit} from '../data';
import {useWorkLightbox} from './WorkLightbox';

/** 3 -> "03": numeração de catálogo, no formato já usado nos cursos em destaque. */
function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Fração da altura da tela, a partir do centro, em que um trabalho ainda conta
 * como "em foco" na rolagem do mobile. Calibrado para dar um de cada vez.
 */
const FOCUS_REACH = 0.35;

interface Props {
  images: string[];
  /** Legenda coletiva da galeria, usada nos textos alternativos e no visor. */
  caption: string;
  /** Autor e ano de cada imagem, no mesmo índice de `images` (ver courses.ts). */
  credits?: GalleryCredit[];
}

/**
 * Galeria da página de curso: os trabalhos ficam pendurados como numa parede
 * de ateliê, cada um em formato polaroid (com a legenda de autor e ano na
 * margem inferior), na sua altura e levemente torto, subindo em ritmos
 * diferentes conforme a página rola (ver --wall-progress). Clicar em um deles
 * abre o visor em tela cheia, que é onde dá para reparar no traço.
 */
export function CourseGallery({images, caption, credits}: Props) {
  const wallRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frameRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const getOrigin = useCallback((index: number) => frameRefs.current[index], []);
  const onClosed = useCallback((index: number) => {
    itemRefs.current[index]?.focus();
  }, []);

  const {openWork, lightbox} = useWorkLightbox({
    images,
    caption,
    credits,
    getOrigin,
    onClosed,
  });

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /*
     * Sem cursor não existe hover, e a parede ficaria parada justamente onde o
     * visitante mais rola. Nessas telas o destaque passa a ser dado pela
     * rolagem: o trabalho que chega ao centro se endireita e sai da parede,
     * como faria sob o cursor no desktop.
     */
    const byScroll = window.matchMedia('(hover: none), (max-width: 900px)');
    let perItemApplied = false;

    let frame = 0;
    const update = () => {
      const rect = wall.getBoundingClientRect();
      const viewport = window.innerHeight;
      /*
       * -1 com a parede entrando por baixo, 0 quando ela está no centro da
       * viewport, 1 saindo por cima. É esse número que a CSS multiplica pela
       * "profundidade" de cada trabalho para dar o deslocamento de cada um.
       */
      const center = rect.top + rect.height / 2;
      const progress = (viewport / 2 - center) / ((viewport + rect.height) / 2);
      wall.style.setProperty('--wall-progress', clamp(progress, -1, 1).toFixed(3));

      if (byScroll.matches) {
        for (const item of itemRefs.current) {
          if (!item) continue;
          const box = item.getBoundingClientRect();
          const distance = box.top + box.height / 2 - viewport / 2;
          // Posição relativa ao centro (-1 a 1), que desliza a imagem por
          // dentro da moldura, e o quanto a peça está em foco (0 a 1).
          const shift = clamp(distance / ((viewport + box.height) / 2), -1, 1);
          const focus = clamp(1 - Math.abs(distance) / (viewport * FOCUS_REACH), 0, 1);
          item.style.setProperty('--work-shift', shift.toFixed(3));
          item.style.setProperty('--work-focus', focus.toFixed(3));
        }
        perItemApplied = true;
      } else if (perItemApplied) {
        // Voltou para uma tela com cursor: quem manda de novo é o hover.
        for (const item of itemRefs.current) {
          item?.style.removeProperty('--work-shift');
          item?.style.removeProperty('--work-focus');
        }
        perItemApplied = false;
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
  }, []);

  return (
    <>
      <div
        className={`work-wall${images.length <= 2 ? ` work-wall--${images.length}` : ''}`}
        ref={wallRef}
      >
        {images.map((img, i) => {
          const credit = credits?.[i];
          return (
            <button
              key={img}
              type="button"
              className="work-wall__item"
              ref={(node) => {
                itemRefs.current[i] = node;
              }}
              onClick={() => openWork(i, frameRefs.current[i])}
              aria-label={`Ampliar trabalho ${i + 1} de ${images.length}`}
            >
              {/*
                Foto e legenda vivem dentro do mesmo .work-wall__frame, que é
                quem gira: se fossem irmãs cada uma giraria em torno do próprio
                centro e a "moldura" se romperia no meio, em vez de girar como
                uma peça só.
              */}
              <span
                className="work-wall__frame"
                ref={(node) => {
                  frameRefs.current[i] = node;
                }}
              >
                <span className="work-wall__photo">
                  <img
                    src={asset(img)}
                    alt={`${caption}, imagem ${i + 1}`}
                    loading="lazy"
                  />
                  <span className="work-wall__zoom">
                    <MagnifyingGlassPlus size={14} weight="bold" aria-hidden="true" />
                    Ver de perto
                  </span>
                </span>
                <span className="work-wall__caption">
                  <span className="work-wall__author">
                    {credit?.author ?? UNCREDITED_AUTHOR}
                  </span>
                  {credit?.year && (
                    <span className="work-wall__year">{credit.year}</span>
                  )}
                </span>
              </span>
              <span className="work-wall__label" aria-hidden="true">
                / {pad(i + 1)} /
              </span>
            </button>
          );
        })}
      </div>

      {lightbox}
    </>
  );
}
