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
/**
 * Evento divulgado no destaque sem página própria: o card abre um pop-up
 * com estes dados (ver PromoEventModal), em vez de levar a uma rota.
 */
export interface PromoEvent {
  /** Rótulo acima do título, ex.: "Exposição colaborativa de fim de ano". */
  kicker: string;
  title: string;
  subtitle?: string;
  /** Texto de apresentação, um parágrafo por item. */
  paragraphs: string[];
  /** Ficha do evento: rótulo e resposta ("Quando", "Onde", "Entrada"). */
  facts: {label: string; value: string}[];
  /** Mensagem pré-preenchida do botão de WhatsApp do pop-up. */
  whatsappMessage: string;
}

export interface FeaturedPromo {
  /** Slug estável da campanha (chave na lista do destaque). */
  id: string;
  /**
   * Rota interna da página promovida (ex.: `/colonia-de-ferias`). Campanha
   * sem página própria deixa vazio e preenche `event`: o card abre um pop-up.
   */
  path?: string;
  /** Dados do pop-up, para campanha sem página própria. */
  event?: PromoEvent;
  /**
   * Mostra o selo animado da exposição de fim de ano (ExpoSeal) no canto do
   * card e do pop-up. Só para a exposição: o selo é dela.
   */
  seal?: boolean;
  /**
   * Último dia (AAAA-MM-DD) em que a campanha aparece. Depois disso ela sai
   * do destaque sozinha no build seguinte (o deploy roda todo dia às 6h05).
   */
  until?: string;
  /** Rótulo da campanha: nos pontos do carrossel e, se tiver página, na navegação. */
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
    badge: 'Novidade',
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

/** Exposição colaborativa de fim de ano (2026): evento, abre um pop-up. */
export const EXPOSICAO_FIM_DE_ANO_2026: FeaturedPromo = {
  id: 'exposicao-fim-de-ano-2026',
  until: '2026-11-28',
  seal: true,
  nav: {label: 'Exposição de fim de ano'},
  hero: {
    badge: 'Exposição',
    image: '/images/exposicao/exposicao-fim-de-ano-featured.webp',
    imageMobile: '/images/exposicao/exposicao-fim-de-ano-featured-mobile.webp',
    imageAlt:
      'Exposição colaborativa de fim de ano da Desenhe, em Curitiba: Ponto, linha, plano, as vistas da cidade e seus habitantes',
  },
  summary: {
    title: 'Exposição de fim de ano',
    text: 'Ponto, linha, plano: Curitiba e quem vive nela nos desenhos dos alunos. Sábado, 28/11, a partir das 16h30, aberta ao público.',
    cta: 'Ver detalhes',
  },
  event: {
    kicker: 'Exposição colaborativa de fim de ano',
    title: 'Ponto, linha, plano',
    subtitle: 'As vistas da cidade e seus habitantes',
    paragraphs: [
      'Antes de desenhar a cidade, todo mundo aqui desenhou um ponto. Quando esse ponto se move, vira linha. Quando as linhas se encontram, nasce um plano. A ideia vem de Ponto e linha sobre plano, livro de Kandinsky, é a base de como ensinamos desenho na Desenhe e, neste fim de ano, virou exposição.',
      'Tem Curitiba nos pontos de ônibus, nos fios cruzando o céu e nas fachadas que a gente vê todo dia e nunca repara. E tem quem vive nela: uma parte da exposição é dedicada aos rostos, gente que cruzou o caminho dos nossos alunos e acabou no papel.',
      'São trabalhos feitos ao longo do ano por quem decidiu parar e aprender a olhar. Venha ver e fechar o ano com a gente.',
    ],
    facts: [
      {label: 'Quando', value: 'Sábado, 28 de novembro, a partir das 16h30'},
      {label: 'Onde', value: 'Desenhe, Rua Padre Anchieta, 265A, Mercês, Curitiba'},
      {label: 'Entrada', value: 'Aberta ao público'},
    ],
    whatsappMessage:
      'Olá! Vi no site a exposição Ponto, linha, plano, no dia 28/11, e gostaria de saber mais.',
  },
};

/** Data de hoje em Curitiba, para tirar do ar as campanhas vencidas. */
const TODAY = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo'}).format(new Date());

/**
 * Campanhas em cartaz agora, na ordem em que giram no destaque, ou `[]` para
 * não divulgar nenhuma. Ex.: `[IN_COMPANY_PROMO, COWORKING_PROMO]`. Uma
 * campanha com `until` vencido sai sozinha.
 */
export const FEATURED_PROMOS: FeaturedPromo[] = [
  EXPOSICAO_FIM_DE_ANO_2026,
  IN_COMPANY_PROMO,
  COWORKING_PROMO,
].filter((promo) => !promo.until || promo.until >= TODAY);

/** Tempo que cada campanha fica no destaque antes de passar para a próxima. */
export const PROMO_ROTATION_MS = 6000;
