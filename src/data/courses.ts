/**
 * Conteúdo dos cursos, baseado na descrição geral dos cursos 2026 da escola.
 * A copy foi mantida fiel ao original, com ajustes leves de redação.
 */

export interface CourseModule {
  /** "Módulo N": rótulo de ordem, exibido como o marco na linha do tempo da página do curso. */
  title: string;
  /** Título curto do módulo, exibido ao lado do rótulo. */
  heading: string;
  description: string;
}

export interface GalleryCredit {
  /** Nome do autor do trabalho, como deve aparecer na legenda estilo polaroid. */
  author: string;
  /** Ano do trabalho, ex.: '2025'. */
  year: string;
}

/**
 * Texto usado enquanto uma imagem não tem crédito cadastrado em
 * `galleryCredits`. Fica aqui, e não nos componentes, para a parede de
 * trabalhos e o visor em tela cheia nunca divergirem.
 */
export const UNCREDITED_AUTHOR = 'Aluno(a) da Desenhe';

export type CourseCategory = 'desenho' | 'pintura' | 'institucional';

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  desenho: 'Desenho',
  pintura: 'Pintura',
  institucional: 'Curso teórico',
};

export interface Course {
  slug: string;
  title: string;
  /** Título curto para cards e navegação. */
  shortTitle: string;
  /** Subtítulo pequeno exibido ao lado do título no carrossel de cursos em destaque da home. */
  featuredSubtitle?: string;
  /** Categoria usada para colorir badges/tags nos cards e na página do curso. */
  category: CourseCategory;
  /**
   * Chamada de efeito exibida como título grande na primeira dobra da página
   * do curso (o nome do curso vira o eyebrow ali). Máximo 2 linhas.
   */
  tagline: string;
  excerpt: string;
  description: string[];
  audience: string;
  /** Texto curto de faixa etária para badges em cards. */
  ageBadge: string;
  classLength?: string;
  totalHours?: string;
  enrollment: string;
  requiresDrawing?: boolean;
  modules: CourseModule[];
  /** Chave da tabela de preços correspondente (ver pricing.ts). */
  pricingTier: 'desenho-2h' | 'oleo-3h' | 'consultar';
  /**
   * Texto de mensalidade para cursos fora da tabela padrão
   * (pricingTier: 'consultar'), exibido no lugar do valor calculado.
   */
  priceNotes?: string[];
  /** Opcional: cursos novos podem entrar no ar antes das fotos. */
  cover?: string;
  gallery: string[];
  galleryCaption?: string;
  /**
   * Crédito de cada imagem de `gallery`, no mesmo índice: autor e ano do
   * trabalho, exibidos na legenda estilo polaroid da parede de trabalhos
   * (ver CourseGallery.tsx). Índice sem entrada aqui cai no texto genérico.
   */
  galleryCredits?: GalleryCredit[];
}

export const COURSES: Course[] = [
  {
    slug: 'desenho-artistico',
    tagline: 'O primeiro traço de uma técnica que dura a vida toda.',
    title: 'Desenho Artístico',
    category: 'desenho',
    shortTitle: 'Desenho Artístico',
    excerpt:
      'Os fundamentos do desenho: formas bidimensionais e tridimensionais, escala tonal, textura, perspectiva, estudos da cor, sombreamento e composição.',
    description: [
      'O curso aborda os principais fundamentos do desenho: o aluno estuda formas bidimensionais e tridimensionais e chega a níveis avançados de sombreamento e composição, experimentando técnicas como estudos de perspectiva, desenho de observação e ensino das cores.',
      'Ao longo das aulas práticas são explorados materiais variados, que garantem uma experiência rica: grafite, nanquim, sanguínea, sépia, lápis branco 6B, giz pastel seco e lápis de cor.',
      'O conteúdo pode ser personalizado de acordo com os objetivos de cada aluno, com espaço para temas específicos como figura humana, retrato ou desenho arquitetônico. O foco é o resultado: a cada etapa concluída pelo aluno, o professor avança para o próximo passo.',
      'É também a base sólida para quem quer seguir adiante, seja na criação de obras autorais, seja no aprofundamento em áreas relacionadas, como as técnicas de pintura.',
    ],
    audience: 'Adultos, adolescentes e crianças a partir dos 9 anos',
    ageBadge: 'A partir de 9 anos',
    classLength: '2 horas por aula',
    totalHours: 'Conteúdo programado para 144 horas de aula',
    enrollment: 'Curso presencial: matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Fundamentos da forma',
        description:
          'O aluno constrói as bases do desenho observando formas bidimensionais e tridimensionais, com os primeiros estudos de escala tonal, luz e sombra que treinam o olhar antes da técnica.',
      },
      {
        title: 'Módulo 2',
        heading: 'Textura e perspectiva',
        description:
          'O estudo das texturas se junta aos múltiplos pontos de fuga, que dão profundidade ao desenho, ao lado dos princípios de composição que organizam o que vai para o papel.',
      },
      {
        title: 'Módulo 3',
        heading: 'Estudos da cor',
        description:
          'Os estudos de cor se aprofundam em técnicas secas e úmidas, ampliando o repertório de materiais que o aluno passa a dominar.',
      },
      {
        title: 'Módulo 4',
        heading: 'Sombreamento avançado e autoral',
        description:
          'Com a base consolidada, o aluno chega aos níveis avançados de sombreamento e composição e passa a desenvolver trabalhos autorais, com acompanhamento próximo.',
      },
    ],
    pricingTier: 'desenho-2h',
    cover: '/images/cursos/desenho-artistico/capa.webp',
    gallery: [
      '/images/cursos/desenho-artistico/galeria-1.webp',
      '/images/cursos/desenho-artistico/galeria-2.webp',
      '/images/cursos/desenho-artistico/galeria-3.webp',
      '/images/cursos/desenho-artistico/galeria-4.webp',
      '/images/cursos/desenho-artistico/galeria-5.webp',
    ],
    galleryCaption: 'Trabalhos de alunos do curso de Desenho Artístico',
  },
  {
    slug: 'quadrinhos-hq-manga-cartoon',
    tagline: 'Personagens e histórias que nascem na ponta do seu lápis.',
    title: 'Quadrinhos - HQ | Mangá | Cartoon',
    category: 'desenho',
    shortTitle: 'Quadrinhos',
    featuredSubtitle: 'HQ, Mangá e Cartoon',
    excerpt:
      'Construção de personagens, cenários e narrativas visuais seguindo as estéticas do universo dos quadrinhos.',
    description: [
      'O objetivo do curso é desenvolver histórias em quadrinhos, personagens (character design), cenários e cenas, narrativas textuais e visuais.',
      'Os alunos aprendem a construção de personagens seguindo as estéticas características do universo dos quadrinhos, partindo de formas básicas até chegar em trabalhos finalizados.',
      'A partir daí, tornam-se capazes de construir cenários, desenvolver histórias e criar situações de interação entre personagens, explorando movimentos e aperfeiçoando o uso da luz e da sombra nas narrativas visuais.',
    ],
    audience: 'Todas as idades',
    ageBadge: 'Todas as idades',
    classLength: '2 horas por aula',
    totalHours: '144 horas, aproximadamente 18 meses',
    enrollment: 'Curso presencial: matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Construção de personagens',
        description:
          'Das formas básicas ao character design: proporção, expressões e as estéticas características do mangá, da HQ e do cartoon.',
      },
      {
        title: 'Módulo 2',
        heading: 'Cenários e composição',
        description:
          'A perspectiva aplicada aos cenários, ao enquadramento e à composição do quadro, para situar os personagens no espaço da página.',
      },
      {
        title: 'Módulo 3',
        heading: 'Narrativa e finalização',
        description:
          'Movimento, interação entre personagens e uso da luz e da sombra na narrativa visual, até chegar aos trabalhos finalizados.',
      },
    ],
    pricingTier: 'desenho-2h',
    cover: '/images/cursos/quadrinhos/capa.webp',
    gallery: [
      '/images/cursos/quadrinhos/galeria-1.webp',
      '/images/cursos/quadrinhos/galeria-2.webp',
      '/images/cursos/quadrinhos/galeria-3.webp',
      '/images/cursos/quadrinhos/galeria-4.webp',
    ],
    galleryCaption: 'Trabalhos de alunos do curso de Quadrinhos',
  },
  {
    slug: 'desenho-de-moda',
    tagline: 'Da primeira referência ao book de coleção assinado por você.',
    title: 'Desenho de Moda',
    category: 'desenho',
    shortTitle: 'Desenho de Moda',
    excerpt:
      'Croquis de moda funcionais e toda a metodologia de desenvolvimento de coleção da indústria da moda, até o book final.',
    description: [
      'No Curso de Desenho de Moda, você aprende a desenvolver croquis de moda funcionais, passando por toda a metodologia de desenvolvimento de coleção da indústria da moda.',
      'Ao longo do curso você desenvolve painéis de tendências, inspiração, público-alvo, estampas e materiais, e entende o conceito de mix de produtos no desenvolvimento de uma coleção.',
      'Você aprende a desenhar croquis de vários formatos, com vários biotipos e gêneros, e a tirar da cabeça as ideias de peças de vestuário que deseja, através do uso de referências e da criação autoral.',
      'Ao final, desenvolve uma coleção de moda tendo como produto um book de coleção com croquis e desenhos planificados.',
    ],
    audience: 'Adultos e adolescentes',
    ageBadge: 'Adultos e adolescentes',
    enrollment: 'Curso presencial: consulte as próximas turmas',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Pesquisa e conceito',
        description:
          'Painéis de tendências, inspiração, público-alvo, estampas e materiais: a pesquisa que antecede qualquer coleção de moda.',
      },
      {
        title: 'Módulo 2',
        heading: 'Croqui e biotipos',
        description:
          'Desenho de croquis em vários formatos, com diferentes biotipos e gêneros, até que o croqui vire uma ferramenta funcional de projeto.',
      },
      {
        title: 'Módulo 3',
        heading: 'Criação autoral e planificação',
        description:
          'Do uso de referências à criação das próprias peças, com o desenho planificado que traduz a ideia para quem vai produzir.',
      },
      {
        title: 'Módulo 4',
        heading: 'Book de coleção',
        description:
          'Mix de produtos e fechamento da coleção, reunida em um book com croquis e desenhos planificados.',
      },
    ],
    pricingTier: 'consultar',
    priceNotes: ['Valores e condições sob consulta'],
    gallery: [],
  },
  {
    slug: 'pintura-a-oleo-ou-acrilica',
    tagline: 'Da tinta pura à composição que carrega um olhar.',
    title: 'Pintura a Óleo e Acrílica',
    category: 'pintura',
    shortTitle: 'Óleo e Acrílica',
    excerpt:
      'Da teoria das cores à pintura em camadas e velaturas, em papel, cartão, madeira e tela.',
    description: [
      'No curso, os alunos aprofundam os estudos em teoria da cor, com base no uso de paletas restritas e na experimentação de técnicas com tinta a óleo e acrílica.',
      'Você amplia o conhecimento sobre suportes como papel, cartão, madeira e tela, além dos materiais e das ferramentas de quem se dedica à pintura.',
      'O curso traz uma visão geral dos gêneros tradicionais da pintura, com o objetivo de aumentar o seu repertório sobre a História da Arte, e abre espaço para o desenvolvimento de trabalhos autorais de acordo com o gosto estético de cada aluno.',
      'A metodologia da escola valoriza a progressão natural do desenho para a pintura: é necessária uma base em desenho, que oferece fundamentos essenciais como perspectiva e luz e sombra. Quem ainda não tem esses conhecimentos pode começar pelas aulas de desenho e migrar depois para a pintura.',
    ],
    audience: 'Adultos e adolescentes a partir de 13 anos',
    ageBadge: 'A partir de 13 anos',
    classLength: '3 horas por aula',
    totalHours: 'Conteúdo programado para 120 horas de aula',
    enrollment: 'Curso presencial: matrículas abertas o ano todo',
    requiresDrawing: true,
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Cores e materiais',
        description:
          'Introdução às cores e aos materiais da pintura, com as primeiras experimentações em tinta a óleo ou acrílica, grafite e carvão.',
      },
      {
        title: 'Módulo 2',
        heading: 'Superfícies e texturas',
        description:
          'Estudos em carvão e em diferentes superfícies aprofundam a exploração de texturas com tinta a óleo ou acrílica.',
      },
      {
        title: 'Módulo 3',
        heading: 'Camadas e profundidade',
        description:
          'A pintura em camadas e velaturas entra em cena, combinando técnicas mistas para desenvolver profundidade e volume nas telas.',
      },
      {
        title: 'Módulo 4',
        heading: 'Projeto autoral',
        description:
          'Acompanhamento personalizado para projetos autorais, sem prazo pré-definido, para o aluno amadurecer o próprio estilo.',
      },
    ],
    pricingTier: 'oleo-3h',
    cover: '/images/cursos/pintura-oleo-acrilica/capa.webp',
    gallery: [
      '/images/cursos/pintura-oleo-acrilica/galeria-1.webp',
      '/images/cursos/pintura-oleo-acrilica/galeria-2.webp',
      '/images/cursos/pintura-oleo-acrilica/galeria-3.webp',
      '/images/cursos/pintura-oleo-acrilica/galeria-4.webp',
      '/images/cursos/pintura-oleo-acrilica/galeria-5.webp',
    ],
    galleryCaption: 'Trabalhos de alunos do curso de Pintura',
  },
  {
    slug: 'pintura-em-aquarela-ou-guache',
    tagline: 'Transparências e camadas até a cor virar seu jeito de ver.',
    title: 'Pintura Aquarela ou Guache',
    category: 'pintura',
    shortTitle: 'Aquarela ou Guache',
    excerpt:
      'Transparências, sobreposições e gradientes na aquarela; camadas densas e acabamentos suaves no guache.',
    description: [
      'O curso de técnicas à base d’água é a oportunidade de aprofundar os conhecimentos em teoria da cor por meio da experimentação com aquarela ou guache.',
      'Na aquarela, o aluno aprende diferentes formas de diluição, explorando transparências, sobreposições e gradientes delicados, que proporcionam efeitos etéreos e dinâmicos.',
      'No guache, trabalha a versatilidade de uma tinta opaca, com diluições que variam de camadas densas a acabamentos suaves, ideais para criar composições vibrantes e de forte impacto visual.',
      'É um curso voltado para quem deseja explorar a versatilidade das tintas à base d’água, expandindo as próprias possibilidades criativas e técnicas no universo artístico.',
    ],
    audience: 'Adultos, adolescentes e crianças a partir de 9 anos',
    ageBadge: 'A partir de 9 anos',
    classLength: '2 horas por aula',
    totalHours: 'Conteúdo programado para 112 horas de aula',
    enrollment: 'Curso presencial: matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Círculo cromático',
        description:
          'Introdução às cores e aos materiais: círculo cromático, isocromia, monocromia, policromia e harmonia das cores como base para toda a pintura.',
      },
      {
        title: 'Módulo 2',
        heading: 'Texturas e diluição',
        description:
          'Estudos de superfícies e diluição, com experimentação de texturas, máscaras e técnicas de aguada, ampliando o controle sobre a água e a tinta.',
      },
      {
        title: 'Módulo 3',
        heading: 'Técnica mista',
        description:
          'Técnica mista combinando aquarela ou guache com grafite, nanquim e texturas, para composições mais ricas e pessoais.',
      },
      {
        title: 'Módulo 4',
        heading: 'Projeto autoral',
        description:
          'Acompanhamento personalizado para projetos autorais, sem prazo pré-definido, para o aluno amadurecer o próprio estilo.',
      },
    ],
    pricingTier: 'desenho-2h',
    cover: '/images/cursos/aquarela-guache/capa.webp',
    gallery: [
      '/images/cursos/aquarela-guache/galeria-1.webp',
      '/images/cursos/aquarela-guache/galeria-2.webp',
      '/images/cursos/aquarela-guache/galeria-3.webp',
      '/images/cursos/aquarela-guache/galeria-4.webp',
      '/images/cursos/aquarela-guache/galeria-5.webp',
    ],
    galleryCaption: 'Trabalhos de alunos do curso de Aquarela e Guache',
  },
  {
    slug: 'desenho-infantil',
    tagline: 'Mãos pequenas, primeiros traços, uma vida inteira desenhando.',
    title: 'Desenho Infantil',
    category: 'desenho',
    shortTitle: 'Desenho Infantil',
    excerpt:
      'Habilidades manuais e percepção espacial para crianças a partir dos 6 anos, com muita experimentação de materiais e um portfólio construído de forma lúdica.',
    description: [
      'No Curso de Desenho Infantil são desenvolvidas as habilidades manuais e de percepção espacial das crianças, com base em experimentações de materiais, estudos iniciais de ponto, linha e forma, estudos de cores e composição.',
      'O curso é pensado para que a criança possa se expressar livremente, e cada módulo oferece a possibilidade de construir, de forma lúdica, um pequeno portfólio de desenho.',
      'As aulas acompanham o nível e o ritmo de cada criança, seja iniciante ou avançada, com registro contínuo do progresso individual.',
    ],
    audience: 'Crianças a partir dos 6 anos',
    ageBadge: 'A partir de 6 anos',
    classLength: '2 horas por aula',
    enrollment: 'Matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Livro pop-up',
        description:
          'Ponto, linha, forma e as primeiras experimentações de materiais se transformam em um livro de ilustrações em pop-up, com narrativa não textual.',
      },
      {
        title: 'Módulo 2',
        heading: 'Jogo de tabuleiro',
        description:
          'Os estudos de cor e composição ganham um destino: um jogo de tabuleiro ilustrado pela criança, com narrativa visual e textual.',
      },
      {
        title: 'Módulo 3',
        heading: 'Portfólio de desenho',
        description:
          'A criança passa a explorar uma diversidade de técnicas e, ao final do curso, reúne os trabalhos na montagem do seu portfólio de desenho.',
      },
    ],
    pricingTier: 'desenho-2h',
    cover: '/images/cursos/desenho-infantil/capa.webp',
    gallery: [
      '/images/cursos/desenho-infantil/galeria-1.webp',
      '/images/cursos/desenho-infantil/galeria-2.webp',
      '/images/cursos/desenho-infantil/galeria-3.webp',
      '/images/cursos/desenho-infantil/galeria-4.webp',
      '/images/cursos/desenho-infantil/galeria-5.webp',
    ],
    galleryCaption: 'Atividades e trabalhos das turmas infantis',
  },
  {
    slug: 'historia-da-arte',
    tagline: 'A arte contada além do que sempre te disseram sobre ela.',
    title: 'Para Além do Cânone: uma história conectada da arte',
    category: 'institucional',
    shortTitle: 'História da Arte',
    excerpt:
      'Um curso teórico que repensa a História da Arte para além de narrativas eurocentradas, da Antiguidade à contemporaneidade.',
    description: [
      'O curso revisa criticamente as narrativas eurocentradas da História da Arte a partir da História Global e da História Conectada, compreendendo a arte como um campo dinâmico de trocas, circulações e disputas entre culturas.',
      'Ao longo de três módulos, investiga as circulações culturais entre diferentes sociedades e discute como ferramentas como a inteligência artificial ampliam novas formas de produzir e analisar a arte.',
      'As aulas são expositivas e dialogadas, com estudos de caso, dinâmicas interativas e atividades individuais e em grupo que estimulam o pensamento crítico. Uma oportunidade de ampliar o repertório cultural e enxergar a arte com um novo olhar.',
    ],
    audience:
      'Profissionais criativos, estudantes, pesquisadores, guias e mediadores culturais, público 50+ e apaixonados por museus e cultura',
    ageBadge: 'Adultos e jovens',
    classLength: '2h30 por encontro semanal',
    totalHours: '90 horas (30h por módulo), 9 meses',
    enrollment: 'Curso teórico presencial: consulte as próximas turmas',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Da Antiguidade ao Renascimento',
        description:
          'A arte é estudada como um campo de trocas entre culturas desde a Antiguidade, rompendo com a ideia de uma história linear e centrada na Europa.',
      },
      {
        title: 'Módulo 2',
        heading: 'Do Renascimento ao Neoclássico',
        description:
          'O módulo percorre as conexões entre sociedades e a circulação de ideias e imagens, mostrando como a arte se transforma no contato entre culturas diferentes.',
      },
      {
        title: 'Módulo 3',
        heading: 'Do Neoclássico à inteligência artificial',
        description:
          'Da arte moderna às reflexões sobre inteligência artificial na produção artística, fechando o curso com os debates mais atuais do campo.',
      },
    ],
    pricingTier: 'consultar',
    priceNotes: [
      'R$ 460 por mês, à vista ou parcelado',
      'Taxa de matrícula de R$ 120',
    ],
    cover: '/images/cursos/historia-da-arte/galeria-1.webp',
    gallery: [
      '/images/cursos/historia-da-arte/galeria-2.webp',
      '/images/cursos/historia-da-arte/galeria-3.webp',
    ],
    galleryCaption: 'Encontros do curso de História da Arte',
  },
];

export function getCourse(slug: string): Course {
  const course = COURSES.find((c) => c.slug === slug);
  if (!course) throw new Error(`Curso não encontrado: ${slug}`);
  return course;
}
