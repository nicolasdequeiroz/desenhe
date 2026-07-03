/**
 * Conteúdo dos cursos, extraído do site atual (desenhe.com.br) em jul/2026.
 * A copy foi mantida fiel ao original, com ajustes leves de redação.
 */

export interface CourseModule {
  title: string;
  description: string;
}

export interface Course {
  slug: string;
  title: string;
  /** Título curto para cards e navegação. */
  shortTitle: string;
  excerpt: string;
  description: string[];
  audience: string;
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
    title: 'Desenho Artístico',
    shortTitle: 'Desenho Artístico',
    excerpt:
      'Os fundamentos do desenho: formas bidimensionais e tridimensionais, sombreamento, composição, perspectiva e teoria das cores.',
    description: [
      'O curso aborda os fundamentos do desenho, permitindo que os alunos estudem formas bidimensionais e tridimensionais, com foco em sombreamento, composição e técnicas como perspectiva, desenho de observação e teoria das cores.',
      'Ao longo das aulas práticas são explorados materiais como grafite, nanquim, sanguíneo, sépia, lápis branco 6B, giz pastel seco e lápis de cor.',
    ],
    audience: 'Adultos, adolescentes e crianças a partir dos 9 anos',
    classLength: '2 horas por aula',
    totalHours: 'Conteúdo programado para 144 horas de aula',
    enrollment: 'Presencial ou online ao vivo: matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        description:
          'Construção bidimensional e tridimensional, cores, luz e sombra.',
      },
      {
        title: 'Módulo 2',
        description: 'Perspectiva com múltiplos pontos de fuga e composição.',
      },
      {
        title: 'Módulo 3',
        description: 'Estudos de cor, técnicas secas e úmidas.',
      },
      {
        title: 'Módulo 4',
        description: 'Produção autoral e aprofundamento técnico.',
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
    title: 'Quadrinhos — HQ | Mangá | Cartoon',
    shortTitle: 'Quadrinhos',
    excerpt:
      'Construção de personagens, cenários e narrativas visuais seguindo as estéticas do universo dos quadrinhos.',
    description: [
      'O objetivo do curso é desenvolver histórias em quadrinhos, personagens (character design), cenários e cenas, narrativas textuais e visuais.',
      'Os alunos aprendem a construção de personagens seguindo as estéticas características do universo dos quadrinhos, partindo de formas básicas até chegar em trabalhos finalizados — explorando movimentos e aperfeiçoando o uso da luz e da sombra nas narrativas visuais.',
    ],
    audience: 'Todas as idades',
    classLength: '2 horas por aula',
    totalHours: '144 horas — aproximadamente 18 meses',
    enrollment: 'Presencial e online: matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        description:
          'Apresentação de materiais (grafite, lápis de cor, giz de cera); introdução a escala tonal e luz e sombra.',
      },
      {
        title: 'Módulo 2',
        description:
          'Aprofundamento em materiais; lápis de cor aquareláveis; figuras com volume; guache e experimentações.',
      },
      {
        title: 'Módulo 3',
        description:
          'Tintas e pastéis; refinamento de sombras e luz para efeito realista; proporção, composição e texturas.',
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
    title: 'Pintura a Óleo ou Acrílica',
    shortTitle: 'Óleo ou Acrílica',
    excerpt:
      'Da teoria das cores à pintura em camadas e velaturas, em papel, madeira e tela.',
    description: [
      'No curso, os alunos exploram a pintura com tinta a óleo ou acrílica, iniciando pela teoria das cores e composição com paletas restritas. Experimentam diferentes superfícies — papel, madeira, tela — e conhecem os materiais e ferramentas essenciais.',
      'A metodologia valoriza a progressão natural do desenho para a pintura: é recomendada base prévia em desenho para conceitos como perspectiva e luz e sombra.',
    ],
    audience: 'Adultos e adolescentes a partir de 13 anos',
    classLength: '3 horas por aula',
    totalHours: 'Conteúdo programado para 120 horas de aula',
    enrollment: 'Presencial e online: matrículas abertas o ano todo',
    requiresDrawing: true,
    modules: [
      {
        title: 'Módulo 1',
        description:
          'Introdução às cores e materiais; experimentação com tinta a óleo/acrílica, grafite e carvão.',
      },
      {
        title: 'Módulo 2',
        description:
          'Estudos em carvão e superfícies, explorando texturas com tinta a óleo/acrílica.',
      },
      {
        title: 'Módulo 3',
        description:
          'Pintura em camadas, velaturas e técnicas mistas, desenvolvendo profundidade.',
      },
      {
        title: 'Módulo 4',
        description:
          'Acompanhamento personalizado para projetos autorais, sem prazo pré-definido.',
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
    title: 'Pintura em Aquarela ou Guache',
    shortTitle: 'Aquarela ou Guache',
    excerpt:
      'Transparências, sobreposições e gradientes na aquarela; camadas densas e acabamentos suaves no guache.',
    description: [
      'No curso de pintura a base d’água, os alunos ampliam os estudos em teoria da cor através da experimentação de técnicas com tintas, com uma visão geral dos gêneros tradicionais da pintura e repertório de História da Arte.',
      'Há espaço para o desenvolvimento de trabalhos autorais através da experimentação de técnicas mistas, de acordo com o gosto estético de cada aluno.',
    ],
    audience: 'Adultos, adolescentes e crianças a partir de 9 anos',
    classLength: '2 horas por aula',
    totalHours: 'Conteúdo programado para 112 horas de aula',
    enrollment: 'Presencial e/ou online ao vivo: matrículas abertas o ano todo',
    requiresDrawing: true,
    modules: [
      {
        title: 'Módulo 1',
        description:
          'Introdução às cores e materiais: círculo cromático, isocromia, monocromia, policromia e harmonia das cores.',
      },
      {
        title: 'Módulo 2',
        description:
          'Estudos de superfícies e diluição, com experimentação de texturas, máscaras e técnicas de aguada.',
      },
      {
        title: 'Módulo 3',
        description:
          'Técnica mista: tinta aquarela/guache, grafite, nanquim e texturas.',
      },
      {
        title: 'Módulo 4',
        description:
          'Acompanhamento personalizado para projetos autorais, sem prazo pré-definido.',
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
    title: 'Desenho Infantil',
    shortTitle: 'Desenho Infantil',
    excerpt:
      'Habilidades manuais e percepção espacial para crianças a partir dos 6 anos, com muita experimentação de materiais.',
    description: [
      'No Curso de Desenho Infantil são desenvolvidas as habilidades manuais e de percepção espacial das crianças, com base em experimentações de materiais, estudos iniciais de ponto, linha e forma, estudos de cores e composição.',
      'O curso acompanha o nível e o ritmo de cada aluno, seja iniciante ou avançado, com registro contínuo do progresso individual.',
    ],
    audience: 'Crianças a partir dos 6 anos',
    classLength: '2 horas por aula',
    enrollment: 'Matrículas abertas o ano todo',
    modules: [
      {
        title: 'Módulo 1',
        description:
          'Apresentação de materiais (grafite, lápis de cor, giz de cera), escala tonal, luz e sombra.',
      },
      {
        title: 'Módulo 2',
        description:
          'Aprofundamento de materiais com lápis de cor aquareláveis, volume e perspectiva, introdução à tinta guache.',
      },
      {
        title: 'Módulo 3',
        description:
          'Ampliação com tintas e pastéis, sombras e luz para efeito realista, proporção, composição e texturas.',
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
    title: 'Para Além do Cânone: uma história conectada da arte',
    shortTitle: 'História da Arte',
    excerpt:
      'Um curso teórico que repensa a História da Arte para além de narrativas eurocentradas, da Antiguidade à contemporaneidade.',
    description: [
      'O curso convida a repensar a História da Arte para além de narrativas eurocentradas e lineares, compreendendo a arte como um campo dinâmico de trocas, circulações e disputas entre culturas.',
      'Percorre da Antiguidade à contemporaneidade em três módulos, explorando conexões entre sociedades e a circulação de ideias — concluindo com reflexões sobre inteligência artificial na produção artística.',
      'As aulas são expositivas e dialogadas, com estudos de caso, dinâmicas interativas e atividades individuais e em grupo que estimulam o pensamento crítico.',
    ],
    audience:
      'Profissionais criativos, estudantes, pesquisadores, guias e mediadores culturais, público 50+ e apaixonados por museus e cultura',
    classLength: '2h30 por encontro semanal',
    totalHours: '90 horas (30h por módulo) — 9 meses',
    enrollment: 'Curso teórico presencial — turmas a partir de abril de 2026',
    modules: [
      {
        title: 'Módulo 1 — Antiguidade e mundos conectados',
        description:
          'A arte como campo de trocas entre culturas desde a Antiguidade.',
      },
      {
        title: 'Módulo 2 — Circulações e disputas',
        description:
          'Conexões entre sociedades e a circulação de ideias e imagens.',
      },
      {
        title: 'Módulo 3 — Contemporaneidade',
        description:
          'Da arte moderna às reflexões sobre inteligência artificial na produção artística.',
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
