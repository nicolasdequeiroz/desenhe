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
       * "scroll container" para efeitos de `position: sticky`, mas como
       * ninguém rola essa div (quem rola é a janela), o header dentro dela
       * nunca gruda no topo. Com o header como irmão, ele soma sua rolagem
       * à da janela normalmente.
       */}
      <main className="site-shell">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsFloat />
      {/*
       * Âncora só para o Safari (iOS 26, "Liquid Glass"): ele lê o
       * background-color do elemento fixed mais próximo da borda de baixo da
       * tela para colorir a própria barra ali, e sem um elemento sólido bem
       * ali ele acaba refletindo o que está sob a barra (a foto/vídeo do
       * hero, por exemplo), em vez do fundo escuro do site. Ver
       * .safari-toolbar-anchor em site.css.
       */}
      <div className="safari-toolbar-anchor" aria-hidden="true" />
      <ScrollRestoration />
    </>
  );
}
