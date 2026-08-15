import {useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeft, ArrowRight, X} from '@phosphor-icons/react';
import {asset, UNCREDITED_AUTHOR, type GalleryCredit} from '../data';
import {useScrollLock} from './useScrollLock';

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

/** Duração e curva do voo da peça entre a página e o visor. */
const FLIGHT_MS = 460;
const FLIGHT_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Saída sem voo, quando a imagem não tem peça correspondente na página. */
const FADE_OUT_MS = 240;

/**
 * Fração do voo usada para trocar a peça da página pela cópia em voo, e
 * vice-versa. A carta na página é cortada pela borda da faixa e a cópia não,
 * então sem esse crossfade o pedaço escondido apareceria (ou sumiria) de
 * golpe, num piscar, bem no começo e no fim do percurso.
 */
const CROSSFADE = 0.16;

/** Troca suave entre a peça na página e a cópia em voo, nas pontas do percurso. */
function crossFade(
  ghost: HTMLElement,
  origin: HTMLElement,
  direction: 'in' | 'out',
): Animation[] {
  const entering = direction === 'in';
  const timing: KeyframeAnimationOptions = {
    duration: FLIGHT_MS * CROSSFADE,
    delay: entering ? 0 : FLIGHT_MS * (1 - CROSSFADE),
    easing: 'linear',
    fill: 'both',
  };
  return [
    ghost.animate([{opacity: entering ? 0 : 1}, {opacity: entering ? 1 : 0}], timing),
    origin.animate([{opacity: entering ? 1 : 0}, {opacity: entering ? 0 : 1}], timing),
  ];
}

/** Distância mínima, em px, para um arrasto horizontal virar troca de imagem. */
const SWIPE_THRESHOLD = 48;

/** 3 -> "03": numeração de catálogo, no formato já usado nos cursos em destaque. */
function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Ângulo já aplicado ao elemento, para a peça sair (e voltar) no mesmo tombo. */
function readRotation(element: HTMLElement): number {
  const {transform} = getComputedStyle(element);
  const match = transform?.match(/matrix\(([^)]+)\)/);
  if (!match) return 0;
  const [a, b] = match[1].split(',').map(Number);
  return (Math.atan2(b, a) * 180) / Math.PI;
}

/**
 * Cópia do polaroid em voo, posicionada em coordenadas de viewport. É ela que
 * atravessa a tela: o bloco inteiro (foto e legenda de autoria) viaja junto,
 * porque é o polaroid inteiro que sai da parede e vira o conteúdo do visor.
 *
 * A tarja da legenda tem altura fixa, igual na parede e no visor, então só a
 * área da foto absorve a diferença de tamanho: como ela recorta com
 * `object-fit: cover`, crescer vai revelando mais do trabalho em vez de
 * deformá-lo, e o texto nunca é escalado (ficaria borrado).
 */
function createGhost(src: string, author: string, year?: string): HTMLElement {
  const ghost = document.createElement('div');
  ghost.className = 'work-ghost';

  const photo = document.createElement('div');
  photo.className = 'work-ghost__photo';
  const image = document.createElement('img');
  image.src = src;
  image.alt = '';
  photo.append(image);

  // Mesma estrutura da legenda na parede e no visor, para as pontas do
  // crossfade coincidirem em vez de trocar de layout no meio do caminho.
  const caption = document.createElement('div');
  caption.className = 'work-ghost__caption';
  const authorLine = document.createElement('span');
  authorLine.className = 'work-ghost__author';
  authorLine.textContent = author;
  caption.append(authorLine);
  if (year) {
    const yearLine = document.createElement('span');
    yearLine.className = 'work-ghost__year';
    yearLine.textContent = year;
    caption.append(yearLine);
  }

  ghost.append(photo, caption);
  document.body.append(ghost);
  return ghost;
}

function flightFrames(
  from: DOMRect,
  fromRotation: number,
  to: DOMRect,
  toRotation: number,
): Keyframe[] {
  return [
    {
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      rotate: `${fromRotation}deg`,
    },
    {
      left: `${to.left}px`,
      top: `${to.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      rotate: `${toRotation}deg`,
    },
  ];
}

export interface ViewerProps {
  images: string[];
  caption: string;
  /** Autor e ano de cada imagem, no mesmo índice de `images` (ver courses.ts). */
  credits?: GalleryCredit[];
  index: number;
  resolveOrigin: (index: number) => HTMLElement | null;
  onClose: (index: number) => void;
  onNavigate: (step: number) => void;
}

/**
 * Visor em tela cheia. Vai para o `body` por portal, e não fica onde o
 * componente está: a .site-shell abre um contexto de empilhamento (z-index: 1)
 * que deixaria o visor por baixo do header, que é irmão dela.
 */
export function WorkViewer({
  images,
  caption,
  credits,
  index,
  resolveOrigin,
  onClose,
  onNavigate,
}: ViewerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  /* O voo mira o polaroid inteiro, não só a foto: é o bloco todo que viaja. */
  const polaroidRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const indexRef = useRef(index);
  const closingRef = useRef(false);
  const swipeRef = useRef<{x: number; y: number} | null>(null);
  indexRef.current = index;

  const credit = credits?.[index];
  const author = credit?.author ?? UNCREDITED_AUTHOR;
  const year = credit?.year;

  useScrollLock();

  useEffect(() => {
    // Congela a marquee do baralho: sem isso a peça voltaria para uma carta
    // que andou de lugar enquanto o visor esteve aberto.
    document.body.classList.add('has-work-viewer');
    return () => document.body.classList.remove('has-work-viewer');
  }, []);

  // Enquanto o visor está aberto, quem representa a peça é a imagem no visor:
  // a original some da página para não aparecer duplicada durante o voo. É
  // opacidade, e não `visibility`, para o voo poder fazer o crossfade nas
  // pontas (ver crossFade).
  useEffect(() => {
    const origin = resolveOrigin(index);
    if (!origin) return;
    origin.style.opacity = '0';
    return () => {
      origin.style.opacity = '';
    };
  }, [resolveOrigin, index]);

  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
  }, []);

  // Voo de abertura: o polaroid clicado cresce da posição dele até o visor.
  useLayoutEffect(() => {
    const polaroid = polaroidRef.current;
    const image = imageRef.current;
    const origin = resolveOrigin(indexRef.current);
    if (!polaroid || !image || !origin || prefersReducedMotion()) return;

    let cancelled = false;
    let ghost: HTMLElement | undefined;
    let fades: Animation[] = [];

    const start = () => {
      if (cancelled) return;
      const to = polaroid.getBoundingClientRect();
      const from = origin.getBoundingClientRect();
      if (!to.width || !from.width) return;

      polaroid.style.opacity = '0';
      ghost = createGhost(image.currentSrc || image.src, author, year);
      fades = crossFade(ghost, origin, 'in');
      ghost
        .animate(flightFrames(from, readRotation(origin), to, 0), {
          duration: FLIGHT_MS,
          easing: FLIGHT_EASING,
          fill: 'both',
        })
        .finished.then(() => {
          if (cancelled) return;
          polaroid.style.opacity = '';
          ghost?.remove();
          ghost = undefined;
        })
        .catch(() => {});
    };

    // O polaroid só tem altura final depois que a foto decodifica, e o voo
    // precisa do retângulo de destino para saber onde aterrissar.
    if (image.complete && image.naturalWidth) {
      start();
    } else {
      image.addEventListener('load', start, {once: true});
    }

    return () => {
      cancelled = true;
      image.removeEventListener('load', start);
      // Cancelar devolve a peça ao estado que o efeito de cima definiu.
      fades.forEach((fade) => fade.cancel());
      ghost?.remove();
      polaroid.style.opacity = '';
    };
  }, [resolveOrigin, author, year]);

  // Fechar é o voo inverso: a imagem volta a ser a peça, no lugar dela.
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    const current = indexRef.current;
    const polaroid = polaroidRef.current;
    const image = imageRef.current;
    const origin = resolveOrigin(current);

    if (prefersReducedMotion()) {
      onClose(current);
      return;
    }

    const from = polaroid?.getBoundingClientRect();
    const to = origin?.getBoundingClientRect();

    /*
     * Nem toda imagem tem peça na página para onde voltar: o baralho da
     * primeira dobra mostra só as quatro primeiras, mas daqui dá para navegar
     * pela série inteira. Sem destino, o visor apenas se apaga.
     */
    if (!polaroid || !image || !origin || !from?.width || !to?.width) {
      closingRef.current = true;
      panelRef.current?.classList.add('is-closing');
      window.setTimeout(() => onClose(current), FADE_OUT_MS);
      return;
    }

    closingRef.current = true;
    panelRef.current?.classList.add('is-closing');
    polaroid.style.opacity = '0';

    const ghost = createGhost(image.currentSrc || image.src, author, year);
    // A peça na página reaparece no fim do percurso, por baixo da cópia que
    // some: é a troca inversa da abertura.
    const fades = crossFade(ghost, origin, 'out');
    ghost
      .animate(flightFrames(from, 0, to, readRotation(origin)), {
        duration: FLIGHT_MS,
        easing: FLIGHT_EASING,
        fill: 'both',
      })
      .finished.catch(() => {})
      .finally(() => {
        fades.forEach((fade) => fade.cancel());
        origin.style.opacity = '';
        ghost.remove();
        onClose(current);
      });
  }, [resolveOrigin, onClose, author, year]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const panel = panelRef.current;
      if (event.key === 'Escape') {
        requestClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        onNavigate(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        onNavigate(1);
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [requestClose, onNavigate]);

  return createPortal(
    <div
      className="work-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${caption}, imagem ${index + 1} de ${images.length}`}
      ref={panelRef}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        swipeRef.current = {x: touch.clientX, y: touch.clientY};
      }}
      onTouchEnd={(event) => {
        const start = swipeRef.current;
        swipeRef.current = null;
        if (!start || images.length < 2) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        // Só conta como arrasto lateral: rolagem vertical não troca a imagem.
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
        onNavigate(dx < 0 ? 1 : -1);
      }}
    >
      <div
        className="work-viewer__backdrop"
        onClick={requestClose}
        aria-hidden="true"
      />

      <button
        type="button"
        className="work-viewer__close"
        onClick={requestClose}
        aria-label="Fechar"
      >
        <X size={18} weight="bold" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="work-viewer__nav work-viewer__nav--prev"
            onClick={() => onNavigate(-1)}
            aria-label="Trabalho anterior"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            className="work-viewer__nav work-viewer__nav--next"
            onClick={() => onNavigate(1)}
            aria-label="Próximo trabalho"
          >
            <ArrowRight size={18} weight="bold" />
          </button>
        </>
      )}

      <figure className="work-viewer__figure">
        {/*
          O polaroid inteiro é o conteúdo do visor: a mesma peça que estava
          pendurada na parede, agora grande e no centro. A `key` remonta a
          imagem a cada troca, e é o que faz a animação de entrada rodar de
          novo em vez de a nova imagem simplesmente aparecer.
        */}
        <div className="work-viewer__polaroid" ref={polaroidRef}>
          <div className="work-viewer__photo">
            <img
              key={images[index]}
              ref={imageRef}
              src={asset(images[index])}
              alt={`${caption}, imagem ${index + 1}`}
            />
          </div>
          <div className="work-viewer__credit">
            <span className="work-viewer__author">{author}</span>
            {credit?.year && (
              <span className="work-viewer__year">{credit.year}</span>
            )}
          </div>
        </div>
        <figcaption className="work-viewer__caption">
          <span className="work-viewer__count">
            {pad(index + 1)} / {pad(images.length)}
          </span>
          <span className="work-viewer__course">{caption}</span>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
