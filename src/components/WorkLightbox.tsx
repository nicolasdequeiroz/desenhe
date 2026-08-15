import {useCallback, useRef, useState} from 'react';
import type {GalleryCredit} from '../data';
import {WorkViewer} from './WorkViewer';

interface LightboxOptions {
  images: string[];
  /** Legenda coletiva, usada nos textos alternativos e no rodapé do visor. */
  caption: string;
  /** Autor e ano de cada imagem, no mesmo índice de `images` (ver courses.ts). */
  credits?: GalleryCredit[];
  /**
   * Elemento visual correspondente a cada imagem na página: é de onde a peça
   * voa ao abrir e para onde ela volta ao fechar. Usado quando o índice muda
   * dentro do visor; para a peça clicada, quem manda é o elemento passado
   * direto para `openWork`.
   */
  getOrigin?: (index: number) => HTMLElement | null;
  /** Chamado ao fechar, para devolver o foco a quem abriu. */
  onClosed?: (index: number) => void;
}

/**
 * Visor de trabalhos compartilhado pelo baralho da primeira dobra e pela
 * parede da galeria: devolve o gatilho e o próprio visor já pronto para ser
 * renderizado pela página.
 */
export function useWorkLightbox({
  images,
  caption,
  credits,
  getOrigin,
  onClosed,
}: LightboxOptions) {
  const [index, setIndex] = useState<number | null>(null);
  const clickedRef = useRef<{index: number; element: HTMLElement} | null>(null);

  const openWork = useCallback((next: number, element?: HTMLElement | null) => {
    clickedRef.current = element ? {index: next, element} : null;
    setIndex(next);
  }, []);

  const resolveOrigin = useCallback(
    (target: number) => {
      const clicked = clickedRef.current;
      if (clicked && clicked.index === target) return clicked.element;
      return getOrigin?.(target) ?? null;
    },
    [getOrigin],
  );

  const handleClosed = useCallback(
    (closedIndex: number) => {
      clickedRef.current = null;
      setIndex(null);
      onClosed?.(closedIndex);
    },
    [onClosed],
  );

  const navigate = useCallback(
    (step: number) => {
      setIndex((current) =>
        current === null
          ? current
          : (current + step + images.length) % images.length,
      );
    },
    [images.length],
  );

  const lightbox =
    index === null ? null : (
      <WorkViewer
        images={images}
        caption={caption}
        credits={credits}
        index={index}
        resolveOrigin={resolveOrigin}
        onClose={handleClosed}
        onNavigate={navigate}
      />
    );

  return {openWork, lightbox};
}
