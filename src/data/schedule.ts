/**
 * Grade semanal de horários, extraída do site atual (2025/2026).
 * Os horários devem ser confirmados via WhatsApp no momento da matrícula.
 */

import type {CourseCategory} from './courses';

export interface CourseSchedule {
  course: string;
  courseSlug: string;
  /** Nome curto usado nas etiquetas da grade semanal unificada. */
  shortLabel: string;
  /** Mesma categoria do curso em courses.ts: colore a etiqueta na grade unificada. */
  category: CourseCategory;
  slots: {day: string; times: string[]}[];
  note?: string;
}

export const SCHEDULE: CourseSchedule[] = [
  {
    course: 'Desenho Artístico',
    courseSlug: 'desenho-artistico',
    shortLabel: 'Artístico',
    category: 'desenho' as const,
    slots: [
      {day: 'Segunda', times: ['14h–16h', '19h–21h']},
      {day: 'Terça', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Quarta', times: ['14h–16h', '16h–18h']},
      {day: 'Quinta', times: ['10h–12h', '16h–18h']},
      {day: 'Sexta', times: ['14h–16h']},
      {day: 'Sábado', times: ['8h–10h', '10h–12h', '14h–16h']},
    ],
  },
  {
    course: 'Desenho Infantil (6 a 12 anos)',
    courseSlug: 'desenho-infantil',
    shortLabel: 'Infantil',
    category: 'desenho' as const,
    slots: [
      {day: 'Segunda', times: ['14h–16h']},
      {day: 'Terça', times: ['14h–16h', '16h–18h']},
      {day: 'Quarta', times: ['9h–11h', '14h–16h', '16h–18h']},
      {day: 'Quinta', times: ['9h–11h']},
      {day: 'Sexta', times: ['14h–16h']},
      {day: 'Sábado', times: ['8h–10h', '10h–12h', '14h–16h']},
    ],
    note: 'Crianças entre 6 e 8 anos podem fazer 1 hora de aula no mesmo período.',
  },
  {
    course: 'Quadrinhos - HQ, Mangá e Cartoon',
    courseSlug: 'quadrinhos-hq-manga-cartoon',
    shortLabel: 'Quadrinhos',
    category: 'desenho' as const,
    slots: [
      {day: 'Segunda', times: ['18h–21h']},
      {day: 'Terça', times: ['18h–21h']},
      {day: 'Quinta', times: ['9h–12h', '15h–18h']},
      {day: 'Sábado', times: ['8h–11h', '9h–12h', '14h–17h']},
    ],
  },
  {
    course: 'Pintura a Óleo e Acrílica',
    courseSlug: 'pintura-a-oleo-ou-acrilica',
    shortLabel: 'Óleo e acrílica',
    category: 'pintura' as const,
    slots: [
      {day: 'Segunda', times: ['14h–16h']},
      {day: 'Terça', times: ['14h–17h', '16h–18h']},
      {day: 'Quarta', times: ['9h–11h', '14h–17h', '15h–18h']},
      {day: 'Quinta', times: ['9h–11h']},
      {day: 'Sexta', times: ['14h–16h']},
      {day: 'Sábado', times: ['10h–12h', '14h–16h']},
    ],
  },
  {
    course: 'Pintura Aquarela ou Guache',
    courseSlug: 'pintura-em-aquarela-ou-guache',
    shortLabel: 'Aquarela e guache',
    category: 'pintura' as const,
    slots: [
      {day: 'Terça', times: ['14h–16h']},
      {day: 'Quarta', times: ['9h–11h', '14h–16h', '16h–18h']},
      {day: 'Sábado', times: ['9h–11h', '14h–16h']},
    ],
  },
];

export const SCHEDULE_DAYS = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export type PeriodId = 'manha' | 'tarde' | 'noite';

export const SCHEDULE_PERIODS: {id: PeriodId; label: string; range: string}[] = [
  {id: 'manha', label: 'Manhã', range: 'até 12h'},
  {id: 'tarde', label: 'Tarde', range: '12h às 18h'},
  {id: 'noite', label: 'Noite', range: 'a partir das 18h'},
];

/** '14h–16h' -> 14. Os horários sempre começam com a hora cheia. */
function startHour(time: string): number {
  return Number.parseInt(time, 10);
}

function periodOf(time: string): PeriodId {
  const hour = startHour(time);
  if (hour < 12) return 'manha';
  if (hour < 18) return 'tarde';
  return 'noite';
}

export interface WeeklySlot {
  time: string;
  /** courseSlug de cada curso que acontece neste dia e horário. */
  courses: string[];
}

export interface WeeklyRow {
  period: PeriodId;
  label: string;
  cells: {day: string; slots: WeeklySlot[]}[];
}

/**
 * Grade semanal unificada, derivada de SCHEDULE: um único calendário
 * (períodos x dias) em que cada horário lista os cursos que acontecem nele.
 * SCHEDULE continua sendo a fonte da verdade, editada por curso.
 */
export const WEEKLY_SCHEDULE: WeeklyRow[] = SCHEDULE_PERIODS.map((period) => ({
  period: period.id,
  label: period.label,
  cells: SCHEDULE_DAYS.map((day) => {
    const byTime = new Map<string, string[]>();

    for (const entry of SCHEDULE) {
      const slot = entry.slots.find((s) => s.day === day);
      if (!slot) continue;
      for (const time of slot.times) {
        if (periodOf(time) !== period.id) continue;
        byTime.set(time, [...(byTime.get(time) ?? []), entry.courseSlug]);
      }
    }

    return {
      day,
      slots: [...byTime.entries()]
        .map(([time, courses]) => ({time, courses}))
        .sort((a, b) => startHour(a.time) - startHour(b.time)),
    };
  }),
}));

export interface CourseWeeklyRow {
  period: PeriodId;
  label: string;
  cells: {day: string; times: string[]}[];
}

/**
 * Mesma grade período x dia da página /horarios, mas só com os horários de
 * um curso (usada na página de detalhe do curso).
 */
export function weeklyRowsForCourse(entry: CourseSchedule): CourseWeeklyRow[] {
  return SCHEDULE_PERIODS.map((period) => ({
    period: period.id,
    label: period.label,
    cells: SCHEDULE_DAYS.map((day) => {
      const slot = entry.slots.find((s) => s.day === day);
      const times = (slot?.times ?? [])
        .filter((time) => periodOf(time) === period.id)
        .sort((a, b) => startHour(a) - startHour(b));
      return {day, times};
    }),
  }));
}

export const SCHEDULE_NOTES = [
  {
    title: '4 semanas por mês',
    text: 'O calendário segue 4 semanas de aula por mês, o ano inteiro.',
  },
  {
    title: 'Janeiro a dezembro',
    text: 'A escola funciona de janeiro a dezembro, com recessos programados.',
  },
];

export const SCHEDULE_CONFIRM_NOTE =
  'Confirme a disponibilidade de vagas no horário desejado antes de se matricular.';
