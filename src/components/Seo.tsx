import {Head} from 'vite-react-ssg';
import {SITE} from '../data/site';

interface SeoProps {
  title?: string;
  description?: string;
  /** Caminho canônico da página, ex.: '/cursos/desenho-artistico' */
  path?: string;
  /**
   * Imagem do preview do link (og:image). Precisa ser JPEG ou PNG: o
   * WhatsApp, principal canal da escola, não gera preview de .webp.
   * Sem isto, a página herda a foto da fachada.
   */
  image?: string;
  /**
   * Tira a página do índice de busca sem tirá-la do ar. Serve para páginas
   * de campanha fora de temporada, que continuam valendo por link direto.
   */
  noindex?: boolean;
}

export function Seo({title, description, path, image, noindex}: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE.shortName}` : SITE.defaultTitle;
  const desc = description ?? SITE.description;
  const canonical = path ? `${SITE.url}${path}` : SITE.url;
  const ogImage = `${SITE.url}${image ?? SITE.ogImage}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={SITE.ogImageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
