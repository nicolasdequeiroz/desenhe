/**
 * Campanha em destaque no site (o "Em destaque" da home).
 *
 * Durante a vida do site esse espaço roda entre iniciativas diferentes:
 * Colônia de Férias de inverno, Colônia de verão, Coworking, etc. Em vez de
 * espalhar `if` por header e home, cada campanha é um objeto `FeaturedPromo`
 * e o site inteiro lê `FEATURED_PROMO`:
 *
 *  - `SiteHeader` acrescenta o link `nav.label -> path` na navegação (desktop
 *    e menu mobile), logo depois de "Professores".
 *  - `Home` mostra o card com foto ao lado do hero (desktop) e a faixa
 *    `PromoBar` no topo (mobile/tablet).
 *
 * Para trocar a campanha em cartaz, aponte `FEATURED_PROMO` para outro preset
 * (ou defina um novo). Para não divulgar nada, deixe `null`: o layout do hero
 * se ajusta sozinho e o link some da navegação. A página promovida continua
 * acessível por URL direta de qualquer forma.
 */
export interface FeaturedPromo {
  /**
   * Slug estável da campanha. Serve de chave para o "fechar" da faixa no
   * `sessionStorage`, então trocar de campanha faz a faixa reaparecer.
   */
  id: string;
  /** Rota interna da página promovida (ex.: `/colonia-de-ferias`). */
  path: string;
  /** Item que entra na navegação. */
  nav: {
    label: string;
  };
  /** Card com foto ao lado do hero, no desktop. */
  hero: {
    /** Rótulo do selo acima do card. */
    badge: string;
    /** Caminho da imagem (passa por `asset()` na hora de renderizar). */
    image: string;
    /** `alt` da imagem: descreve a campanha, com cidade. */
    imageAlt: string;
  };
  /** Faixa fina no topo, só no mobile/tablet (substitui o card com foto). */
  bar: {
    /** Texto do link da faixa (ex.: "Colônia de Férias 2026: saiba mais"). */
    text: string;
    /** `aria-label` do botão de fechar (ex.: "Fechar aviso da Colônia de Férias"). */
    closeLabel: string;
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
    imageAlt: 'Colônia de Férias de Inverno 2026, Desenhe, Curitiba',
  },
  bar: {
    text: 'Colônia de Férias 2026: saiba mais',
    closeLabel: 'Fechar aviso da Colônia de Férias',
  },
};

/** Coworking artístico: aluguel de ateliê por hora. */
export const COWORKING_PROMO: FeaturedPromo = {
  id: 'coworking-2026',
  path: '/coworking-artistico',
  nav: {label: 'Coworking'},
  hero: {
    badge: 'Novidade',
    image: '/images/espaco/sala-01-mesas.webp',
    imageAlt: 'Coworking artístico da Desenhe, Curitiba',
  },
  bar: {
    text: 'Coworking artístico: conheça o espaço',
    closeLabel: 'Fechar aviso do Coworking',
  },
};

/**
 * Campanha em cartaz agora, ou `null` para não divulgar nenhuma. Para trocar
 * de campanha, aponte para outro preset (ver `COLONIA_INVERNO_2026` acima).
 */
export const FEATURED_PROMO: FeaturedPromo | null = COWORKING_PROMO;
