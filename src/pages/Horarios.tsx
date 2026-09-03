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
  SCHEDULE_NOTES,
  WEEKLY_SCHEDULE,
} from '../data';

/** getDay(): 0=domingo...6=sábado. Mapeia para o índice em SCHEDULE_DAYS (ou -1 se domingo). */
function todayIndex(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? -1 : jsDay - 1;
}

export function Horarios() {
  const [todayIdx, setTodayIdx] = useState(-1);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  useEffect(() => {
    setTodayIdx(todayIndex());
  }, []);

  const active = SCHEDULE.find((c) => c.courseSlug === activeCourse);
  const activeDays = active
    ? SCHEDULE_DAYS.filter((day) => active.slots.some((s) => s.day === day)).length
    : 0;

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
              className={`timetable__filter${activeCourse === null ? ' is-active' : ''}`}
              onClick={() => setActiveCourse(null)}
            >
              Todos os cursos
            </button>
            {SCHEDULE.map((course) => (
              <button
                key={course.courseSlug}
                type="button"
                className={`timetable__filter timetable__filter--${course.category}${
                  activeCourse === course.courseSlug ? ' is-active' : ''
                }`}
                onClick={() =>
                  setActiveCourse(
                    activeCourse === course.courseSlug ? null : course.courseSlug,
                  )
                }
              >
                <span className="timetable__filter-dot" aria-hidden="true" />
                {course.shortLabel}
              </button>
            ))}
          </div>

          <p className="timetable__caption">
            {active ? (
              <>
                <Link to={`/cursos/${active.courseSlug}`}>{active.course}</Link>:{' '}
                {activeDays} {activeDays === 1 ? 'dia' : 'dias'} por semana.
              </>
            ) : (
              'Cada horário mostra os cursos que acontecem nele. Selecione um curso acima para isolar a grade dele.'
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
                    const slots = activeCourse
                      ? cell.slots.filter((s) => s.courses.includes(activeCourse))
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
                                {slot.courses
                                  .filter(
                                    (slug) => !activeCourse || slug === activeCourse,
                                  )
                                  .map((slug) => {
                                    const course = SCHEDULE.find(
                                      (c) => c.courseSlug === slug,
                                    );
                                    return (
                                      <span
                                        key={slug}
                                        className={`timetable__tag timetable__tag--${course?.category}`}
                                      >
                                        {course?.shortLabel}
                                      </span>
                                    );
                                  })}
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

          {SCHEDULE.filter((c) => c.note && (!activeCourse || c.courseSlug === activeCourse)).map(
            (course) => (
              <p key={course.courseSlug} className="timetable__note">
                <span className={`timetable__tag timetable__tag--${course.category}`}>
                  {course.shortLabel}
                </span>
                <Text type="supporting">{course.note}</Text>
              </p>
            ),
          )}
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
