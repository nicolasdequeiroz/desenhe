import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {
  SCHEDULE,
  SCHEDULE_CONFIRM_NOTE,
  SCHEDULE_DAYS,
  SCHEDULE_DURATION_NOTE,
  SCHEDULE_GROUPS,
  SCHEDULE_NOTES,
  type ScheduleGroupId,
  WEEKLY_SCHEDULE,
  type WeeklyTag,
} from '../data';

/** getDay(): 0=domingo...6=sábado. Mapeia para o índice em SCHEDULE_DAYS (ou -1 se domingo). */
function todayIndex(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? -1 : jsDay - 1;
}

/** 'A, B e C' */
function joinList(items: string[]): string {
  return items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

/**
 * Etiquetas de um grupo num horário (Aquarela e guache vira duas:
 * "Aquarela" e "Guache"). No grupo Desenho, o hover (ou o foco,
 * no toque e no teclado) mostra quais especialidades acontecem ali.
 * Observações da turma (ex.: '9+ anos') vão junto do rótulo.
 */
function ScheduleTag({tag}: {tag: WeeklyTag}) {
  const tooltip =
    tag.group === 'desenho' ? joinList(tag.courses.map((c) => c.label)) : undefined;
  return (
    <>
      {tag.labels.map((text, index) => {
        // As observações vão na primeira etiqueta do grupo.
        const label = index === 0 ? [text, ...tag.notes].join(' · ') : text;
        return tooltip ? (
          <span
            key={text}
            className={`timetable__tag timetable__tag--${tag.category} timetable__tag--tip`}
            data-tooltip={tooltip}
            tabIndex={0}
            aria-label={`${label}: ${tooltip}`}
          >
            {label}
          </span>
        ) : (
          <span key={text} className={`timetable__tag timetable__tag--${tag.category}`}>
            {label}
          </span>
        );
      })}
    </>
  );
}

export function Horarios() {
  const [todayIdx, setTodayIdx] = useState(-1);
  const [activeGroup, setActiveGroup] = useState<ScheduleGroupId | null>(null);

  useEffect(() => {
    setTodayIdx(todayIndex());
  }, []);

  const active = SCHEDULE_GROUPS.find((g) => g.id === activeGroup);
  const activeCourses = SCHEDULE.filter((c) => c.group === activeGroup);
  const activeDays = SCHEDULE_DAYS.filter((day) =>
    activeCourses.some((c) => c.slots.some((s) => s.day === day)),
  ).length;
  // Grupo de um curso só leva à página dele; Desenho (várias especialidades)
  // leva à listagem de cursos.
  const activeHref =
    activeCourses.length === 1 ? `/cursos/${activeCourses[0].courseSlug}` : '/cursos';

  return (
    <>
      <Seo
        title="Horários das Turmas de Desenho e Pintura"
        description="Grade semanal das turmas da Desenhe em Curitiba: aulas de segunda a sábado, de manhã, à tarde e à noite. Escolha o horário que cabe na sua rotina."
        path="/horarios"
      />
      <Section
        kicker="Horários"
        title="Grade semanal de turmas"
        lead="Uma única grade com todos os cursos, de segunda a sábado. Filtre por curso para ver só os horários que interessam a você."
      >
        <div className="timetable">
          <div className="timetable__filters" role="group" aria-label="Filtrar por curso">
            <button
              type="button"
              className={`timetable__filter${activeGroup === null ? ' is-active' : ''}`}
              onClick={() => setActiveGroup(null)}
            >
              Todos os cursos
            </button>
            {SCHEDULE_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`timetable__filter timetable__filter--${group.category}${
                  activeGroup === group.id ? ' is-active' : ''
                }`}
                onClick={() =>
                  setActiveGroup(activeGroup === group.id ? null : group.id)
                }
              >
                <span className="timetable__filter-dot" aria-hidden="true" />
                {group.label}
              </button>
            ))}
          </div>

          <p className="timetable__caption">
            {active ? (
              <>
                <Link to={activeHref}>
                  {active.label}
                  {activeCourses.length > 1 &&
                    ` (${joinList(activeCourses.map((c) => c.shortLabel))})`}
                </Link>
                : {activeDays} {activeDays === 1 ? 'dia' : 'dias'} por semana.
              </>
            ) : (
              'Cada horário mostra as modalidades que acontecem nele. Em Desenho, passe o mouse ou toque na etiqueta para ver as especialidades.'
            )}
          </p>

          <div className="timetable__scroll">
            <div className="timetable__board">
              <div className="timetable__row timetable__row--head">
                <span className="timetable__corner" />
                {SCHEDULE_DAYS.map((day, index) => (
                  <span
                    key={day}
                    className={`timetable__day-head${
                      index === todayIdx ? ' is-today' : ''
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>

              {WEEKLY_SCHEDULE.map((row) => (
                <div key={row.period} className="timetable__row">
                  <span className="timetable__period">{row.label}</span>
                  {row.cells.map((cell, index) => {
                    const slots = activeGroup
                      ? cell.slots
                          .map((s) => ({
                            ...s,
                            tags: s.tags.filter((t) => t.group === activeGroup),
                            waitlist: undefined,
                          }))
                          .filter((s) => s.tags.length > 0)
                      : cell.slots;
                    return (
                      <div
                        key={cell.day}
                        className={`timetable__cell${
                          index === todayIdx ? ' is-today' : ''
                        }${slots.length === 0 ? ' is-empty' : ''}`}
                      >
                        <span className="timetable__cell-day">{cell.day}</span>
                        {slots.length > 0 ? (
                          slots.map((slot) => (
                            <div key={slot.time} className="timetable__slot">
                              <span className="timetable__time">{slot.time}</span>
                              <span className="timetable__tags">
                                {slot.tags.map((tag) => (
                                  <ScheduleTag key={tag.group} tag={tag} />
                                ))}
                                {slot.waitlist && (
                                  <span
                                    className="timetable__tag timetable__tag--waitlist timetable__tag--tip"
                                    data-tooltip={`Nova turma: ${slot.waitlist}`}
                                    tabIndex={0}
                                    aria-label={`Lista de espera para nova turma: ${slot.waitlist}`}
                                  >
                                    Lista de espera
                                  </span>
                                )}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="timetable__empty" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <p className="timetable__note">
            <Text type="supporting">{SCHEDULE_DURATION_NOTE}</Text>
          </p>
        </div>
      </Section>

      <Section kicker="Bom saber" title="Como funciona o calendário" muted>
        <div className="schedule-info-grid">
          {SCHEDULE_NOTES.map((note) => (
            <div key={note.title} className="schedule-info-grid__item">
              <Heading level={3}>{note.title}</Heading>
              <Text color="secondary" display="block" style={{textWrap: 'balance'}}>
                {note.text}
              </Text>
            </div>
          ))}
        </div>
        <div style={{marginTop: 48}} className="text-center">
          <WhatsCta
            message="Olá! Gostaria de confirmar a disponibilidade de vagas nos horários da Desenhe."
            label="Confirmar vagas pelo WhatsApp"
          />
          <div style={{marginTop: 12}}>
            <Text type="supporting" color="secondary">
              {SCHEDULE_CONFIRM_NOTE}
            </Text>
          </div>
        </div>
      </Section>
    </>
  );
}
