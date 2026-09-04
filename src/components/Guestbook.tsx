import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {PencilSimple} from '@phosphor-icons/react';
import {isRemoteEnabled, listDoodles, type Doodle} from '../data/guestbook';
import {DoodlePile} from './DoodlePile';

/* O painel só é baixado quando alguém decide desenhar. */
const GuestbookPanel = lazy(() =>
  import('./GuestbookPanel').then((m) => ({default: m.GuestbookPanel})),
);

/** Confete sutil: tons de laranja da própria paleta do quadro. */
const CONFETTI_COLORS = ['#f67800', '#e0a52b', '#ffb15c', '#df7400'];
/** Tempo total do toast na tela, do surgimento ao sumiço. */
const TOAST_DURATION_MS = 5500;
/** Janela final em que o toast desliza pra fora antes de sumir de vez. */
const TOAST_EXIT_MS = 350;
/** Maior atraso + maior duração possíveis de uma peça: baliza a limpeza do confete. */
const CONFETTI_MAX_LIFETIME_MS = 300 + 2600;

interface ConfettiPiece {
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rot: number;
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({length: 22}, () => ({
    left: Math.random() * 100,
    size: 5 + Math.random() * 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 300,
    duration: 1800 + Math.random() * 800,
    rot: (Math.random() - 0.5) * 300,
  }));
}

interface Toast {
  id: number;
  message: string;
  tone: 'ok' | 'warn';
}

/**
 * Livro de visitas do rodapé: a pilha de desenhos e o botão-lápis que abre o
 * quadro. A leitura acontece só no cliente: a página estática é gerada sem
 * desenho nenhum e eles entram na hidratação.
 */
export function Guestbook() {
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  // Desenhos enviados nesta sessão: sempre visíveis na pilha (mesmo quando a
  // seleção do resto vira sorteio, ver DoodlePile), já que quem desenhou
  // espera ver o próprio traço na hora, aprovado ou não.
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [confetti, setConfetti] = useState<ConfettiPiece[] | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [toastLeaving, setToastLeaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    listDoodles().then((list) => {
      if (active) setDoodles(list);
    });
    return () => {
      active = false;
    };
  }, []);

  // O lápis treme só a partir de 90% da página; antes disso fica quieto.
  useEffect(() => {
    const checkScroll = () => {
      const ratio =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      setNearFooter(ratio >= 0.9);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll, {passive: true});
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // O toast some sozinho: desliza pra fora perto do fim e é desmontado no
  // fim de fato. Reinicia a cada novo envio (a troca de `toast.id` refaz o
  // efeito, cancelando os timers do toast anterior).
  useEffect(() => {
    if (!toast) return;
    setToastLeaving(false);
    const leaveTimer = window.setTimeout(
      () => setToastLeaving(true),
      TOAST_DURATION_MS - TOAST_EXIT_MS,
    );
    const removeTimer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, [toast]);

  // Confete: limpa sozinho depois da animação mais longa, pra não deixar
  // <span>s invisíveis penduradas no rodapé.
  const confettiTimer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (confettiTimer.current !== null) window.clearTimeout(confettiTimer.current);
    };
  }, []);

  const handleSubmitted = (doodle: Doodle, stored: 'remote' | 'local') => {
    setDoodles((prev) => [...prev, doodle]);
    setPinnedIds((prev) => [...prev, doodle.id]);

    if (stored === 'remote') {
      setConfetti(makeConfetti());
      if (confettiTimer.current !== null) window.clearTimeout(confettiTimer.current);
      confettiTimer.current = window.setTimeout(() => setConfetti(null), CONFETTI_MAX_LIFETIME_MS);
      setToast({id: Date.now(), message: 'Pronto! Seu desenho entrou na pilha 😊', tone: 'ok'});
    } else {
      setToast({
        id: Date.now(),
        message: isRemoteEnabled()
          ? 'Não deu pra salvar no servidor agora. Ficou salvo neste navegador.'
          : 'Salvo neste navegador. Configure o endpoint pra todo mundo ver.',
        tone: 'warn',
      });
    }
  };

  /*
   * O botão, o quadro e o toast vão para o <body> num portal. O rodapé usa
   * `position: sticky` (efeito de gaveta) e sticky sempre cria um contexto de
   * empilhamento; de dentro dele, nem `position: fixed` com z-index alto
   * escaparia para cima da camada de conteúdo.
   */
  const floating = (
    <>
      <button
        type="button"
        className={`guestbook-fab${open ? ' is-open' : ''}${
          nearFooter && !open ? ' is-shaking' : ''
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Fechar o quadro de desenho' : 'Abrir o quadro de desenho'}
      >
        <PencilSimple size={nearFooter && !open ? 28 : 24} weight="fill" aria-hidden="true" />
      </button>

      {open && (
        <Suspense fallback={null}>
          <GuestbookPanel doodles={doodles} onClose={() => setOpen(false)} onSubmitted={handleSubmitted} />
        </Suspense>
      )}

      {toast && (
        <div
          className={`guestbook-toast guestbook-toast--${toast.tone}${
            toastLeaving ? ' is-leaving' : ''
          }`}
          role="status"
        >
          <span className="guestbook-toast__text">{toast.message}</span>
          <svg className="guestbook-toast__timer" viewBox="0 0 20 20" aria-hidden="true">
            <circle className="guestbook-toast__timer-track" cx="10" cy="10" r="8" />
            <circle
              className="guestbook-toast__timer-fill"
              cx="10"
              cy="10"
              r="8"
              style={{animationDuration: `${TOAST_DURATION_MS}ms`}}
            />
          </svg>
        </div>
      )}
    </>
  );

  return (
    <>
      <DoodlePile doodles={doodles} pinnedIds={pinnedIds} />
      {confetti && (
        <div className="footer-confetti" aria-hidden="true">
          {confetti.map((piece, index) => (
            <span
              key={index}
              className="footer-confetti__piece"
              style={
                {
                  left: `${piece.left}%`,
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  background: piece.color,
                  animationDelay: `${piece.delay}ms`,
                  animationDuration: `${piece.duration}ms`,
                  '--footer-confetti-rot': `${piece.rot}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
      {mounted && createPortal(floating, document.body)}
    </>
  );
}
