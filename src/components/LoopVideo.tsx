import {useEffect, useRef} from 'react';
import {asset} from '../data';

/**
 * Vídeo mudo em loop para a parede da galeria. Só baixa e toca enquanto está
 * à vista (`preload="none"` até o primeiro play), e pausa ao sair da tela
 * para não gastar dados nem bateria. Com "reduzir movimento" ligado fica
 * parado no cartaz. É decorativo: quem quer ver e ouvir abre o visor.
 */
export function LoopVideo({src, poster, className}: {src: string; poster: string; className?: string}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // O React não reflete a prop `muted` no DOM: sem isto o autoplay pode ser barrado.
    video.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      {threshold: 0.25},
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={asset(src)}
      poster={asset(poster)}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
