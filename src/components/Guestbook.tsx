import {lazy, Suspense, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {PencilSimple} from '@phosphor-icons/react';
import {listDoodles, type Doodle} from '../data/guestbook';
import {DoodlePile} from './DoodlePile';

/* O painel só é baixado quando alguém decide desenhar. */
const GuestbookPanel = lazy(() =>
  import('./GuestbookPanel').then((m) => ({default: m.GuestbookPanel})),
);

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

  /*
   * O botão e o quadro vão para o <body> num portal. O rodapé usa
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
          <GuestbookPanel
            doodles={doodles}
            onClose={() => setOpen(false)}
            onSubmitted={(doodle) => setDoodles((prev) => [...prev, doodle])}
          />
        </Suspense>
      )}
    </>
  );

  return (
    <>
      <DoodlePile doodles={doodles} />
      {mounted && createPortal(floating, document.body)}
    </>
  );
}
