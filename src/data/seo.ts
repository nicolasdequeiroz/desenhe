/**
 * Dados estruturados (schema.org, JSON-LD) montados a partir dos mesmos dados
 * que o site já mostra na tela: o que o buscador lê aqui é sempre o que o
 * visitante vê (FAQ, formato, condutor), sem uma segunda cópia para manter.
 * O componente `JsonLd` injeta o resultado no <head> de cada página.
 */
import {SITE} from './site';
import type {InCompanyFormat} from './inCompany';

const abs = (path: string) => `${SITE.url}${path}`;

/** Identificador estável da escola, referenciado pelas páginas de serviço. */
export const ORGANIZATION_ID = `${abs('/')}#organization`;

/** Referência curta à escola, para páginas que não a descrevem por inteiro. */
const organizationRef = {
  '@type': 'EducationalOrganization',
  '@id': ORGANIZATION_ID,
  name: SITE.name,
  url: abs('/'),
};

/** Escola como organização local, na home. Só o que o site afirma em texto. */
export function organizationSchema() {
  const [latitude, longitude] = SITE.coordinates.split(',').map(Number);
  return {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: abs('/'),
    description: SITE.description,
    image: abs(SITE.ogImage),
    telephone: `+${SITE.whatsapp}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      addressCountry: 'BR',
    },
    geo: {'@type': 'GeoCoordinates', latitude, longitude},
    sameAs: [SITE.instagram, SITE.facebook],
  };
}

/** Trilha de navegação (Início > ... > página atual). */
export function breadcrumbSchema(items: {name: string; path: string}[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{name: 'Início', path: '/'}, ...items].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** Perguntas frequentes, exatamente as que estão na página. */
export function faqSchema(items: {question: string; answer: string}[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {'@type': 'Answer', text: item.answer},
    })),
  };
}

/** Lista de serviços do hub /in-company. */
export function serviceListSchema(formats: InCompanyFormat[]) {
  return {
    '@type': 'ItemList',
    itemListElement: formats.map((format, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: abs(`/in-company/${format.slug}`),
      name: format.title,
    })),
  };
}

/** Serviço de uma página de formato, prestado pela escola em Curitiba. */
export function serviceSchema(format: InCompanyFormat) {
  const page = format.page;
  if (!page) return null;
  return {
    '@type': 'Service',
    name: format.title,
    description: page.seoDescription,
    url: abs(`/in-company/${format.slug}`),
    image: abs(page.ogImage),
    provider: organizationRef,
    areaServed: [
      {'@type': 'City', name: SITE.address.city},
      {'@type': 'AdministrativeArea', name: 'Região Metropolitana de Curitiba'},
    ],
  };
}

/** Quem conduz a ação, quando a página apresenta a pessoa. */
export function speakerSchema(speaker: NonNullable<NonNullable<InCompanyFormat['page']>['speaker']>) {
  return {
    '@type': 'Person',
    name: speaker.name,
    description: speaker.credential,
    image: abs(speaker.photo),
    worksFor: organizationRef,
  };
}
