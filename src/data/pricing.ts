/** Planos e valores 2026, extraídos do site atual (precos-mensalidades). */

export interface Plan {
  months: number;
  monthly: number;
}

/**
 * Item do checklist "o que está incluso". Pode ser um texto simples ou,
 * quando o benefício só vale a partir de certa duração, um objeto com
 * `minMonths`: nos planos mais curtos o item aparece riscado.
 */
export type Feature = string | {label: string; minMonths: number};

export interface PricingTier {
  id: 'desenho-2h' | 'oleo-3h';
  title: string;
  subtitle: string;
  /** Planos ordenados do maior compromisso para o menor (12, 6, 3 meses). */
  plans: Plan[];
  features: Feature[];
}

const COMMON_FEATURES: Feature[] = [
  'Turmas de no máximo 8 alunos',
  'Cronograma personalizado, do iniciante ao avançado',
  'Presencial em Curitiba ou online ao vivo',
  {label: 'Certificação ao concluir', minMonths: 12},
];

export const PRICING: PricingTier[] = [
  {
    id: 'desenho-2h',
    title: 'Desenho ou Pintura (aquarela/guache)',
    subtitle: 'Aulas de 2 horas, 1x por semana',
    plans: [
      {months: 12, monthly: 330},
      {months: 6, monthly: 367},
      {months: 3, monthly: 418},
    ],
    features: ['Aula de 2 horas por semana', ...COMMON_FEATURES],
  },
  {
    id: 'oleo-3h',
    title: 'Pintura a Óleo e Acrílica',
    subtitle: 'Aulas de 3 horas, 1x por semana',
    plans: [
      {months: 12, monthly: 478},
      {months: 6, monthly: 540},
      {months: 3, monthly: 600},
    ],
    features: ['Aula de 3 horas por semana', ...COMMON_FEATURES],
  },
];

/**
 * História da Arte: curso teórico em turma fechada. Não tem entrada
 * contínua nem vaga garantida (as turmas abrem em janelas ao longo do
 * ano), então é modelado à parte dos cursos de ateliê, com seletor
 * próprio de duração: versão completa (9 meses, 3 módulos) ou curta
 * (3 meses, 1 módulo).
 */
export interface HistoryPlan {
  months: number;
  /** Rótulo no seletor. */
  label: string;
  monthly: number;
  /** O que a duração cobre (módulos e carga horária). */
  scope: string;
}

export interface HistoryCourse {
  /** Nome curto do curso (usado como selo e nas mensagens). */
  name: string;
  /** Título completo, exibido como título do card e na página do curso. */
  title: string;
  subtitle: string;
  /** Taxa de matrícula única, além das mensalidades. */
  enrollmentFee: number;
  /** Da versão completa para a curta. */
  plans: HistoryPlan[];
  /** Frase de disponibilidade (não há vaga garantida nem preço fechado). */
  availability: string;
  /** Como e quando a turma abre. */
  intake: string;
  features: string[];
  note: string;
}

export const HISTORY_OF_ART: HistoryCourse = {
  name: 'História da Arte',
  title: 'Para Além do Cânone: uma História Conectada da Arte',
  subtitle: 'Presencial em Curitiba, em turma fechada',
  enrollmentFee: 120,
  plans: [
    {
      months: 9,
      label: '9 meses',
      monthly: 460,
      scope: 'Versão completa: os 3 módulos, 90 horas no total',
    },
    {
      months: 3,
      label: '3 meses',
      monthly: 460,
      scope: 'Versão curta: 1 módulo, 30 horas',
    },
  ],
  availability: 'Vagas sob consulta',
  intake:
    'Sem entrada contínua: a turma abre em datas específicas ao longo do ano, conforme o número de interessados. Entre na lista de espera para saber da próxima.',
  features: [
    'Encontro semanal de 2h30, presencial em Curitiba',
    'Aulas expositivas e dialogadas, com estudos de caso',
    'Turma fechada, com data de início e de término',
  ],
  note: 'Alunos e ex-alunos da escola têm condições especiais.',
};

/**
 * Coworking artístico: aluguel de sala por hora para o aluno trabalhar por
 * conta própria. Não segue plano mensal, então fica fora do seletor de
 * duração.
 */
export interface Coworking {
  title: string;
  hourly: number;
  intro: string;
  features: string[];
  note: string;
}

export const COWORKING: Coworking = {
  title: 'Coworking artístico',
  hourly: 35,
  intro: 'Aluguel de sala por hora para trabalhar por conta própria, fora das aulas.',
  features: [
    'Sala com mesas grandes à sua disposição',
    'Cavaletes de mesa e cavalete de pé',
    'Potes de vidro para pintura e godê de vidro',
    'Pano e toalha de papel',
  ],
  note: 'O espaço tem biblioteca para pesquisa no local, chá, água filtrada e impressora para imagens de referência. Alunos e ex-alunos têm condições especiais.',
};

/**
 * Primeira aula (experimental): aula avulsa para conhecer a escola. O valor
 * depende só da duração da aula, não do curso.
 */
export const FIRST_CLASS_PRICES: {hours: number; price: number}[] = [
  {hours: 2, price: 70},
  {hours: 3, price: 100},
];

/** Rótulo e leitura de cada duração de plano, igual entre os cursos. */
export const PLAN_INFO: Record<number, {label: string; note: string}> = {
  12: {label: '12 meses', note: 'Para quem busca níveis avançados e certificação'},
  6: {label: '6 meses', note: 'Para completar módulos inteiros do curso'},
  3: {label: '3 meses', note: 'Para objetivos específicos'},
};

/** Durações oferecidas, da mais vantajosa para a menos. */
export const PLAN_MONTHS = [12, 6, 3] as const;

/** Valor total do plano (mensalidade x número de parcelas). */
export function planTotal(plan: Plan): number {
  return plan.monthly * plan.months;
}

export interface PricingNote {
  title: string;
  text: string;
  /** Rota interna: com isto a nota vira uma carta clicável (ver NoteGrid). */
  href?: string;
  linkLabel?: string;
}

export const PRICING_NOTES: PricingNote[] = [
  {
    title: 'Turmas pequenas',
    text: 'Ensino individualizado, com turmas de no máximo 8 alunos.',
    href: '/sobre',
    linkLabel: 'Como ensinamos',
  },
  {
    title: 'Calendário anual',
    text: 'Adaptado para 4 semanas por mês, de janeiro a dezembro, com recessos programados.',
    href: '/horarios',
    linkLabel: 'Ver os horários',
  },
  {
    title: 'Idade mínima',
    text: 'A partir de 6 anos nos cursos de desenho e pintura; óleo/acrílica requer conhecimento prévio de desenho.',
    href: '/cursos',
    linkLabel: 'Ver os cursos',
  },
  {
    title: 'Valores sob consulta',
    text: 'Desenho de Moda, Desenho de Figura Humana e Ilustração de Livros Infantis têm valores informados pelo WhatsApp.',
    href: '/cursos',
    linkLabel: 'Ver os cursos',
  },
];

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });
}
