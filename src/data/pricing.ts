/** Planos e valores 2026, extraídos do site atual. */

export interface Plan {
  months: number;
  monthly: number;
  note: string;
}

export interface PricingTier {
  id: 'desenho-2h' | 'oleo-3h';
  title: string;
  subtitle: string;
  plans: Plan[];
  trialPrice: number;
}

export const PRICING: PricingTier[] = [
  {
    id: 'desenho-2h',
    title: 'Desenho ou Pintura (aquarela/guache)',
    subtitle: 'Aulas de 2 horas, 1x por semana',
    plans: [
      {
        months: 12,
        monthly: 330,
        note: 'Para quem busca níveis avançados e certificação',
      },
      {
        months: 6,
        monthly: 367,
        note: 'Para completar módulos inteiros do curso',
      },
      {months: 3, monthly: 418, note: 'Para objetivos específicos'},
    ],
    trialPrice: 70,
  },
  {
    id: 'oleo-3h',
    title: 'Pintura a Óleo e Acrílica',
    subtitle: 'Aulas de 3 horas, 1x por semana',
    plans: [
      {
        months: 12,
        monthly: 478,
        note: 'Para quem busca níveis avançados e certificação',
      },
      {
        months: 6,
        monthly: 540,
        note: 'Para completar módulos inteiros do curso',
      },
      {months: 3, monthly: 600, note: 'Para objetivos específicos'},
    ],
    trialPrice: 100,
  },
];

export const PRICING_NOTES = [
  'Ensino individualizado, com turmas de no máximo 8 alunos.',
  'Calendário adaptado para 4 semanas por mês, de janeiro a dezembro, com recessos programados.',
  'Crianças a partir de 6 anos podem se matricular nos cursos de desenho e pintura; óleo/acrílica requer conhecimento prévio de desenho.',
];

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });
}
