import {useCallback, useEffect, useRef, useState} from 'react';
import {asset} from '../data';
import {useWorkLightbox} from './WorkLightbox';

/**
 * Os três eixos da distorção no ponto mais afastado do centro. A queda é uma
 * fração da largura do palco, e não um valor em px, para a curva ter o mesmo
 * desenho no celular e no desktop; ângulo e escala já são independentes de
 * tamanho.
 */
const ARC = {
  dropRatio: 0.055,
  rotate: 9,
  shrink: 0.16,
};

/** Velocidade do desfile, no mesmo ritmo do trilho de depoimentos. */
const SPEED_PX_PER_SEC = 40;

/**
 * Deslocamento, em px, a partir do qual o gesto vira arraste e deixa de valer
 * como clique: sem isso, um tremido no dedo abriria o visor sem querer.
 */
const DRAG_THRESHOLD = 6;

interface Props {
  /** Caminhos das imagens, na ordem em que entram na trilha. */
  images: string[];
  /** Texto alternativo comum, numerado por item. */
  caption: string;
}

/**
 * Rio de trabalhos: uma trilha infinita de desenhos curvada em arco, com as
 * peças descendo, girando e encolhendo conforme se afastam do centro. Dá para
 * arrastar para navegar, e clicar em qualquer peça abre o visor da galeria.
 *
 * A referência (a seção "Let's connect" da Patta) desenha esse arco num
 * canvas WebGL sobre o carrossel. Aqui o mesmo desenho é feito no DOM: um
 * único requestAnimationFrame anda com a trilha e, logo em seguida, recoloca
 * cada peça no arco em função de onde ela ficou na tela.
 *
 * O palco é mais largo que a viewport de propósito: as pontas do arco, onde a
 * curvatura é mais forte, ficam fora do recorte, e por isso as peças já
 * entram e saem tortas pelas bordas.
 */
export function WorksArc({images, caption}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const positionRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPositionRef = useRef(0);
  /** Se o ponteiro já foi capturado neste gesto (ver `capturePointer`). */
  const capturedRef = useRef(false);
  /*
   * No toque, capturar o ponteiro logo no `pointerdown` faz o navegador
   * disparar `pointercancel` enquanto ainda decide se o gesto é rolagem
   * vertical: o arraste morre antes de comecar. Entao o toque fica
   * "pendente" e so vira arraste (a flag) quando o movimento se confirma
   * mais horizontal que vertical. Mouse trava na hora, mas em nenhum dos
   * dois a captura acontece antes do arraste comecar de fato.
   */
  const pendingRef = useRef<{
    x: number;
    y: number;
    pointerId: number;
    position: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /*
   * Cada trabalho existe duas vezes na trilha (ver `run` abaixo). Ao navegar
   * de uma peça para outra dentro do visor, o voo tem que sair da cópia que
   * está de fato à vista: escolhe a mais próxima do centro da tela.
   */
  const getOrigin = useCallback(
    (index: number) => {
      const middle = window.innerWidth / 2;
      let best: HTMLButtonElement | null = null;
      let bestDistance = Infinity;
      for (let i = index; i < cardRefs.current.length; i += images.length) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const box = card.getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = card;
        }
      }
      return best;
    },
    [images.length],
  );

  const onClosed = useCallback(
    (index: number) => {
      getOrigin(index)?.focus();
    },
    [getOrigin],
  );

  const {openWork, lightbox} = useWorkLightbox({
    images,
    caption,
    // Aqui a peça não é um polaroid com autoria na página, é só o desenho:
    // aberta, ela também aparece sem a moldura de papel.
    framed: false,
    getOrigin,
    onClosed,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let frame = 0;
    let lastTime: number | null = null;

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      /*
       * A trilha só para durante o arraste (quem manda é o dedo), enquanto
       * o visor está aberto (a peça precisa continuar onde estava para o voo
       * de volta aterrissar nela) e no modo "menos movimento". Passar o
       * mouse por cima não pausa: é o mesmo comportamento do trilho de
       * depoimentos, e no celular um toque de rolagem não pode congelar o
       * desfile sem querer.
       */
      const held =
        draggingRef.current ||
        reduceMotion ||
        document.body.classList.contains('has-work-viewer');

      if (!held) positionRef.current -= SPEED_PX_PER_SEC * dt;

      /*
       * A volta do loop é um conjunto inteiro de peças, com o gap da emenda:
       * scrollWidth traz 20 peças e só 19 gaps, daí o `+ gap` antes de
       * dividir. Sem esse meio gap a trilha saltaria a cada volta.
       */
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const loop = (track.scrollWidth + gap) / 2;
      if (loop > 0) {
        positionRef.current = (((positionRef.current % loop) + loop) % loop) - loop;
      }

      track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;

      // Só agora, com a trilha já no lugar deste quadro, é que a posição de
      // cada peça no arco pode ser medida.
      const rect = stage.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const reach = rect.width / 2;
      const drop = rect.width * ARC.dropRatio;

      for (const item of itemRefs.current) {
        if (!item) continue;
        /*
         * O item é medido pelo elemento de fora, que só carrega o
         * deslocamento da trilha. A distorção vai no filho: se fosse
         * aplicada aqui, a medida do quadro seguinte já viria contaminada
         * pela do anterior e a curva se realimentaria.
         */
        const box = item.getBoundingClientRect();
        const t = Math.max(-1.4, Math.min(1.4, (box.left + box.width / 2 - center) / reach));
        const inner = item.firstElementChild as HTMLElement | null;
        if (!inner) continue;
        inner.style.transform =
          `translateY(${(drop * t * t).toFixed(2)}px) ` +
          `rotate(${(ARC.rotate * t).toFixed(2)}deg) ` +
          `scale(${(1 - ARC.shrink * t * t).toFixed(4)})`;
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  /*
   * O toque usa Touch Events nativos, não Pointer Events: no Safari do
   * iPhone, `setPointerCapture` num ponteiro de toque é instável (o gesto
   * simplesmente não reagia, sem rolar a página nem arrastar a trilha), então
   * a versão anterior — Pointer Events também para o toque, capturando o
   * ponteiro quando o arraste era confirmado — não funcionava de forma
   * confiável nesse navegador.
   *
   * Touch Events não têm esse problema: o evento já continua mirando o
   * elemento onde o dedo tocou primeiro, não importa por onde ele passe
   * depois, sem precisar de captura nenhuma. É a mesma razão pela qual
   * bibliotecas de carrossel (Swiper, Embla) tratam toque à parte do mouse
   * em vez de unificar tudo em Pointer Events.
   *
   * Precisa ser registrado à mão com `addEventListener` (não pelo
   * `onTouchMove` do React) porque o `touchmove` só consegue segurar o gesto
   * (impedir a rolagem da página) com `passive: false`, e mesmo assim só
   * DEPOIS que o arraste horizontal for confirmado (`draggingRef`): enquanto
   * o dedo não disse pra que lado vai, a página rola normalmente.
   */
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const touchXY = (event: TouchEvent) => {
      const touch = event.touches[0] ?? event.changedTouches[0];
      return touch ? {x: touch.clientX, y: touch.clientY} : null;
    };

    const onTouchStart = (event: TouchEvent) => {
      const point = touchXY(event);
      if (!point) return;
      movedRef.current = false;
      pendingRef.current = {
        x: point.x,
        y: point.y,
        pointerId: 0,
        position: positionRef.current,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      const point = touchXY(event);
      if (!point) return;

      const pending = pendingRef.current;
      if (pending && !draggingRef.current) {
        const dx = point.x - pending.x;
        const dy = point.y - pending.y;
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        // Gesto mais vertical que horizontal: é rolagem da página, desiste.
        if (Math.abs(dy) > Math.abs(dx)) {
          pendingRef.current = null;
          return;
        }
        lockDrag(point.x);
        movedRef.current = true;
      }

      if (!draggingRef.current) return;
      if (event.cancelable) event.preventDefault();
      positionRef.current = dragStartPositionRef.current + (point.x - dragStartXRef.current);
    };

    const onTouchEnd = () => {
      pendingRef.current = null;
      draggingRef.current = false;
      setIsDragging(false);
    };

    viewport.addEventListener('touchstart', onTouchStart, {passive: true});
    viewport.addEventListener('touchmove', onTouchMove, {passive: false});
    viewport.addEventListener('touchend', onTouchEnd, {passive: true});
    viewport.addEventListener('touchcancel', onTouchEnd, {passive: true});
    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveHint = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const hint = hintRef.current;
    if (!viewport || !hint) return;
    const rect = viewport.getBoundingClientRect();
    hint.style.left = `${event.clientX - rect.left}px`;
    hint.style.top = `${event.clientY - rect.top}px`;
  };

  /**
   * Passa a seguir o ponteiro. A captura NÃO entra aqui: capturar já no
   * `pointerdown` faz o `pointerup` ser reapontado para este elemento, e aí o
   * navegador dispara o `click` no ancestral comum (a própria trilha) em vez
   * do botão da peça — o visor nunca abria no mouse. Ela vem depois, em
   * `capturePointer`, só quando o arraste se confirma.
   *
   * Compartilhada com o toque (ver o `useEffect` de Touch Events acima):
   * só mexe em refs e no `setIsDragging`, nada específico de mouse.
   */
  const lockDrag = (x: number) => {
    const pending = pendingRef.current;
    if (!pending) return;
    draggingRef.current = true;
    /*
     * O arraste começa daqui: o dedo/cursor onde está AGORA e a trilha onde
     * ela está AGORA. Partir do ponto do `pointerdown`/`touchstart` fazia a
     * trilha saltar para trás no instante em que o gesto se confirmava,
     * porque ela seguiu correndo sozinha enquanto o gesto ainda não tinha
     * dito para que lado ia.
     */
    dragStartXRef.current = x;
    dragStartPositionRef.current = positionRef.current;
    setIsDragging(true);
  };

  /** Segura o ponteiro para o arraste continuar mesmo saindo da trilha. */
  const capturePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (capturedRef.current) return;
    capturedRef.current = true;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* ponteiro ja solto */
    }
  };

  /*
   * Só mouse daqui pra baixo: o toque tem seu próprio caminho, via Touch
   * Events nativos (ver o `useEffect` acima). Sem esse filtro os dois
   * sistemas processariam o mesmo gesto de toque em paralelo.
   */
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    movedRef.current = false;
    pendingRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      position: positionRef.current,
    };
    // A trilha para na hora, mas sem capturar: enquanto for só um clique
    // parado, o evento precisa chegar inteiro no botão da peça.
    lockDrag(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    moveHint(event);

    if (!draggingRef.current) return;
    if (event.cancelable) event.preventDefault();
    const delta = event.clientX - dragStartXRef.current;
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      // Virou arraste de verdade: agora sim segura o ponteiro (e o clique
      // deixa de valer, ver o onClick da peça).
      movedRef.current = true;
      capturePointer(event);
    }
    positionRef.current = dragStartPositionRef.current + delta;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    pendingRef.current = null;
    capturedRef.current = false;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* ponteiro ja solto */
    }
  };

  // Dois conjuntos idênticos: a volta do loop anda exatamente um conjunto,
  // então o segundo termina onde o primeiro começou, sem costura aparente.
  const run = [...images, ...images];

  return (
    <div
      className={`works-arc${isDragging ? ' works-arc--dragging' : ''}`}
      ref={viewportRef}
      onPointerEnter={moveHint}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
    >
      <span ref={hintRef} className="works-arc__hint" aria-hidden="true">
        Arraste para ver mais
      </span>

      <div className="works-arc__stage" ref={stageRef}>
        <div className="works-arc__track" ref={trackRef}>
          {run.map((img, i) => {
            const index = i % images.length;
            const duplicate = i >= images.length;
            return (
              <figure
                className="works-arc__item"
                key={`${img}-${i}`}
                ref={(node) => {
                  itemRefs.current[i] = node;
                }}
              >
                {/*
                  As cópias também são clicáveis: a peça que o dedo alcança
                  pode ser qualquer uma das duas, e o voo sai justamente da
                  que foi tocada. Só a primeira leva entra na navegação por
                  teclado, para o leitor de tela não repetir a série.
                */}
                <button
                  type="button"
                  className="works-arc__inner"
                  tabIndex={duplicate ? -1 : undefined}
                  aria-hidden={duplicate || undefined}
                  ref={(node) => {
                    cardRefs.current[i] = node;
                  }}
                  onClick={(event) => {
                    // O gesto foi um arraste, não um clique na peça.
                    if (movedRef.current) return;
                    openWork(index, event.currentTarget);
                  }}
                  aria-label={`Ampliar trabalho ${index + 1} de ${images.length}`}
                >
                  <img
                    src={asset(img)}
                    alt={duplicate ? '' : `${caption}, trabalho ${index + 1}`}
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              </figure>
            );
          })}
        </div>
      </div>

      {lightbox}
    </div>
  );
}
