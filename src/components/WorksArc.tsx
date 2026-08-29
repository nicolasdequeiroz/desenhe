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
  /*
   * No toque, capturar o ponteiro logo no `pointerdown` faz o navegador
   * disparar `pointercancel` enquanto ainda decide se o gesto é rolagem
   * vertical: o arraste morre antes de comecar. Entao o toque fica
   * "pendente" e so vira arraste (captura + flag) quando o movimento se
   * confirma mais horizontal que vertical. Mouse trava na hora.
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

  const moveHint = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const hint = hintRef.current;
    if (!viewport || !hint) return;
    const rect = viewport.getBoundingClientRect();
    hint.style.left = `${event.clientX - rect.left}px`;
    hint.style.top = `${event.clientY - rect.top}px`;
  };

  const lockDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const pending = pendingRef.current;
    if (!pending) return;
    draggingRef.current = true;
    dragStartXRef.current = pending.x;
    dragStartPositionRef.current = pending.position;
    setIsDragging(true);
    try {
      event.currentTarget.setPointerCapture(pending.pointerId);
    } catch {
      /* ponteiro ja solto */
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    movedRef.current = false;
    pendingRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      position: positionRef.current,
    };
    if (event.pointerType === 'mouse') lockDrag(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    moveHint(event);

    const pending = pendingRef.current;
    if (pending && !draggingRef.current) {
      const dx = event.clientX - pending.x;
      const dy = event.clientY - pending.y;
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      // Gesto mais vertical que horizontal: e rolagem da pagina, desiste.
      if (Math.abs(dy) > Math.abs(dx)) {
        pendingRef.current = null;
        return;
      }
      lockDrag(event);
    }

    if (!draggingRef.current) return;
    if (event.cancelable) event.preventDefault();
    const delta = event.clientX - dragStartXRef.current;
    if (Math.abs(delta) > DRAG_THRESHOLD) movedRef.current = true;
    positionRef.current = dragStartPositionRef.current + delta;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    pendingRef.current = null;
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
