import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {renderStrokes, DOODLE_RATIO, type Doodle} from '../data/guestbook';

/** Quantos desenhos ficam empilhados no rodapé (os mais recentes). */
const MAX_VISIBLE_DESKTOP = 22;
/** No mobile o rodapé é mais baixo em largura — poucos cartões, menores. */
const MAX_VISIBLE_MOBILE = 6;
const THUMB_WIDTH_DESKTOP = 116;
const THUMB_WIDTH_MOBILE = 84;
const MOBILE_QUERY = '(max-width: 640px)';

/** Miniatura de um desenho, redesenhada dos traços (nunca uma imagem). */
export function DoodleThumb({doodle, width = 116}: {doodle: Doodle; width?: number}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = Math.round(width / DOODLE_RATIO);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderStrokes(ctx, doodle.strokes, width, height);
  }, [doodle, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{width: `${width}px`, height: `${height}px`}}
      role="img"
      aria-label={`Desenho de ${doodle.name}`}
    />
  );
}

/**
 * Pilha de desenhos no pé da página: os cartões caem e se acomodam com física
 * (matter-js, como no site de referência) e podem ser arrastados. Com
 * `prefers-reduced-motion` a simulação não roda e os cartões ficam enfileirados.
 */
export function DoodlePile({doodles}: {doodles: Doodle[]}) {
  // Padrão desktop no primeiro render (server e cliente têm que bater); o
  // efeito abaixo ajusta para mobile assim que o viewport real é conhecido.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const maxVisible = isMobile ? MAX_VISIBLE_MOBILE : MAX_VISIBLE_DESKTOP;
  const thumbWidth = isMobile ? THUMB_WIDTH_MOBILE : THUMB_WIDTH_DESKTOP;
  const visible = doodles.slice(-maxVisible);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const signature = visible.map((d) => d.id).join(',');

  /*
   * A física só começa quando o scroll chega de fato no fim da página — não
   * dá pra usar IntersectionObserver no container: o rodapé é `position:
   * sticky; bottom: 0`, então geometricamente ele já "está na tela" quase
   * desde o início, só que escondido atrás da camada opaca (.site-shell,
   * z-index maior). O observer não enxerga essa oclusão visual, então o
   * gatilho real é comparar a posição do scroll com a altura do documento.
   */
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;

    const checkScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (scrolledToBottom) setInView(true);
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, {passive: true});
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [inView]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /*
     * Os cartões nascem ocultos (ver CSS) pra não piscar a grade estática
     * antes da física assumir — o import do matter-js é assíncrono e demora
     * um instante. Sem movimento reduzido, não tem física nenhuma pra
     * esperar: revela a grade estática de uma vez.
     */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.classList.add('is-static');
      return;
    }

    if (!inView) return;
    if (!visible.length) return;

    let stop = () => {};
    let cancelled = false;

    (async () => {
      const Matter = await import('matter-js');
      if (cancelled) return;

      const {Engine, Runner, Composite, Bodies, Body, Mouse, MouseConstraint} = Matter;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      const engine = Engine.create();
      engine.gravity.y = 1;

      const WALL = 200;
      const walls = [
        // Chão e paredes ficam para fora da área visível, escondendo a espessura.
        Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, {isStatic: true}),
        Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 3, {isStatic: true}),
        Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 3, {isStatic: true}),
      ];
      Composite.add(engine.world, walls);

      const elements = itemsRef.current.filter(Boolean) as HTMLDivElement[];
      const bodies = elements.map((el, index) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const body = Bodies.rectangle(
          width * (0.12 + 0.76 * Math.random()),
          // Entram escalonados acima do topo para caírem em cascata, não em bloco.
          -h - index * (h * 0.9),
          w,
          h,
          {restitution: 0.25, friction: 0.6, angle: (Math.random() - 0.5) * 0.6},
        );
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        return body;
      });
      Composite.add(engine.world, bodies);

      /*
       * Arrastar só onde existe mouse: no toque, o Mouse do matter dá
       * preventDefault no touchmove e a página deixaria de rolar sobre a pilha.
       */
      if (window.matchMedia('(pointer: fine)').matches) {
        const mouse = Mouse.create(container);
        // O matter também escuta a roda do mouse; sem soltar, a página trava.
        const wheelHandler = (mouse as typeof mouse & {
          mousewheel(event: Event): void;
        }).mousewheel;
        container.removeEventListener('wheel', wheelHandler);
        container.removeEventListener('DOMMouseScroll', wheelHandler);

        Composite.add(
          engine.world,
          MouseConstraint.create(engine, {
            mouse,
            constraint: {stiffness: 0.2, render: {visible: false}},
          }),
        );
      }

      const runner = Runner.create();
      Runner.run(runner, engine);

      // Só agora os cartões passam a ser posicionados pela simulação.
      container.classList.add('is-simulated');

      let frame = 0;
      const sync = () => {
        bodies.forEach((body, index) => {
          const el = elements[index];
          if (!el) return;
          el.style.transform =
            `translate(${body.position.x - el.offsetWidth / 2}px, ` +
            `${body.position.y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`;
        });
        frame = requestAnimationFrame(sync);
      };
      sync();

      stop = () => {
        cancelAnimationFrame(frame);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        container.classList.remove('is-simulated');
        elements.forEach((el) => {
          el.style.transform = '';
        });
      };
    })();

    return () => {
      cancelled = true;
      stop();
    };
    /*
     * `signature` cobre a lista (um envio novo refaz a pilha e o desenho cai);
     * `thumbWidth` porque o breakpoint muda o tamanho dos cartões, então os
     * corpos físicos precisam ser recriados do tamanho certo.
     */
  }, [signature, visible.length, thumbWidth, inView]);

  if (!visible.length) return null;

  return (
    <div className="doodle-pile" ref={containerRef} aria-label="Desenhos deixados por visitantes">
      {visible.map((doodle, index) => (
        <div
          key={doodle.id}
          className="doodle-pile__item"
          ref={(el) => {
            itemsRef.current[index] = el;
          }}
        >
          <div className="doodle-pile__card">
            <DoodleThumb doodle={doodle} width={thumbWidth} />
            <span className="doodle-pile__name">{doodle.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
