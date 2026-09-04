import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {X, ArrowUUpLeft, Eraser, Trash} from '@phosphor-icons/react';
import {DoodleThumb} from './DoodlePile';
import {
  DOODLE_RATIO,
  isRemoteEnabled,
  renderStrokes,
  submitDoodle,
  type Doodle,
  type Stroke,
} from '../data/guestbook';

/** Paleta do quadro: lápis de cor da escola. */
const COLORS = [
  '#231a13',
  '#f67800',
  '#d92b2b',
  '#e0a52b',
  '#3f8f4a',
  '#2b6bd9',
  '#7a4bc4',
  '#c94f8e',
  '#8a6a4f',
  '#fffbf7',
];

/** Cor do papel: a borracha pinta com ela. */
const PAPER = '#fffbf7';

/** Tempo com a mensagem de sucesso na tela antes do painel fechar sozinho. */
const AUTO_CLOSE_MS = 1500;

/** Confete sutil: tons de laranja da própria paleta do quadro. */
const CONFETTI_COLORS = ['#f67800', '#e0a52b', '#ffb15c', '#df7400'];

interface ConfettiPiece {
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rot: number;
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({length: 16}, () => ({
    left: Math.random() * 100,
    size: 5 + Math.random() * 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 150,
    duration: 700 + Math.random() * 450,
    rot: (Math.random() - 0.5) * 300,
  }));
}

const MIN_W = 0.004;
const MAX_W = 0.03;
/** Faixa em px da bolinha de prévia da espessura. */
const PREVIEW_MIN_PX = 4;
const PREVIEW_MAX_PX = 20;

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])';

interface Props {
  onClose: () => void;
  onSubmitted: (doodle: Doodle) => void;
  doodles: Doodle[];
}

export function GuestbookPanel({onClose, onSubmitted, doodles}: Props) {
  const [tab, setTab] = useState<'draw' | 'gallery'>('draw');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(0.012);
  const [erasing, setErasing] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'local'>('idle');
  const [confetti, setConfetti] = useState<ConfettiPiece[] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<Stroke | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  // Some se o painel for desmontado antes do fechamento automático disparar
  // (ex.: usuário clicou em fechar durante a janela de "Pronto!").
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Fecha com Escape e trava o foco dentro do painel: padrão de diálogo modal.
  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
  }, [onClose]);

  // Redesenha o quadro sempre que os traços mudam (e no resize).
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const paint = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderStrokes(ctx, strokes, w, h);
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [strokes]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Normalizado 0..1 e arredondado: payload pequeno o bastante para a planilha.
    return [
      Math.round(((event.clientX - rect.left) / rect.width) * 1000) / 1000,
      Math.round(((event.clientY - rect.top) / rect.height) * 1000) / 1000,
    ];
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      // Alguns navegadores lançam se o ponteiro já não está ativo.
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* segue sem captura: o traço ainda funciona dentro do quadro */
    }
    const [x, y] = pointFromEvent(event);
    drawingRef.current = {
      c: erasing ? PAPER : color,
      w: erasing ? Math.max(size * 2.5, 0.02) : size,
      p: [x, y],
    };
    setStrokes((prev) => [...prev, drawingRef.current as Stroke]);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = drawingRef.current;
    if (!stroke) return;

    const [x, y] = pointFromEvent(event);
    const lastX = stroke.p[stroke.p.length - 2];
    const lastY = stroke.p[stroke.p.length - 1];
    // Descarta micro-movimentos: menos pontos, mesmo traço.
    if (Math.hypot(x - lastX, y - lastY) < 0.004) return;

    stroke.p.push(x, y);
    setStrokes((prev) => [...prev.slice(0, -1), {...stroke}]);
  };

  const endStroke = () => {
    drawingRef.current = null;
  };

  const undo = () => setStrokes((prev) => prev.slice(0, -1));
  const clear = () => setStrokes([]);

  const send = async () => {
    if (!strokes.length || status === 'sending') return;
    setStatus('sending');
    const result = await submitDoodle(name, strokes);
    const stored = result.stored;
    setStatus(stored === 'remote' ? 'done' : 'local');
    if (stored === 'remote') setConfetti(makeConfetti());
    onSubmitted({
      id: `${Date.now().toString(36)}-local`,
      name: name.trim().slice(0, 24) || 'Anônimo',
      createdAt: new Date().toISOString(),
      strokes,
    });
    setStrokes([]);
    setName('');
    // Deixa a mensagem de sucesso visível um instante antes de fechar sozinho.
    closeTimerRef.current = window.setTimeout(onClose, AUTO_CLOSE_MS);
  };

  const previewPx =
    PREVIEW_MIN_PX + ((size - MIN_W) / (MAX_W - MIN_W)) * (PREVIEW_MAX_PX - PREVIEW_MIN_PX);

  return (
    <>
      <div className="guestbook-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="guestbook-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Deixe um desenho"
        ref={panelRef}
      >
        {confetti && (
          <div className="guestbook-confetti" aria-hidden="true">
            {confetti.map((piece, index) => (
              <span
                key={index}
                className="guestbook-confetti__piece"
                style={{
                  left: `${piece.left}%`,
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  background: piece.color,
                  animationDelay: `${piece.delay}ms`,
                  animationDuration: `${piece.duration}ms`,
                  '--guestbook-confetti-rot': `${piece.rot}deg`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        <div className="guestbook-panel__hdr">
          <p className="guestbook-panel__title">Deixe um desenho</p>
          <button
            type="button"
            className="guestbook-panel__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="guestbook-panel__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'draw'}
            className={`guestbook-panel__tab${tab === 'draw' ? ' is-active' : ''}`}
            onClick={() => setTab('draw')}
          >
            Desenhar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'gallery'}
            className={`guestbook-panel__tab${tab === 'gallery' ? ' is-active' : ''}`}
            onClick={() => setTab('gallery')}
          >
            Galeria
          </button>
        </div>

        {tab === 'draw' ? (
          <div className="guestbook-panel__view">
            <div className="guestbook-panel__canvas-wrap" style={{aspectRatio: DOODLE_RATIO}}>
              <canvas
                ref={canvasRef}
                className="guestbook-panel__canvas"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endStroke}
                onPointerCancel={endStroke}
              />
            </div>

            <div className="guestbook-panel__toolbar">
              <div className="guestbook-panel__swatches">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`guestbook-panel__swatch${
                      c === color && !erasing ? ' is-active' : ''
                    }`}
                    style={{background: c}}
                    aria-label={`Cor ${c}`}
                    aria-pressed={c === color && !erasing}
                    onClick={() => {
                      setColor(c);
                      setErasing(false);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className={`guestbook-panel__tool${erasing ? ' is-active' : ''}`}
                onClick={() => setErasing((v) => !v)}
                aria-pressed={erasing}
                aria-label="Borracha"
                title="Borracha"
              >
                <Eraser size={16} />
              </button>
            </div>

            <div className="guestbook-panel__toolbar guestbook-panel__toolbar--size">
              <label className="guestbook-panel__brush">
                <span
                  className="guestbook-panel__brush-dot"
                  style={{
                    width: `${previewPx}px`,
                    height: `${previewPx}px`,
                    background: erasing ? PAPER : color,
                  }}
                  aria-hidden="true"
                />
                <span className="sr-only">Espessura do traço</span>
                <input
                  type="range"
                  min={MIN_W * 1000}
                  max={MAX_W * 1000}
                  value={size * 1000}
                  onChange={(e) => setSize(Number(e.target.value) / 1000)}
                />
              </label>
              <div className="guestbook-panel__history">
                <button
                  type="button"
                  className="guestbook-panel__tool"
                  onClick={undo}
                  disabled={!strokes.length}
                  aria-label="Desfazer"
                  title="Desfazer"
                >
                  <ArrowUUpLeft size={16} />
                </button>
                <button
                  type="button"
                  className="guestbook-panel__tool"
                  onClick={clear}
                  disabled={!strokes.length}
                  aria-label="Limpar tudo"
                  title="Limpar tudo"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>

            <div className="guestbook-panel__submit">
              <input
                className="guestbook-panel__name"
                placeholder="Seu nome (opcional)"
                value={name}
                maxLength={24}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                type="button"
                className="btn primary sm"
                onClick={send}
                disabled={!strokes.length || status === 'sending'}
              >
                <span>{status === 'sending' ? 'Enviando…' : 'Enviar'}</span>
              </button>
            </div>

            {status === 'done' && (
              <p className="guestbook-panel__msg guestbook-panel__msg--ok">
                Pronto! Seu desenho entrou na pilha 😊
              </p>
            )}
            {status === 'local' && (
              <p className="guestbook-panel__msg">
                {isRemoteEnabled()
                  ? 'Não deu para salvar no servidor agora. Seu desenho ficou salvo neste navegador.'
                  : 'Salvo neste navegador. Configure o endpoint para que todos vejam.'}
              </p>
            )}
          </div>
        ) : (
          <div className="guestbook-panel__view guestbook-panel__gallery">
            {doodles.length ? (
              <div className="guestbook-panel__grid">
                {[...doodles].reverse().map((doodle) => (
                  <div key={doodle.id} className="guestbook-panel__polaroid">
                    <DoodleThumb doodle={doodle} width={92} />
                    <span className="guestbook-panel__polaroid-name">{doodle.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="guestbook-panel__empty">Nenhum desenho ainda. Seja o primeiro ✦</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
