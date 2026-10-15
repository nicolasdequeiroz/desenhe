/**
 * Conteúdo da linha In Company (oficinas, palestras e ações de arte para
 * empresas). Não há valores aqui de propósito: o site só recebe pedidos de
 * proposta, e o preço sai sob medida (ver a página /in-company).
 */

export type InCompanyNeed = 'inovacao' | 'bem-estar' | 'eventos' | 'outros';

export interface InCompanyStep {
  /**
   * Nome da variante, quando as etapas são alternativas e não uma sequência
   * (os dois formatos dos retratos). Sem ele, a lista vira um cronograma.
   */
  label?: string;
  /** Tempo aproximado da etapa ou da variante ("30 min", "2 a 3 h"). */
  time: string;
  title: string;
  text: string;
}

export interface InCompanyFormat {
  /** Slug da página própria; sem `page`, o formato só aparece como bloco no hub. */
  slug: string;
  need: InCompanyNeed;
  /** Rótulo da necessidade, no topo do bloco. */
  needLabel: string;
  /** Nome que fala de resultado, usado como título. */
  title: string;
  /** Resumo de uma ou duas frases, para o bloco do hub. */
  summary: string;
  image: string;
  imageAlt: string;
  /** Ficha curta, mostrada no bloco do hub e na página do formato. */
  facts: {label: string; value: string}[];
  /** Presente só nos formatos que ganham página própria. */
  page?: {
    seoTitle: string;
    seoDescription: string;
    kicker: string;
    lead: string;
    /**
     * Quatro fotos do "baralho" da primeira dobra, como nas páginas de curso.
     * A primeira é a do próprio formato; as outras são do ateliê.
     */
    deck: string[];
    /**
     * Descrição em parágrafos, no bloco logo abaixo da primeira dobra (o
     * mesmo `.course-intro` das páginas de curso).
     */
    description: string[];
    /**
     * Linhas que completam o "Resumo do formato", depois de `facts`
     * (equipe, ideal para, o que a empresa recebe).
     */
    details: {label: string; value: string}[];
    stepsTitle: string;
    /** Texto de apoio da linha do tempo (só nos formatos com cronograma). */
    stepsLead?: string;
    steps: InCompanyStep[];
    prepare: {title: string; text: string}[];
    faq: {question: string; answer: string}[];
    /** Mensagem do WhatsApp, citando o formato. */
    message: string;
  };
}

export const IN_COMPANY_FORMATS: InCompanyFormat[] = [
  {
    slug: 'criatividade-para-resolver-problemas',
    need: 'inovacao',
    needLabel: 'Inovação e treinamento',
    title: 'Criatividade para resolver problemas',
    summary:
      'Uma palestra sobre como a história da arte resolveu problemas com pouco recurso e uma dinâmica em grupos em que a equipe aplica esses mecanismos em desafios reais da empresa.',
    image: '/images/in-company/card-criatividade.webp',
    imageAlt: 'Professor da Desenhe orientando um grupo em volta da mesa de trabalho',
    facts: [
      {label: 'Duração', value: 'Cerca de 1h30'},
      {label: 'Participantes', value: '16 a 30 pessoas'},
      {label: 'Onde', value: 'Na empresa'},
    ],
    page: {
      seoTitle: 'Palestra e Dinâmica de Criatividade para Empresas em Curitiba',
      seoDescription:
        'Palestra com dinâmica em grupos sobre criatividade para resolver problemas, para equipes de 16 a 30 pessoas. Conduzida por professores de arte, na sua empresa em Curitiba.',
      kicker: 'Palestra + dinâmica',
      lead: 'Três lições da história da arte sobre resolver problemas com pouco recurso, aplicadas pela equipe em um desafio real da empresa.',
      deck: [
        '/images/in-company/deck-criatividade-1.webp',
        '/images/in-company/deck-criatividade-2.webp',
        '/images/in-company/deck-criatividade-3.webp',
        '/images/in-company/deck-criatividade-4.webp',
      ],
      description: [
        'A história da arte está cheia de problemas técnicos resolvidos com pouco recurso. A palestra traduz três desses mecanismos para o trabalho do grupo, e a dinâmica coloca todo mundo para usá-los num desafio real da empresa.',
        'A ideia central: soluções criativas surgem da limitação, não do talento. Isso desfaz a objeção mais comum no ambiente corporativo, a de que "eu não sou criativo", porque o mérito passa do indivíduo para o método.',
        'Não é um sprint de design nem uma sessão para resolver problemas complexos. É uma experiência para a equipe aprender um jeito de pensar e sair com quatro propostas visuais aproveitáveis.',
      ],
      details: [
        {label: 'Equipe', value: '1 condutor e 1 apoio'},
        {label: 'Ideal para', value: 'Treinamentos, convenções, planejamento e semanas de inovação'},
        {label: 'A empresa recebe', value: '4 propostas visuais para desafios reais e devolutiva à equipe de RH'},
      ],
      stepsTitle: 'Uma tarde, quatro tempos',
      stepsLead:
        'Cerca de uma hora e meia na sua empresa, da palestra à votação final, conduzida por um professor da Desenhe.',
      steps: [
        {
          time: '30 min',
          title: 'Palestra',
          text: 'Arte como resolução de problemas, circulação de ideias e os três mecanismos: restrição deliberada, deslocamento de contexto e iteração sem apego.',
        },
        {
          time: '40 a 50 min',
          title: 'Dinâmica em grupos',
          text: 'Cada grupo recebe um desafio real da empresa e cartas de restrição. Na virada, os trabalhos trocam de grupo e cada um continua a ideia do outro.',
        },
        {
          time: '10 a 15 min',
          title: 'Pitch e votação',
          text: 'Cada grupo apresenta em 90 segundos e a turma vota.',
        },
        {
          time: '5 min',
          title: 'Fechamento',
          text: 'O condutor mostra qual mecanismo cada grupo usou sem perceber.',
        },
      ],
      prepare: [
        {
          title: 'Desafios reais',
          text: 'Antes da ação, conversamos com o RH e escolhemos juntos quatro desafios concretos da operação.',
        },
        {
          title: 'Exemplos do seu setor',
          text: 'A palestra é ajustada com exemplos próximos da realidade da equipe.',
        },
        {
          title: 'Visita técnica',
          text: 'Conferimos o espaço: mesas, projeção, tomadas e parede livre para a exposição final.',
        },
      ],
      faq: [
        {
          question: 'Quantas pessoas participam?',
          answer:
            'De 16 a 30 pessoas por condutor, em grupos de cerca de cinco. Para turmas maiores, existem outros formatos: fale com a gente.',
        },
        {
          question: 'O que a empresa precisa ter?',
          answer:
            'Uma sala com projeção e possibilidade de escurecimento parcial, mesas para os grupos, tomadas e uma parede livre para expor os trabalhos. Os materiais são nossos.',
        },
        {
          question: 'Precisa saber desenhar?',
          answer:
            'Não. O método foi pensado para quem nunca pegou num pincel: o resultado vem das regras do jogo, não do talento.',
        },
        {
          question: 'Como é dividido o tempo?',
          answer:
            'São cerca de 1h30: uma palestra de 30 minutos, a dinâmica em grupos, uma rodada de apresentações com votação e um fechamento curto do condutor.',
        },
        {
          question: 'Como vocês chegam aos desafios da empresa?',
          answer:
            'Antes da ação, pedimos ao RH alguns problemas reais e concretos da operação. Escolhemos quatro, reescrevemos em forma de briefing e mandamos para validação. Isso é o que diferencia a dinâmica de um workshop genérico.',
        },
        {
          question: 'E se o grupo tiver mais de 30 pessoas?',
          answer:
            'Dividimos a turma em sessões seguidas ou indicamos outro formato, para cada grupo continuar com o acompanhamento de perto que a dinâmica pede.',
        },
        {
          question: 'O que fica para a empresa depois?',
          answer:
            'As quatro propostas visuais criadas pelos grupos, o registro em foto das pranchas finais e uma devolutiva para o RH com o que foi feito e quem participou.',
        },
        {
          question: 'Com quanta antecedência devo pedir?',
          answer:
            'O ideal são 30 dias: o tempo de conversar com o RH, coletar os desafios, conhecer o espaço e preparar os materiais. Para datas mais próximas, consulte a agenda.',
        },
      ],
      message:
        'Olá! Quero uma proposta de In Company para a palestra com dinâmica "Criatividade para resolver problemas".',
    },
  },
  {
    slug: 'pausa-de-descompressao',
    need: 'bem-estar',
    needLabel: 'Bem-estar',
    title: 'Pausa de descompressão',
    summary:
      'Trinta minutos em pé, sem cadeira e sem tela em branco. Cada pessoa sobrepõe lâminas de cor às de um colega num painel iluminado, e o grupo vê as cores nascerem juntas.',
    image: '/images/in-company/card-descompressao.webp',
    imageAlt: 'Aluno pintando um círculo cromático com as cores primárias',
    facts: [
      {label: 'Duração', value: '30 min por sessão'},
      {label: 'Participantes', value: '15 a 20 por sessão'},
      {label: 'Onde', value: 'Na empresa'},
    ],
  },
  {
    slug: 'retratos-em-dupla',
    need: 'eventos',
    needLabel: 'Eventos e confraternização',
    title: 'Retratos em dupla',
    summary:
      'Em duplas, as pessoas se desenham uma à outra através de uma placa de acrílico. Cada um assina e entrega o retrato a quem posou: todo mundo leva para casa um retrato feito por um colega.',
    image: '/images/in-company/card-retratos.webp',
    imageAlt: 'Mãos desenhando as proporções de um rosto a lápis, vistas de cima',
    facts: [
      {label: 'Duração', value: '30 min a 3h'},
      {label: 'Participantes', value: '20 a 80 pessoas'},
      {label: 'Onde', value: 'No local da festa ou evento'},
    ],
    page: {
      seoTitle: 'Atividade de Confraternização para Empresas: Retratos em Dupla',
      seoDescription:
        'Atração de arte para confraternização e eventos corporativos em Curitiba: a própria equipe se desenha em duplas, através de acrílico. De 20 a 80 pessoas, no local do evento.',
      kicker: 'Confraternização e eventos',
      lead: 'Em duplas, frente a frente, as pessoas se desenham através de uma placa de acrílico. No final, cada um entrega o retrato a quem posou.',
      deck: [
        '/images/in-company/deck-retratos-1.webp',
        '/images/in-company/deck-retratos-2.webp',
        '/images/in-company/deck-retratos-3.webp',
        '/images/in-company/deck-retratos-4.webp',
      ],
      description: [
        'Duas pessoas, frente a frente, desenham uma à outra através de uma placa de acrílico transparente, a mesma técnica da "janela" usada por artistas do Renascimento. O contorno já está ali, é só seguir: o resultado surpreende quem nunca desenhou.',
        'No final, cada um assina, escreve uma dedicatória e entrega o retrato a quem posou. Diferente da caricatura ao vivo, aqui quem desenha é a própria equipe: ninguém fica só assistindo, e todo mundo volta para casa com um retrato feito por um colega.',
      ],
      details: [
        {label: 'Equipe', value: '1 condutor e 1 apoio'},
        {label: 'Ideal para', value: 'Fim de ano, integração, aniversário da empresa e eventos com clientes'},
        {label: 'Cada pessoa leva', value: 'O próprio retrato, feito por um colega, em um envelope'},
      ],
      stepsTitle: 'Os 2 formatos, conforme o evento',
      steps: [
        {
          label: 'Bloco',
          time: '30 min',
          title: 'Todos juntos, no roteiro da festa',
          text: 'Todas as duplas ao mesmo tempo, em rodadas cronometradas: retrato cego para soltar a mão, retrato através do acrílico, até três cores e a troca final. Ideal para jantar sentado, com um momento na programação. De 20 a 40 pessoas.',
        },
        {
          label: 'Estação',
          time: '2 a 3 h',
          title: 'Rodízio livre, sem parar a festa',
          text: 'Duas a quatro estações num canto iluminado, com rodízio livre. Não interrompe nada e combina com coquetel em pé. Atende de 40 a 80 pessoas no período.',
        },
      ],
      prepare: [
        {
          title: 'Placas com a sua marca',
          text: 'Podemos gravar o logo da empresa nas placas de acrílico. A fabricação leva tempo, então vale pedir com antecedência.',
        },
        {
          title: 'Conversa sobre o espaço',
          text: 'Olhamos fotos do salão para achar o canto com melhor luz e, no formato bloco, combinamos o melhor momento na programação.',
        },
        {
          title: 'Equipe pronta',
          text: 'Um condutor e um apoio da Desenhe cuidam de tudo, dos materiais à troca final dos retratos.',
        },
      ],
      faq: [
        {
          question: 'Qual formato escolher?',
          answer:
            'O bloco funciona melhor quando há um momento na programação, como num jantar sentado. A estação aberta é a melhor para coquetel em pé e grupos maiores, porque não interrompe a festa.',
        },
        {
          question: 'Em que é diferente de uma caricatura ao vivo?',
          answer:
            'Na caricatura, um artista desenha os convidados. Aqui os próprios convidados se desenham em duplas, guiados por um professor: é uma atividade de integração, não uma atração para assistir.',
        },
        {
          question: 'Precisa saber desenhar?',
          answer:
            'Não. O acrílico transparente deixa o contorno já pronto: basta seguir o que se vê através dele.',
        },
        {
          question: 'Quanto tempo leva cada retrato?',
          answer:
            'No formato bloco, as duplas desenham juntas em cerca de 30 minutos. Na estação, cada dupla leva de 6 a 10 minutos, contando a troca, e o rodízio segue durante a festa.',
        },
        {
          question: 'O que a gente precisa providenciar no local?',
          answer:
            'Um canto com boa luz, tomadas e espaço para as cadeiras frente a frente. As placas de acrílico, as canetas, a iluminação e os envelopes ficam por nossa conta.',
        },
        {
          question: 'Dá para colocar o logo da empresa?',
          answer:
            'Dá: o logo pode ser gravado nas placas de acrílico. Como as placas são encomendadas sob medida, vale pedir com antecedência.',
        },
        {
          question: 'Como cada pessoa leva o retrato?',
          answer:
            'Assinado, com uma dedicatória escrita por quem desenhou, dentro de um envelope. É o tipo de lembrança que vai para a mesa do trabalho.',
        },
        {
          question: 'Com quanta antecedência devo pedir?',
          answer:
            'O ideal são 30 dias, principalmente para encomendar as placas com o logo e combinar o melhor momento na programação. Para datas mais próximas, consulte a agenda.',
        },
      ],
      message:
        'Olá! Quero uma proposta de In Company para uma confraternização ou evento com os "Retratos em dupla".',
    },
  },
  {
    slug: 'oficina-sob-medida',
    need: 'outros',
    needLabel: 'Outros formatos',
    title: 'Oficina sob medida no ateliê',
    summary:
      'Sua equipe vem até a Desenhe e cria uma peça com tema definido junto com a gente: lenços, telas para o escritório, cadernos ou cartões.',
    image: '/images/in-company/card-oficina.webp',
    imageAlt: 'Turma desenhando e pintando nas mesas do ateliê da Desenhe',
    facts: [
      {label: 'Duração', value: '1h a 2h por grupo'},
      {label: 'Participantes', value: 'Até 10 por grupo'},
      {label: 'Onde', value: 'No ateliê da Desenhe'},
    ],
  },
];

export const IN_COMPANY_NEEDS: {need: InCompanyNeed; label: string; text: string}[] = [
  {
    need: 'inovacao',
    label: 'Inovação e treinamento',
    text: 'Para treinamentos, convenções, planejamento e semanas de inovação.',
  },
  {
    need: 'bem-estar',
    label: 'Bem-estar',
    text: 'Para a abertura de uma SIPAT, uma semana de saúde ou o intervalo de uma reunião longa.',
  },
  {
    need: 'eventos',
    label: 'Eventos e confraternização',
    text: 'Para fim de ano, integração, aniversário da empresa e eventos com clientes.',
  },
];

export const IN_COMPANY_FAQ: {question: string; answer: string}[] = [
  {
    question: 'Precisa saber desenhar?',
    answer:
      'Não. Todas as experiências foram desenhadas para quem nunca pegou num pincel: o método garante um bom resultado, e é isso que tira as pessoas do automático.',
  },
  {
    question: 'Onde acontece?',
    answer:
      'Na sua empresa, no local do seu evento ou, na oficina sob medida, no nosso ateliê, em Curitiba. Na proposta combinamos o que faz mais sentido para o seu caso.',
  },
  {
    question: 'Quantas pessoas cada formato atende?',
    answer:
      'Depende do formato: a palestra com dinâmica atende de 16 a 30 pessoas, a pausa de descompressão até 20 por sessão, os retratos em dupla de 20 a 80 e a oficina no ateliê grupos de até 10. Para turmas maiores, montamos mais de uma sessão ou outro formato.',
  },
  {
    question: 'Com quanta antecedência devo pedir?',
    answer:
      'O ideal são 30 dias, para preparar materiais personalizados. Para datas mais próximas, consulte a disponibilidade.',
  },
  {
    question: 'Como é feita a cessão de imagem?',
    answer:
      'Fotos só são usadas pela Desenhe e pela empresa com autorização dos participantes, por meio de um termo coletado pela empresa e anexado ao contrato.',
  },
  {
    question: 'Quanto custa e como é o pagamento?',
    answer:
      'O valor depende do formato, do tamanho do grupo e da personalização, por isso trabalhamos com proposta. A reserva da data é feita com 50% do valor e o restante até o dia da ação, por Pix, cartão ou boleto, com nota fiscal.',
  },
];

export const IN_COMPANY_STEPS: {label: string; heading: string; description: string}[] = [
  {
    label: 'Etapa 1',
    heading: 'Conversa',
    description: 'Um bate-papo rápido para entender o objetivo, o público e a data.',
  },
  {
    label: 'Etapa 2',
    heading: 'Proposta',
    description: 'Você recebe uma proposta com opções de formato para o seu caso.',
  },
  {
    label: 'Etapa 3',
    heading: 'Preparação',
    description: 'Briefing, visita técnica e materiais personalizados.',
  },
  {
    label: 'Etapa 4',
    heading: 'Experiência',
    description: 'Condução por professores da Desenhe.',
  },
  {
    label: 'Etapa 5',
    heading: 'Devolutiva',
    description: 'Fotos e um resumo da ação para a equipe de RH.',
  },
];

/** Mensagem genérica de pedido de proposta (hero, CTA final e header). */
export const IN_COMPANY_MESSAGE =
  'Olá! Gostaria de uma proposta de In Company (arte para empresas) da Desenhe.';
