import {Link} from 'react-router-dom';
import {Badge} from '@astryxdesign/core/Badge';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Divider} from '@astryxdesign/core/Divider';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {
  PRICING,
  SCHEDULE,
  asset,
  formatBRL,
  getCourse,
} from '../data';

/** Página de detalhe de curso: descrição, módulos, horários, preço e CTA. */
export function CursoDetalhe({slug}: {slug: string}) {
  const course = getCourse(slug);
  const pricing = PRICING.find((t) => t.id === course.pricingTier);
  const schedule = SCHEDULE.find((s) => s.courseSlug === course.slug);
  const enrollMessage = `Olá! Tenho interesse no curso de ${course.shortTitle} e gostaria de mais informações.`;

  return (
    <>
      <Seo
        title={`Curso de ${course.shortTitle}`}
        description={course.excerpt}
        path={`/cursos/${course.slug}`}
        image={course.cover}
      />

      <div className="container course-hero">
        <div>
          <span className="section__kicker">Curso</span>
          <Heading level={1}>{course.title}</Heading>

          <div className="prose" style={{marginTop: 20}}>
            {course.description.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="fact-list">
            <div className="fact-list__item">
              <span className="fact-list__label">Para quem</span>
              <Text>{course.audience}</Text>
            </div>
            <div className="fact-list__item">
              <span className="fact-list__label">Duração</span>
              <Text>
                {course.classLength}
                {course.totalHours ? ` · ${course.totalHours}` : ''}
              </Text>
            </div>
            <div className="fact-list__item">
              <span className="fact-list__label">Matrículas</span>
              <Text>{course.enrollment}</Text>
            </div>
            {pricing && (
              <div className="fact-list__item">
                <span className="fact-list__label">Mensalidade</span>
                <Text>
                  A partir de {formatBRL(pricing.plans[0].monthly)}/mês ·{' '}
                  <Link to="/precos">ver planos</Link>
                </Text>
              </div>
            )}
          </div>

          {course.requiresDrawing && (
            <div style={{marginBottom: 20}}>
              <Badge
                variant="warning"
                label="Recomendado conhecimento prévio em desenho"
              />
            </div>
          )}

          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            <WhatsCta message={enrollMessage} label="Quero me matricular" size="lg" />
            <WhatsCta
              message={`Olá! Gostaria de agendar uma aula experimental de ${course.shortTitle}.`}
              label="Aula experimental"
              variant="secondary"
              size="lg"
            />
          </div>
        </div>

        <img
          src={asset(course.cover)}
          alt={`Curso de ${course.shortTitle} na Desenhe`}
        />
      </div>

      <Section kicker="Conteúdo" title="Como o curso é estruturado" muted>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {course.modules.map((mod) => (
            <div key={mod.title}>
              <Heading level={3}>{mod.title}</Heading>
              <div style={{marginTop: 8}}>
                <Text color="secondary">{mod.description}</Text>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 32}}>
          <Divider />
          <div style={{marginTop: 16}}>
            <Text type="supporting">
              Ensino individualizado: os cronogramas são adaptáveis e
              personalizados para alinhar com os objetivos e interesses de cada
              aluno, seja iniciante ou avançado.
            </Text>
          </div>
        </div>
      </Section>

      {schedule && (
        <Section kicker="Horários" title="Turmas desta modalidade">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 16,
            }}
          >
            {schedule.slots.map((slot) => (
              <div key={slot.day}>
                <Text weight="bold">{slot.day}</Text>
                <ul style={{margin: '8px 0 0', paddingLeft: 0, listStyle: 'none'}}>
                  {slot.times.map((t) => (
                    <li key={t}>
                      <Text color="secondary">{t}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {schedule.note && (
            <div style={{marginTop: 16}}>
              <Text type="supporting">{schedule.note}</Text>
            </div>
          )}
          <div style={{marginTop: 16}}>
            <Text type="supporting">
              Confirme a disponibilidade de vagas pelo WhatsApp —{' '}
              <Link to="/horarios">ver grade completa</Link>.
            </Text>
          </div>
        </Section>
      )}

      {course.gallery.length > 0 && (
        <Section
          kicker="Galeria"
          title={course.galleryCaption ?? 'Trabalhos de alunos'}
          muted
        >
          <div className="masonry">
            {course.gallery.map((img, i) => (
              <img
                key={img}
                src={asset(img)}
                alt={`${course.galleryCaption ?? course.shortTitle} — imagem ${i + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="text-center" style={{maxWidth: 560, marginInline: 'auto'}}>
          <Heading level={2}>Comece quando quiser</Heading>
          <div style={{marginTop: 12, marginBottom: 24}}>
            <Text type="large" color="secondary">
              As matrículas ficam abertas o ano todo e o curso acompanha o seu
              ritmo. Venha fazer uma aula experimental.
            </Text>
          </div>
          <WhatsCta message={enrollMessage} label="Falar com a escola" size="lg" />
        </div>
      </Section>
    </>
  );
}
