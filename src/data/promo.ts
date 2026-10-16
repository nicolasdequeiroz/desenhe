/**
 * Campanhas em destaque no site (o "Em destaque" da home).
 *
 * Durante a vida do site esse espaço roda entre iniciativas diferentes:
 * Colônia de Férias de inverno, Colônia de verão, Coworking, etc., às vezes
 * mais de uma ao mesmo tempo. Em vez de espalhar `if` por header e home, cada
 * campanha é um objeto `FeaturedPromo` e o site inteiro lê `FEATURED_PROMOS`:
 *
 *  - `SiteHeader` acrescenta um link `nav.label -> path` por campanha na
 *    navegação (desktop e menu mobile), logo depois de "Professores".
 *  - `Home` mostra o card com foto (`FeaturedPromoCard`) ao lado do hero no
 *    desktop e numa seção logo abaixo do hero no mobile/tablet. Com mais de
 *    uma campanha, ele gira sozinho a cada `PROMO_ROTATION_MS`, na ordem da
 *    lista.
 *
 * Para trocar o que está em cartaz, edite a lista (a ordem é a de exibição).
 * Para não divulgar nada, deixe `[]`: o layout do hero se ajusta sozinho, a
 * seção do mobile some e os links somem da navegação. A página promovida
 * continua acessível por URL direta de qualquer forma.
 */
export interface FeaturedPromo {
  /** Slug estável da campanha (chave na lista do destaque). */
  id: string;
  /** Rota interna da página promovida (ex.: `/colonia-de-ferias`). */
  path: string;
  /** Item que entra na navegação. */
  nav: {
    label: string;
  };
  /** Card com foto do destaque (hero no desktop, seção própria no mobile). */
  hero: {
    /** Rótulo do selo acima do card. */
    badge: string;
    /**
     * Imagem do card no desktop, em retrato 4:5 (ex.: 900×1125). Caminho
     * dentro de `public/`, passa por `asset()` na hora de renderizar.
     */
    image: string;
    /**
     * Imagem do card na seção do mobile, quadrada 1:1 (ex.: 900×900). Toda
     * campanha precisa das duas: a arte em retrato não cabe bem no quadrado.
     */
    imageMobile: string;
    /** `alt` da imagem: descreve a campanha, com cidade. */
    imageAlt: string;
  };
  /**
   * Contexto em texto, só na seção do mobile (no desktop o card fica ao lado
   * do hero e não sobra espaço). Curto: um título e uma ou duas frases.
   */
  summary: {
    title: string;
    text: string;
    /** Texto do link para a página da campanha (ex.: "Conhecer o espaço"). */
    cta: string;
  };
}

/** Colônia de Férias de inverno (edição 2026). */
export const COLONIA_INVERNO_2026: FeaturedPromo = {
  id: 'colonia-inverno-2026',
  path: '/colonia-de-ferias',
  nav: {label: 'Colônia de Férias'},
  hero: {
    badge: 'Em destaque',
    image: '/images/colonia/poster-hero.jpg',
    imageMobile: '/images/colonia/poster-hero-mobile.webp',
    imageAlt: 'Colônia de Férias de Inverno 2026, Desenhe, Curitiba',
  },
  summary: {
    title: 'Colônia de Férias de Inverno',
    text: 'Uma semana de desenho, guache, lápis de cor e colagem para crianças de 6 a 12 anos, com materiais e lanche inclusos.',
    cta: 'Ver datas e valores',
  },
};

/** Coworking artístico: aluguel de ateliê por hora. */
export const COWORKING_PROMO: FeaturedPromo = {
  id: 'coworking-2026',
  path: '/coworking-artistico',
  nav: {label: 'Coworking'},
  hero: {
    badge: 'Novidade',
    image: '/images/espaco/coworking-featured.webp',
    imageMobile: '/images/espaco/coworking-featured-mobile.webp',
    imageAlt: 'Coworking artístico da Desenhe, Curitiba',
  },
  summary: {
    title: 'Coworking artístico',
    text: 'Alugue por hora um ateliê equipado, com cavaletes, mesas de desenho e luz natural. Alunos matriculados pagam menos.',
    cta: 'Conhecer o espaço',
  },
};

/** In Company: oficinas, palestras e ações de arte para empresas. */
export const IN_COMPANY_PROMO: FeaturedPromo = {
  id: 'in-company-2026',
  path: '/in-company',
  nav: {label: 'In Company'},
  hero: {
    badge: 'Para empresas',
    image: '/images/in-company/in-company-featured.webp',
    imageMobile: '/images/in-company/in-company-featured-mobile.webp',
    imageAlt: 'Desenhe In Company: oficinas de arte para empresas em Curitiba',
  },
  summary: {
    title: 'In Company',
    text: 'Palestras, oficinas e ações de arte para equipes e eventos corporativos, conduzidas por professores da Desenhe. Peça uma proposta.',
    cta: 'Conhecer os formatos',
  },
};

/**
 * Campanhas em cartaz agora, na ordem em que giram no destaque, ou `[]` para
 * não divulgar nenhuma. Ex.: `[IN_COMPANY_PROMO, COWORKING_PROMO]`.
 */
export const FEATURED_PROMOS: FeaturedPromo[] = [IN_COMPANY_PROMO, COWORKING_PROMO];

/** Tempo que cada campanha fica no destaque antes de passar para a próxima. */
export const PROMO_ROTATION_MS = 6000;
