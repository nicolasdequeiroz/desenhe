import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {SCHEDULE, SCHEDULE_NOTES} from '../data';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/** getDay(): 0=domingo...6=sábado. Mapeia para o índice em DAYS (ou -1 se domingo). */
function todayIndex(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? -1 : jsDay - 1;
}

export function Horarios() {
  const [todayIdx, setTodayIdx] = useState(-1);

  useEffect(() => {
    setTodayIdx(todayIndex());
  }, []);

  return (
    <>
      <Seo
        title="Horários das turmas"
        description="Grade semanal de horários dos cursos de desenho e pintura da Desenhe, de segunda a sábado, manhã, tarde e noite."
        path="/horarios"
      />
      <Section
        kicker="Horários"
        title="Grade semanal de turmas"
        lead="Aulas de segunda a sábado, manhã, tarde e noite. Escolha o curso e confirme a vaga no horário que combina com a sua rotina."
      >
        <div className="schedule-list">
          {SCHEDULE.map((entry) => {
            const daysWithClass = DAYS.filter((day) =>
              entry.slots.some((s) => s.day === day),
            ).length;
            return (
              <div key={entry.courseSlug} className="schedule-card">
                <div className="schedule-card__header">
                  <Heading level={3}>
                    <Link
                      to={`/cursos/${entry.courseSlug}`}
                      className="schedule-card__title-link"
                    >
                      {entry.course}
                    </Link>
                  </Heading>
                  <span className="schedule-card__days-badge">
                    {daysWithClass}x por semana
                  </span>
                </div>

                <div className="schedule-grid">
                  {DAYS.map((day, index) => {
                    const slot = entry.slots.find((s) => s.day === day);
                    return (
                      <div
                        key={day}
                        className={`schedule-day${
                          index === todayIdx ? ' schedule-day--today' : ''
                        }`}
                      >
                        <span className="schedule-day__label">
                          {day.slice(0, 3)}
                          {index === todayIdx && (
                            <span className="schedule-day__today-dot" aria-hidden="true" />
                          )}
                        </span>
                        {slot ? (
                          <div className="schedule-day__slots">
                            {slot.times.map((t) => (
                              <span key={t} className="schedule-chip">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="schedule-day__empty">Sem aula</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {entry.note && (
                  <div className="schedule-card__note">
                    <Text type="supporting">{entry.note}</Text>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section muted>
        <div style={{maxWidth: 720, marginInline: 'auto'}} className="text-center">
          <Heading level={3}>Como funciona o calendário</Heading>
          <ul
            style={{
              margin: '16px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'grid',
              gap: 8,
              textAlign: 'center',
            }}
          >
            {SCHEDULE_NOTES.map((note) => (
              <li key={note.slice(0, 24)}>
                <Text
                  color="secondary"
                  display="block"
                  style={{textWrap: 'balance'}}
                >
                  {note}
                </Text>
              </li>
            ))}
          </ul>
          <div style={{marginTop: 24}}>
            <WhatsCta
              message="Olá! Gostaria de confirmar a disponibilidade de vagas nos horários da Desenhe."
              label="Confirmar vagas pelo WhatsApp"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
