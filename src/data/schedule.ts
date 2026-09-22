/**
 * Grade semanal de horários (2026).
 * Os horários devem ser confirmados via WhatsApp no momento da matrícula.
 *
 * Duração das aulas: desenho, aquarela e guache têm 2 horas; óleo e
 * acrílica, sempre 3 horas.
 */

import type {CourseCategory} from './courses';

/**
 * Um horário de aula. Pode ser só o texto ('14h–16h') ou um objeto com:
 * - `note`: observação curta sobre a turma (ex.: '9+ anos'), mostrada ao
 *   lado do horário na grade e na página do curso.
 * - `tags`: etiquetas que substituem as do grupo na grade de /horarios
 *   (ex.: só 'Aquarela' nos horários sem guache). Com elas, a `note` só
 *   aparece na página do curso.
 */
export type ScheduleTime = string | {time: string; note?: string; tags?: string[]};

/**
 * Grupo em que o curso aparece na grade de /horarios. Os cursos de desenho
 * (Artístico, Figura Humana, Quadrinhos) têm quase os mesmos horários,
 * então a grade mostra uma etiqueta só, "Desenho", e diz no hover quais
 * especialidades acontecem em cada horário. As modalidades são as mesmas
 * dos cards de /precos.
 */
export type ScheduleGroupId = 'desenho' | 'infantil' | 'aquarela' | 'oleo';

export const SCHEDULE_GROUPS: {
  id: ScheduleGroupId;
  /** Nome do grupo no filtro. */
  label: string;
  /** Etiquetas do grupo em cada horário da grade (padrão: [label]). */
  tags?: string[];
  category: CourseCategory;
}[] = [
  {id: 'desenho', label: 'Desenho', category: 'desenho'},
  {id: 'infantil', label: 'Infantil', category: 'infantil'},
  {
    id: 'aquarela',
    label: 'Aquarela e guache',
    tags: ['Aquarela', 'Guache'],
    category: 'pintura',
  },
  {id: 'oleo', label: 'Óleo e acrílica', category: 'pintura'},
];

export interface CourseSchedule {
  course: string;
  courseSlug: string;
  /** Nome curto da especialidade (usado no hover da etiqueta na grade). */
  shortLabel: string;
  /** Mesma categoria do curso em courses.ts. */
  category: CourseCategory;
  group: ScheduleGroupId;
  slots: {day: string; times: ScheduleTime[]}[];
  note?: string;
}

/** Nos horários só de aquarela (sem guache). */
const SO_AQUARELA = {tags: ['Aquarela'], note: 'só aquarela'};

export const SCHEDULE: CourseSchedule[] = [
  {
    course: 'Desenho Artístico',
    courseSlug: 'desenho-artistico',
    shortLabel: 'Desenho Artístico',
    category: 'desenho' as const,
    group: 'desenho',
    slots: [
      {day: 'Segunda', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Terça', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Quarta', times: ['9h–11h', '15h–17h']},
      {day: 'Quinta', times: ['9h–11h', '14h–16h', '16h–18h']},
      {day: 'Sexta', times: ['14h–16h']},
      {day: 'Sábado', times: ['8h–10h', '9h–11h', '10h–12h', '14h–16h']},
    ],
  },
  {
    course: 'Desenho de Figura Humana',
    courseSlug: 'desenho-de-figura-humana',
    shortLabel: 'Figura Humana',
    category: 'desenho' as const,
    group: 'desenho',
    slots: [
      {day: 'Segunda', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Terça', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Quarta', times: ['15h–17h']},
      {day: 'Quinta', times: ['9h–11h', '14h–16h', '16h–18h']},
      {day: 'Sexta', times: ['14h–16h']},
      {day: 'Sábado', times: ['8h–10h', '9h–11h', '10h–12h', '14h–16h']},
    ],
  },
  {
    course: 'Quadrinhos - HQ, Mangá e Cartoon',
    courseSlug: 'quadrinhos-hq-manga-cartoon',
    shortLabel: 'Quadrinhos',
    category: 'desenho' as const,
    group: 'desenho',
    slots: [
      {day: 'Segunda', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Terça', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Quarta', times: ['15h–17h']},
      {day: 'Quinta', times: ['9h–11h', '14h–16h', '16h–18h']},
      {day: 'Sexta', times: ['14h–16h']},
      {day: 'Sábado', times: ['8h–10h', '9h–11h', '10h–12h', '14h–16h']},
    ],
  },
  {
    course: 'Laboratório de Desenho Infantil (6 a 12 anos)',
    courseSlug: 'desenho-infantil',
    shortLabel: 'Desenho Infantil',
    category: 'infantil' as const,
    group: 'infantil',
    slots: [
      {day: 'Segunda', times: ['14h–16h']},
      {day: 'Terça', times: [{time: '14h–16h', note: '9+ anos'}]},
      {day: 'Quarta', times: ['9h–11h']},
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
    group: 'aquarela',
    slots: [
      {
        day: 'Segunda',
        times: [{time: '14h–16h', ...SO_AQUARELA}, '18h–20h', '19h–21h'],
      },
      {day: 'Terça', times: ['14h–16h', '18h–20h', '19h–21h']},
      {day: 'Quarta', times: ['15h–17h']},
      {
        day: 'Quinta',
        times: [{time: '9h–11h', ...SO_AQUARELA}, '14h–16h', '16h–18h'],
      },
      {day: 'Sexta', times: [{time: '14h–16h', ...SO_AQUARELA}]},
      {day: 'Sábado', times: ['8h–10h', '9h–11h', '10h–12h', '14h–16h']},
    ],
  },
  {
    course: 'Pintura a Óleo e Acrílica',
    courseSlug: 'pintura-a-oleo-ou-acrilica',
    shortLabel: 'Óleo e acrílica',
    category: 'pintura' as const,
    group: 'oleo',
    slots: [
      {day: 'Segunda', times: ['18h–21h']},
      {day: 'Terça', times: ['18h–21h']},
      {day: 'Quarta', times: ['15h–18h']},
      {day: 'Quinta', times: ['14h–17h', '15h–18h']},
      {day: 'Sábado', times: ['8h–11h', '9h–12h', '14h–17h']},
    ],
    note: 'As aulas de óleo e acrílica são sempre em blocos de 3 horas.',
  },
];

/**
 * Horário sem turma aberta, só com lista de espera para formar uma nova.
 * Aparece na grade de /horarios (sem filtro), fora da contagem de turmas.
 */
export const SCHEDULE_WAITLIST: {day: string; time: string; courses: string}[] = [
  {
    day: 'Quinta',
    time: '18h',
    courses: 'Desenho de Moda, Marcador, Aquarela e Pintura a Óleo',
  },
];

/** Observação no rodapé da grade (em /horarios e nas páginas de curso). */
export const SCHEDULE_DURATION_NOTE =
  'Aulas de desenho, aquarela e guache têm 2 horas; óleo e acrílica, sempre 3 horas.';

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

/** Normaliza um ScheduleTime para o formato objeto. */
export function scheduleTime(entry: ScheduleTime): {
  time: string;
  note?: string;
  tags?: string[];
} {
  return typeof entry === 'string' ? {time: entry} : entry;
}

/** Uma etiqueta da grade de /horarios: um grupo num dia e horário. */
export interface WeeklyTag {
  group: ScheduleGroupId;
  /** Etiquetas exibidas (as do grupo ou as `tags` do horário). */
  labels: string[];
  category: CourseCategory;
  /** Especialidades do grupo que acontecem neste horário (para o hover). */
  courses: {slug: string; label: string}[];
  /** Observações dos horários (ex.: '9+ anos'). */
  notes: string[];
}

export interface WeeklySlot {
  time: string;
  tags: WeeklyTag[];
  /** Horário só com lista de espera (sem turma aberta). */
  waitlist?: string;
}

export interface WeeklyRow {
  period: PeriodId;
  label: string;
  cells: {day: string; slots: WeeklySlot[]}[];
}

/**
 * Grade semanal unificada, derivada de SCHEDULE: um único calendário
 * (períodos x dias) em que cada horário lista os grupos (Desenho,
 * Infantil, Aquarela e guache, Óleo e acrílica) que acontecem nele.
 * SCHEDULE continua sendo a fonte da verdade, editada por curso.
 */
export const WEEKLY_SCHEDULE: WeeklyRow[] = SCHEDULE_PERIODS.map((period) => ({
  period: period.id,
  label: period.label,
  cells: SCHEDULE_DAYS.map((day) => {
    const byTime = new Map<string, WeeklySlot>();

    for (const group of SCHEDULE_GROUPS) {
      for (const entry of SCHEDULE.filter((e) => e.group === group.id)) {
        const slot = entry.slots.find((s) => s.day === day);
        for (const raw of slot?.times ?? []) {
          const {time, note, tags} = scheduleTime(raw);
          if (periodOf(time) !== period.id) continue;
          const weekly = byTime.get(time) ?? {time, tags: []};
          let weeklyTag = weekly.tags.find((t) => t.group === group.id);
          if (!weeklyTag) {
            weeklyTag = {
              group: group.id,
              labels: tags ?? group.tags ?? [group.label],
              category: group.category,
              courses: [],
              notes: [],
            };
            weekly.tags.push(weeklyTag);
          }
          weeklyTag.courses.push({slug: entry.courseSlug, label: entry.shortLabel});
          // Com etiquetas próprias (ex.: só 'Aquarela'), a observação já
          // está dita nelas; ela fica só para a página do curso.
          if (note && !tags && !weeklyTag.notes.includes(note)) {
            weeklyTag.notes.push(note);
          }
          byTime.set(time, weekly);
        }
      }
    }

    for (const wait of SCHEDULE_WAITLIST) {
      if (wait.day !== day || periodOf(wait.time) !== period.id) continue;
      const weekly = byTime.get(wait.time) ?? {time: wait.time, tags: []};
      weekly.waitlist = wait.courses;
      byTime.set(wait.time, weekly);
    }

    return {
      day,
      slots: [...byTime.values()].sort(
        (a, b) => startHour(a.time) - startHour(b.time) || a.time.localeCompare(b.time),
      ),
    };
  }),
}));

export interface CourseWeeklyRow {
  period: PeriodId;
  label: string;
  cells: {day: string; times: {time: string; note?: string}[]}[];
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
        .map(scheduleTime)
        .filter(({time}) => periodOf(time) === period.id)
        .sort((a, b) => startHour(a.time) - startHour(b.time))
        .map(({time, note}) => ({time, note}));
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
