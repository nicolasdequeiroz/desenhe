/**
 * Grade semanal de horários, extraída do site atual (2025/2026).
 * Os horários devem ser confirmados via WhatsApp no momento da matrícula.
 */

export interface CourseSchedule {
  course: string;
  courseSlug: string;
  slots: {day: string; times: string[]}[];
  note?: string;
}

export const SCHEDULE: CourseSchedule[] = [
  {
    course: 'Desenho Artístico',
    courseSlug: 'desenho-artistico',
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
    course: 'Quadrinhos — HQ, Mangá e Cartoon',
    courseSlug: 'quadrinhos-hq-manga-cartoon',
    slots: [
      {day: 'Segunda', times: ['18h–21h']},
      {day: 'Terça', times: ['18h–21h']},
      {day: 'Quinta', times: ['9h–12h', '15h–18h']},
      {day: 'Sábado', times: ['8h–11h', '9h–12h', '14h–17h']},
    ],
  },
  {
    course: 'Pintura a Óleo ou Acrílica',
    courseSlug: 'pintura-a-oleo-ou-acrilica',
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
    course: 'Pintura em Aquarela ou Guache',
    courseSlug: 'pintura-em-aquarela-ou-guache',
    slots: [
      {day: 'Terça', times: ['14h–16h']},
      {day: 'Quarta', times: ['9h–11h', '14h–16h', '16h–18h']},
      {day: 'Sábado', times: ['9h–11h', '14h–16h']},
    ],
  },
];

export const SCHEDULE_NOTES = [
  'O calendário é adaptado para 4 semanas de aula por mês, garantindo a mesma quantidade de aulas o ano inteiro.',
  'A escola funciona de janeiro a dezembro, com recessos programados.',
  'Confirme a disponibilidade de vagas no horário desejado pelo WhatsApp.',
];
