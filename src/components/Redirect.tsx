import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Head} from 'vite-react-ssg';
import {SITE, asset} from '../data';

/**
 * Redirect das URLs antigas (Wix) para o endereço novo.
 *
 * O GitHub Pages não emite 301, então o redirect precisa morar no próprio
 * HTML pré-renderizado: um `meta refresh` de 0s, que o Google trata como
 * redirect permanente, mais o `canonical` do destino, para a autoridade da
 * URL antiga migrar para a nova. Sem isso a página antiga chega ao crawler
 * como um HTML em branco (soft 404) e o histórico de busca se perde.
 *
 * O `navigate` cobre o caso da navegação interna (SPA), em que o HTML
 * estático nunca é lido, e o parágrafo visível é o plano B de quem tiver o
 * refresh bloqueado: a página nunca fica vazia e o crawler acha um link real.
 */
export function Redirect({to}: {to: string}) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, {replace: true});
  }, [navigate, to]);

  // O canonical aponta para a URL final no domínio, sem âncora.
  const canonical = `${SITE.url}${to.split('#')[0]}`;
  // O href precisa do base path do deploy (raiz no domínio, /desenhe/ no Pages).
  const href = asset(to);

  return (
    <>
      {import.meta.env.SSR && (
        <Head>
          <title>{`Esta página mudou de endereço | ${SITE.shortName}`}</title>
          <meta httpEquiv="refresh" content={`0; url=${href}`} />
          <link rel="canonical" href={canonical} />
        </Head>
      )}
      <div className="redirect-notice">
        <p>
          Esta página mudou de endereço.{' '}
          <a href={href}>Continuar para a página nova</a>.
        </p>
      </div>
    </>
  );
}
