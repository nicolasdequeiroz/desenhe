import {Head} from 'vite-react-ssg';
import {SITE} from '../data/site';

interface SeoProps {
  title?: string;
  description?: string;
  /** Caminho canônico da página, ex.: '/cursos/desenho-artistico' */
  path?: string;
  image?: string;
}

export function Seo({title, description, path, image}: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE.shortName}` : SITE.name;
  const desc = description ?? SITE.description;
  const canonical = path ? `${SITE.url}${path}` : SITE.url;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      {image && <meta property="og:image" content={`${SITE.url}${image}`} />}
    </Head>
  );
}
