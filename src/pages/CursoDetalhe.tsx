import {Link} from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  CurrencyDollar,
  Users,
} from '@phosphor-icons/react';
import {Heading, Text} from '../ui';
import {Divider} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {PRICING, SCHEDULE, asset, formatBRL, getCourse} from '../data';

/** Página de detalhe de curso: descrição, módulos, horários, preço e CTA. */
export function CursoDetalhe({slug}: {slug: string}) {
  const course = getCourse(slug);
  const pricing = PRICING.find((t) => t.id === course.pricingTier);
  const schedule = SCHEDULE.find((s) => s.courseSlug === course.slug);
  const enrollMessage = `Olá! Tenho interesse no curso de ${course.shortTitle} e gostaria de mais informações.`;

  const factCards = [
    {
      icon: Users,
      title: 'Para quem',
      items: [course.audience],
    },
    {
      icon: Clock,
      title: 'Duração',
      items: [course.classLength, course.totalHours].filter(
        (item): item is string => Boolean(item),
      ),
    },
    {
      icon: CalendarCheck,
      title: 'Matrículas',
      items: [
        course.enrollment,
        course.requiresDrawing
          ? 'Recomendado conhecimento prévio em desenho'
          : null,
      ].filter((item): item is string => Boolean(item)),
    },
    {
      icon: CurrencyDollar,
      title: 'Mensalidade',
      items: pricing
        ? [`A partir de ${formatBRL(pricing.plans[0].monthly)}/mês`]
        : [],
    },
  ];

  return (
    <>
      <Seo
        title={`Curso de ${course.shortTitle}`}
        description={course.excerpt}
        path={`/cursos/${course.slug}`}
        image={course.cover}
      />

      <section className={`course-deck course-deck--${course.category}`}>
        <div className="container">
          <div className="course-deck__header">
            <div className="course-deck__heading">
              <span className="course-deck__eyebrow">
                {course.shortTitle}
                {course.featuredSubtitle ? `: ${course.featuredSubtitle}` : ''}
              </span>
              <Heading level={1}>{course.tagline}</Heading>
            </div>
            <p className="course-deck__lead">{course.excerpt}</p>
          </div>

          <div className="course-deck__cards">
            {course.gallery.slice(0, 4).map((img, i) => (
              <div key={img} className={`course-deck__card course-deck__card--${i + 1}`}>
                <img
                  src={asset(img)}
                  alt={`${course.galleryCaption ?? `Trabalhos do curso de ${course.shortTitle}`}, imagem ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container course-intro">
        <div className="prose course-intro__prose">
          {course.description.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className={`course-facts course-facts--${course.category}`}>
          {factCards.map(({icon: Icon, title, items}) => (
            <div key={title} className="course-facts__card">
              <Icon size={26} weight="light" className="course-facts__icon" />
              <div className="course-facts__title">{title}</div>
              {items.length > 0 && (
                <ul className="course-facts__list">
                  {items.map((item) => (
                    <li key={item} className="course-facts__item">
                      <span className="course-facts__bullet" aria-hidden="true" />
                      <Text>{item}</Text>
                    </li>
                  ))}
                </ul>
              )}
              {title === 'Mensalidade' && pricing && (
                <Link to="/precos" className="course-facts__link">
                  Ver planos completos →
                </Link>
              )}
            </div>
          ))}
        </div>
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
              Confirme a disponibilidade de vagas pelo WhatsApp:{' '}
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
                alt={`${course.galleryCaption ?? course.shortTitle}, imagem ${i + 1}`}
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
