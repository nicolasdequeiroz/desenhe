/**
 * Conteúdo dos cursos, extraído do site atual (desenhe.com.br) em jul/2026.
 * A copy foi mantida fiel ao original, com ajustes leves de redação.
 */

export interface CourseModule {
  /** "Módulo N": rótulo de ordem, exibido como o marco na linha do tempo da página do curso. */
  title: string;
  /** Título curto do módulo, exibido ao lado do rótulo. */
  heading: string;
  description: string;
}

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
  classLength: string;
  totalHours?: string;
  enrollment: string;
  requiresDrawing?: boolean;
  modules: CourseModule[];
  /** Chave da tabela de preços correspondente (ver pricing.ts). */
  pricingTier: 'desenho-2h' | 'oleo-3h' | 'consultar';
  cover: string;
  gallery: string[];
  galleryCaption?: string;
}

export const COURSES: Course[] = [
  {
    slug: 'desenho-artistico',
    tagline: 'O primeiro traço de uma técnica que dura a vida toda.',
    title: 'Desenho Artístico',
    category: 'desenho',
    shortTitle: 'Desenho Artístico',
    excerpt:
      'Os fundamentos do desenho: formas bidimensionais e tridimensionais, sombreamento, composição, perspectiva e teoria das cores.',
    description: [
      'O curso aborda os fundamentos do desenho, permitindo que os alunos estudem formas bidimensionais e tridimensionais, com foco em sombreamento, composição e técnicas como perspectiva, desenho de observação e teoria das cores.',
      'Ao longo das aulas práticas são explorados materiais como grafite, nanquim, sanguíneo, sépia, lápis branco 6B, giz pastel seco e lápis de cor.',
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
          'O aluno constrói as bases do desenho observando formas bidimensionais e tridimensionais, com exercícios de cor, luz e sombra que treinam o olhar antes da técnica.',
      },
      {
        title: 'Módulo 2',
        heading: 'Perspectiva e composição',
        description:
          'Múltiplos pontos de fuga entram em cena para dar profundidade ao desenho, ao lado dos princípios de composição que organizam o que vai para o papel.',
      },
      {
        title: 'Módulo 3',
        heading: 'Cor e técnica',
        description:
          'Os estudos de cor se aprofundam em técnicas secas e úmidas, ampliando o repertório de materiais e texturas que o aluno passa a dominar.',
      },
      {
        title: 'Módulo 4',
        heading: 'Produção autoral',
        description:
          'Com a base consolidada, o foco passa para o desenvolvimento de um trabalho autoral, com acompanhamento próximo para aprofundar a técnica de cada aluno.',
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
      'Os alunos aprendem a construção de personagens seguindo as estéticas características do universo dos quadrinhos, partindo de formas básicas até chegar em trabalhos finalizados, explorando movimentos e aperfeiçoando o uso da luz e da sombra nas narrativas visuais.',
    ],
    audience: 'Todas as idades',
    ageBadge: 'Todas as idades',
    classLength: '2 horas por aula',
    totalHours: '144 horas, aproximadamente 18 meses',
    enrollment: 'Curso presencial: matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Primeiros traços',
        description:
          'Apresentação dos materiais (grafite, lápis de cor, giz de cera) e introdução à escala tonal, luz e sombra: a base técnica antes de partir para os personagens.',
      },
      {
        title: 'Módulo 2',
        heading: 'Materiais e volume',
        description:
          'Aprofundamento em materiais como lápis de cor aquareláveis, com foco em figuras com volume e nas primeiras experimentações com guache.',
      },
      {
        title: 'Módulo 3',
        heading: 'Efeito e textura',
        description:
          'Tintas e pastéis entram no processo para o refinamento de sombras e luz com efeito realista, ao lado de proporção, composição e texturas mais elaboradas.',
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
    slug: 'pintura-a-oleo-ou-acrilica',
    tagline: 'Da tinta pura à composição que carrega um olhar.',
    title: 'Pintura a Óleo e Acrílica',
    category: 'pintura',
    shortTitle: 'Óleo e Acrílica',
    excerpt:
      'Da teoria das cores à pintura em camadas e velaturas, em papel, madeira e tela.',
    description: [
      'No curso, os alunos exploram a pintura com tinta a óleo ou acrílica, iniciando pela teoria das cores e composição com paletas restritas. Experimentam diferentes superfícies (papel, madeira, tela) e conhecem os materiais e ferramentas essenciais.',
      'A metodologia valoriza a progressão natural do desenho para a pintura: é recomendada base prévia em desenho para conceitos como perspectiva e luz e sombra.',
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
      'No curso de pintura a base d’água, os alunos ampliam os estudos em teoria da cor através da experimentação de técnicas com tintas, com uma visão geral dos gêneros tradicionais da pintura e repertório de História da Arte.',
      'Há espaço para o desenvolvimento de trabalhos autorais através da experimentação de técnicas mistas, de acordo com o gosto estético de cada aluno.',
    ],
    audience: 'Adultos, adolescentes e crianças a partir de 9 anos',
    ageBadge: 'A partir de 9 anos',
    classLength: '2 horas por aula',
    totalHours: 'Conteúdo programado para 112 horas de aula',
    enrollment: 'Curso presencial: matrículas abertas o ano todo',
    requiresDrawing: true,
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
      'Habilidades manuais e percepção espacial para crianças a partir dos 6 anos, com muita experimentação de materiais.',
    description: [
      'No Curso de Desenho Infantil são desenvolvidas as habilidades manuais e de percepção espacial das crianças, com base em experimentações de materiais, estudos iniciais de ponto, linha e forma, estudos de cores e composição.',
      'O curso acompanha o nível e o ritmo de cada aluno, seja iniciante ou avançado, com registro contínuo do progresso individual.',
    ],
    audience: 'Crianças a partir dos 6 anos',
    ageBadge: 'A partir de 6 anos',
    classLength: '2 horas por aula',
    enrollment: 'Matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Primeiro contato',
        description:
          'Apresentação de materiais (grafite, lápis de cor, giz de cera), com os primeiros exercícios de escala tonal, luz e sombra, no ritmo de cada criança.',
      },
      {
        title: 'Módulo 2',
        heading: 'Volume e cor',
        description:
          'Aprofundamento de materiais com lápis de cor aquareláveis, explorando volume e perspectiva, com introdução à tinta guache.',
      },
      {
        title: 'Módulo 3',
        heading: 'Realismo e textura',
        description:
          'Ampliação com tintas e pastéis, trabalhando sombras e luz para efeito mais realista, proporção, composição e texturas.',
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
      'O curso convida a repensar a História da Arte para além de narrativas eurocentradas e lineares, compreendendo a arte como um campo dinâmico de trocas, circulações e disputas entre culturas.',
      'Percorre da Antiguidade à contemporaneidade em três módulos, explorando conexões entre sociedades e a circulação de ideias, concluindo com reflexões sobre inteligência artificial na produção artística.',
      'As aulas são expositivas e dialogadas, com estudos de caso, dinâmicas interativas e atividades individuais e em grupo que estimulam o pensamento crítico.',
    ],
    audience:
      'Profissionais criativos, estudantes, pesquisadores, guias e mediadores culturais, público 50+ e apaixonados por museus e cultura',
    ageBadge: 'Adultos e jovens',
    classLength: '2h30 por encontro semanal',
    totalHours: '90 horas (30h por módulo), 9 meses',
    enrollment: 'Curso teórico presencial, turmas a partir de abril de 2026',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Antiguidade e mundos conectados',
        description:
          'A arte é estudada como um campo de trocas entre culturas desde a Antiguidade, rompendo com a ideia de uma história linear e centrada na Europa.',
      },
      {
        title: 'Módulo 2',
        heading: 'Circulações e disputas',
        description:
          'O módulo percorre as conexões entre sociedades e a circulação de ideias e imagens, mostrando como a arte se transforma no contato entre culturas diferentes.',
      },
      {
        title: 'Módulo 3',
        heading: 'Contemporaneidade',
        description:
          'Da arte moderna às reflexões sobre inteligência artificial na produção artística, fechando o curso com os debates mais atuais do campo.',
      },
    ],
    pricingTier: 'consultar',
    cover: '/images/cursos/historia-da-arte/galeria-1.webp',
    gallery: [
      '/images/cursos/historia-da-arte/galeria-2.webp',
      '/images/cursos/historia-da-arte/galeria-3.webp',
    ],
  },
];

export function getCourse(slug: string): Course {
  const course = COURSES.find((c) => c.slug === slug);
  if (!course) throw new Error(`Curso não encontrado: ${slug}`);
  return course;
}
