import {useEffect} from 'react';

/**
 * Trava a rolagem da página enquanto um painel em tela cheia está aberto.
 *
 * Travar tira a barra de rolagem, e sem cuidado a viewport fica uns 15px mais
 * larga: tudo que está atrás do painel pula de lugar na abertura e de novo no
 * fechamento. A calha reservada no `html` ocupa exatamente o espaço que a
 * barra ocupava, então nada muda de largura, nem o conteúdo nem os elementos
 * fixos (o header das páginas de curso é `position: fixed` e não seria
 * alcançado por uma compensação no `body`).
 *
 * A calha só entra se havia barra: em página curta, ou onde a barra é
 * sobreposta (macOS, iOS), reservá-la é que causaria o pulo.
 */
export function useScrollLock() {
  useEffect(() => {
    const root = document.documentElement;
    const {body} = document;
    const previousRootOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    const previousBodyOverflow = body.style.overflow;
    const hadScrollbar = window.innerWidth > root.clientWidth;

    if (hadScrollbar) root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
    // O `body` junto porque no iOS a trava só no `html` nem sempre segura.
    body.style.overflow = 'hidden';

    return () => {
      root.style.overflow = previousRootOverflow;
      root.style.scrollbarGutter = previousGutter;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);
}
