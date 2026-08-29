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

/**
 * Submodalidade de um curso "guarda-chuva": um mesmo curso que reúne
 * linguagens distintas (ex.: Mangá, HQ e Cartoon). Cada uma tem nome
 * próprio, usado como título em destaque, e um texto curto que a
 * diferencia das demais.
 */
export interface CourseStrand {
  /** Nome da linguagem, sem o prefixo "Curso de". Ex.: "Mangá". */
  name: string;
  description: string;
}

export type CourseCategory = 'desenho' | 'pintura' | 'institucional' | 'infantil';

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  desenho: 'Desenho',
  pintura: 'Pintura',
  institucional: 'Curso teórico',
  infantil: 'Infantil',
};

export interface Course {
  slug: string;
  title: string;
  /** Título curto para cards e navegação. */
  shortTitle: string;
  /** Título ainda mais resumido, só para a lista do carrossel de cursos em destaque da home. */
  featuredTitle?: string;
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
  /**
   * Quando presente, o curso reúne linguagens distintas sob o mesmo
   * título. A página do curso mostra um bloco com título próprio para
   * cada uma, no lugar dos parágrafos de `description`, e o card na lista
   * de cursos exibe os nomes como etiquetas.
   */
  strands?: CourseStrand[];
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
      'Fundamentos da forma, perspectiva, luz e sombra e teoria das cores, no seu ritmo, até criar suas próprias obras autorais.',
    description: [
      'O curso de Desenho Artístico aborda os fundamentos da forma, perspectiva, luz e sombra e teoria das cores. O avanço do conteúdo respeita o seu ritmo, e você alcança os resultados através da prática.',
      'Durante as aulas, você desenvolverá sua expressão autoral experimentando materiais tradicionais do desenho, podendo se aperfeiçoar em técnicas específicas.',
      'É a formação ideal para construir uma base técnica segura e para começar a criar suas próprias obras originais.',
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
    slug: 'desenho-de-figura-humana',
    tagline: 'Do gesto à anatomia: o corpo desenhado com precisão e sensibilidade.',
    title: 'Desenho de Figura Humana',
    category: 'desenho',
    shortTitle: 'Desenho de Figura Humana',
    excerpt:
      'Proporção, volume e escorço: a mecânica do corpo estudada da observação à anatomia, com aulas de modelo vivo.',
    description: [
      'O curso de Desenho de Figura Humana aborda a representação do corpo unindo observação e estudo anatômico. Você aprenderá a desenvolver proporções, volumes e escorços, compreendendo a mecânica dos músculos e ossos para desenhar a figura em diferentes movimentos.',
      'O programa explora materiais tradicionais, como carvão, sanguínea e nanquim, e inclui quatro aulas fundamentais de observação com modelo vivo. É a vivência ideal para dominar a figuração humana e criar trabalhos finalizados com segurança e técnica.',
    ],
    audience: 'Adultos e adolescentes (consulte a idade mínima com a escola)',
    ageBadge: 'Consultar',
    enrollment: 'Curso presencial: consulte as próximas turmas',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Gesto e estrutura',
        description:
          'O gesto e a organização geral da figura como ponto de partida, com os primeiros estudos de proporção, eixos, massas, articulações e relações espaciais.',
      },
      {
        title: 'Módulo 2',
        heading: 'Anatomia aplicada',
        description:
          'Ossos, articulações e massas musculares viram ferramenta para construir a figura em diferentes posições, com o volume e o escorço ganhando precisão.',
      },
      {
        title: 'Módulo 3',
        heading: 'Luz, detalhes e movimento',
        description:
          'Luz e sombra sobre o corpo, mãos, pés, cabeça, vestuário e movimento se somam à composição, ampliando o repertório de materiais como carvão, sanguínea e nanquim.',
      },
      {
        title: 'Módulo 4',
        heading: 'Modelo vivo e estudos finalizados',
        description:
          'Quatro aulas de observação com modelo vivo consolidam construção, anatomia e técnica em estudos finalizados de figura humana.',
      },
    ],
    pricingTier: 'consultar',
    priceNotes: ['Valores e condições sob consulta'],
    gallery: [],
  },
  {
    slug: 'quadrinhos-hq-manga-cartoon',
    tagline: 'Personagens e histórias que nascem na ponta do seu lápis.',
    title: 'Quadrinhos - Mangá, HQ e Cartoon',
    category: 'desenho',
    shortTitle: 'Quadrinhos - Mangá, HQ e Cartoon',
    featuredTitle: 'Quadrinhos',
    featuredSubtitle: 'Mangá, HQ e Cartoon',
    excerpt:
      'Mangá, HQ e Cartoon: personagens, cenários e narrativas visuais, das formas básicas à arte-final.',
    description: [
      'O curso de Quadrinhos reúne três linguagens dentro do mesmo programa: mangá, história em quadrinhos e cartoon. Em todas elas o caminho vai das formas básicas até a arte-final, passando pela criação de personagens, pela construção de cenários e pelo uso da luz e da sombra na narrativa visual.',
      'Como o ensino é individualizado, o cronograma se ajusta ao seu interesse: dá para mergulhar em uma das três linguagens ou transitar entre elas ao longo do curso. Veja abaixo o foco de cada uma.',
    ],
    strands: [
      {
        name: 'Mangá',
        description:
          'Criação de personagens e narrativas visuais na estética dos quadrinhos japoneses, das formas básicas à arte-final. Você trabalha expressões, cenas de movimento, cenários e o uso da luz e da sombra para montar histórias completas.',
      },
      {
        name: 'História em Quadrinhos',
        description:
          'Personagens e universos na linguagem das HQs e das graphic novels, do rascunho ao acabamento. O foco é a narrativa sequencial: anatomia, cenários, enquadramento, movimento e o uso da luz e da sombra para contar histórias em imagens.',
      },
      {
        name: 'Cartoon',
        description:
          'Simplificação das formas e exagero expressivo para criar personagens dinâmicos e cheios de personalidade, dos traços básicos ao projeto final. As aulas também cobrem cenários, a interação entre as figuras e os acabamentos, sempre com humor e leveza.',
      },
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
      'Croquis funcionais e a metodologia de desenvolvimento de coleção, do painel de tendências ao book final.',
    description: [
      'O curso de Desenho de Moda ensina a criar croquis e a vivenciar a metodologia do desenvolvimento de coleções. Durante as aulas, você estruturará painéis de tendências, materiais e público-alvo, compreendendo na prática o conceito de mix de produtos.',
      'O aprendizado envolve o desenho de diversos biotipos e gêneros, capacitando você a transformar suas ideias em peças autênticas. Ao final, você construirá um book de coleção, unindo a expressão dos croquis aos desenhos planificados.',
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
    slug: 'ilustracao-de-livros-infantis',
    tagline: 'Onde o desenho encontra a narrativa para contar histórias.',
    title: 'Ilustração de Livros Infantis',
    category: 'desenho',
    shortTitle: 'Ilustração de Livros Infantis',
    featuredTitle: 'Ilustração Infantil',
    excerpt:
      'Narrativas visuais para o universo da infância: personagens, cenários e a relação entre texto e imagem.',
    description: [
      'O curso de Ilustração de Livros Infantis aborda a criação de narrativas visuais focadas no universo da infância, articulando desenho, personagens e projeto gráfico. Você aprenderá a desenvolver figuras e cenários, explorando a relação direta entre texto e imagem na composição das páginas.',
      'O programa permite a experimentação com diferentes técnicas, como aquarela e lápis de cor, adequando o material à intenção da obra. Ao final, você construirá um projeto editorial completo, transformando esboços e storyboards em sequências narrativas finalizadas.',
    ],
    audience: 'Adultos e adolescentes',
    ageBadge: 'Adultos e adolescentes',
    enrollment: 'Curso presencial: consulte as próximas turmas',
    modules: [
      {
        title: 'Módulo 1',
        heading: 'Pesquisa e personagens',
        description:
          'Pesquisa e geração de ideias como ponto de partida, seguidas da construção e caracterização dos personagens que vão habitar a história.',
      },
      {
        title: 'Módulo 2',
        heading: 'Ambientes e composição',
        description:
          'Criação de ambientes, composição, enquadramento e sequência visual, organizando o ritmo da narrativa página a página.',
      },
      {
        title: 'Módulo 3',
        heading: 'Técnicas e materiais',
        description:
          'Experimentação com grafite, aquarela, guache, lápis de cor e outros materiais, sempre em diálogo com a relação entre texto e imagem.',
      },
      {
        title: 'Módulo 4',
        heading: 'Projeto editorial',
        description:
          'De esboços e storyboards à arte final, o projeto é preparado para reprodução e reunido numa proposta de sequência editorial.',
      },
    ],
    pricingTier: 'consultar',
    priceNotes: ['Valores e condições sob consulta'],
    gallery: [],
  },
  {
    slug: 'pintura-em-aquarela-ou-guache',
    tagline: 'Transparências e camadas até a cor virar seu jeito de ver.',
    title: 'Técnicas de Pintura a Base d’Água: Tinta Aquarela e Guache',
    category: 'pintura',
    shortTitle: 'Técnicas de Pintura a Base d’Água: Tinta Aquarela e Guache',
    featuredTitle: 'Aquarela e Guache',
    excerpt:
      'Aquarela: fluidez e transparência em aguadas suaves. Guache: opacidade e cobertura em composições de forte impacto.',
    description: [
      'Este curso reúne duas tintas a base d’água com personalidades opostas: a aquarela, valorizada pela fluidez e pela transparência, e o guache, de opacidade densa e forte cobertura. Nos dois casos, o estudo se apoia no aprofundamento da teoria da cor e no controle da diluição.',
      'O cronograma é individualizado e se ajusta ao seu interesse: você pode se dedicar a uma das técnicas ou trabalhar as duas ao longo do curso. Veja abaixo o foco de cada uma.',
    ],
    strands: [
      {
        name: 'Aquarela',
        description:
          'Explora a fluidez e a transparência da aquarela, com foco na teoria da cor e no controle da água para construir aguadas suaves e sobreposições luminosas. Ideal para ampliar o repertório técnico e criar composições expressivas e leves.',
      },
      {
        name: 'Guache',
        description:
          'Domínio da opacidade e da força do guache, trabalhando diferentes diluições, de camadas densas a acabamentos suaves, apoiado na teoria da cor. Uma técnica de forte impacto visual e ótima cobertura, para composições vibrantes.',
      },
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
    slug: 'pintura-a-oleo-ou-acrilica',
    tagline: 'Da tinta pura à composição que carrega um olhar.',
    title: 'Técnicas de Pintura II: Tinta a Óleo e Acrílica',
    category: 'pintura',
    shortTitle: 'Técnicas de Pintura II: Tinta a Óleo e Acrílica',
    featuredTitle: 'Óleo e Acrílica',
    excerpt:
      'Óleo: textura e secagem lenta para misturas perfeitas. Acrílica: secagem rápida para sobreposições e texturas ousadas.',
    description: [
      'Este curso reúne duas tintas com tempos muito diferentes: o óleo, de secagem lenta, ideal para misturas e esfumados, e a acrílica, de secagem rápida, feita para sobreposições e texturas como o espatulado e o impasto. Os dois caminhos partem da sua base em desenho e se aprofundam na teoria da cor com paletas restritas, apoiados em referências da História da Arte.',
      'O ensino é individualizado: o cronograma se ajusta ao seu interesse, seja para focar em uma das tintas ou experimentar as duas. Veja abaixo o foco de cada uma.',
    ],
    strands: [
      {
        name: 'Pintura a Óleo',
        description:
          'A técnica clássica do óleo, valorizada pela textura e pela secagem lenta, ideal para misturas e esfumados. Partindo da sua base em desenho, você estuda a teoria da cor com paletas restritas em suportes como madeira e tela, ligando a prática aos gêneros tradicionais da pintura.',
      },
      {
        name: 'Pintura Acrílica',
        description:
          'A versatilidade e a secagem rápida da acrílica, ótima para sobreposições e texturas como o espatulado e o impasto. Com base em desenho, você aprofunda a teoria da cor com paletas restritas e testa suportes variados (papel, cartão, tela), apoiado em referências da História da Arte.',
      },
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
    slug: 'desenho-infantil',
    tagline: 'Mãos pequenas, primeiros traços, uma vida inteira desenhando.',
    title: 'Laboratório de Desenho Infantil',
    category: 'infantil',
    shortTitle: 'Laboratório de Desenho Infantil',
    featuredTitle: 'Desenho Infantil',
    excerpt:
      'Um espaço lúdico para descobrir e desenvolver a expressão criativa, com os fundamentos do desenho no ritmo de cada criança.',
    description: [
      'O Laboratório de Desenho Infantil é um espaço lúdico para a descoberta e o desenvolvimento da expressão criativa. O aprendizado dos fundamentos do desenho (linhas, formas, volumes e cores) acontece no ritmo de cada criança, por meio da experimentação prática com diversos materiais.',
      'Inspirado na metodologia da Desenhe Escola de Arte, o laboratório estimula a imaginação, a observação e a criação autoral, construindo uma base sólida para futuros estudos em técnicas mais avançadas de desenho e pintura.',
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
    title: 'Para Além do Cânone: uma História Conectada da Arte',
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
