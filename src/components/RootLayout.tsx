import {Outlet, ScrollRestoration} from 'react-router-dom';
import {SiteHeader} from './SiteHeader';
import {SiteFooter} from './SiteFooter';
import {WhatsFloat} from './WhatsFloat';

export function RootLayout() {
  return (
    <>
      <SiteHeader />
      {/*
       * O conteúdo é uma camada opaca por cima do rodapé, que fica preso ao
       * fundo da viewport (sticky). Ao chegar no fim da página esta camada
       * desliza e revela o rodapé por baixo, como uma gaveta.
       *
       * O header fica FORA dessa camada de propósito: `overflow: hidden` (usado
       * para recortar os cantos arredondados) transforma o ancestral num
       * "scroll container" para efeitos de `position: sticky` — mas como
       * ninguém rola essa div (quem rola é a janela), o header dentro dela
       * nunca gruda no topo. Com o header como irmão, ele soma sua rolagem
       * à da janela normalmente.
       */}
      <main className="site-shell">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsFloat />
      <ScrollRestoration />
    </>
  );
}
