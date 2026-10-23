import {Head} from 'vite-react-ssg';

/**
 * Dados estruturados da página (ver src/data/seo.ts), num único bloco
 * JSON-LD no <head>. O `<` sai escapado para um texto qualquer nunca poder
 * fechar o <script> antes da hora.
 */
export function JsonLd({graph}: {graph: (object | null)[]}) {
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph.filter(Boolean),
  }).replace(/</g, '\\u003c');

  return (
    <Head>
      <script type="application/ld+json">{json}</script>
    </Head>
  );
}
