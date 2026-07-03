import {Link} from 'react-router-dom';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {SCHEDULE, SCHEDULE_NOTES} from '../data';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function Horarios() {
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
        <div style={{display: 'grid', gap: 40}}>
          {SCHEDULE.map((entry) => (
            <div key={entry.courseSlug}>
              <Heading level={3}>
                <Link
                  to={`/cursos/${entry.courseSlug}`}
                  style={{color: 'inherit', textDecoration: 'none'}}
                >
                  {entry.course}
                </Link>
              </Heading>
              <div
                style={{
                  marginTop: 16,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 16,
                }}
              >
                {DAYS.map((day) => {
                  const slot = entry.slots.find((s) => s.day === day);
                  return (
                    <div key={day}>
                      <Text weight="bold" display="block">
                        {day}
                      </Text>
                      {slot ? (
                        <ul
                          style={{
                            margin: '6px 0 0',
                            padding: 0,
                            listStyle: 'none',
                            display: 'grid',
                            gap: 4,
                          }}
                        >
                          {slot.times.map((t) => (
                            <li key={t}>
                              <Text color="secondary">{t}</Text>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text type="supporting">—</Text>
                      )}
                    </div>
                  );
                })}
              </div>
              {entry.note && (
                <div style={{marginTop: 12}}>
                  <Text type="supporting">{entry.note}</Text>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <div style={{maxWidth: 720}}>
          <Heading level={3}>Como funciona o calendário</Heading>
          <ul style={{margin: '16px 0 0', paddingLeft: 20, display: 'grid', gap: 8}}>
            {SCHEDULE_NOTES.map((note) => (
              <li key={note.slice(0, 24)}>
                <Text color="secondary">{note}</Text>
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
