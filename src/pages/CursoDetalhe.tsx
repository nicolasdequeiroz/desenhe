import {useCallback, useRef} from 'react';
import {Link} from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  Compass,
  CurrencyDollar,
  Eye,
  PaintBrush,
  PencilSimple,
  Users,
} from '@phosphor-icons/react';
import {Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {CourseCard} from '../components/CourseCard';
import {CourseGallery} from '../components/CourseGallery';
import {StrandAccordions} from '../components/StrandAccordions';
import {Timeline} from '../components/Timeline';
import {useWorkLightbox} from '../components/WorkLightbox';
import {WhatsCta} from '../components/WhatsCta';
import {
  COURSES,
  PRICING,
  SCHEDULE,
  SCHEDULE_DAYS,
  asset,
  formatBRL,
  getCourse,
  weeklyRowsForCourse,
} from '../data';

/** Ícones dos módulos, em rodízio pelo índice: não há categoria própria por módulo. */
const MODULE_ICONS = [PencilSimple, Compass, PaintBrush, Eye];

/** Página de detalhe de curso: descrição, módulos, horários, preço e CTA. */
export function CursoDetalhe({slug}: {slug: string}) {
  const course = getCourse(slug);
  const pricing = PRICING.find((t) => t.id === course.pricingTier);
  const schedule = SCHEDULE.find((s) => s.courseSlug === course.slug);
  const weeklyRows = schedule ? weeklyRowsForCourse(schedule) : [];
  const enrollMessage = `Olá! Tenho interesse no curso de ${course.shortTitle} e gostaria de mais informações.`;

  // Cursos relacionados: primeiro os da mesma categoria, completando com os
  // demais até três, para nunca deixar a faixa curta.
  const relatedCourses = [
    ...COURSES.filter(
      (c) => c.slug !== course.slug && c.category === course.category,
    ),
    ...COURSES.filter(
      (c) => c.slug !== course.slug && c.category !== course.category,
    ),
  ].slice(0, 3);

  const galleryCaption =
    course.galleryCaption ?? `Trabalhos do curso de ${course.shortTitle}`;
  // As cartas do baralho abrem o mesmo visor da galeria lá embaixo, e o
  // visitante navega dali por toda a série sem precisar rolar a página.
  const deckCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const deckLightbox = useWorkLightbox({
    images: course.gallery,
    caption: galleryCaption,
    credits: course.galleryCredits,
    getOrigin: useCallback((index: number) => deckCardRefs.current[index], []),
    onClosed: useCallback((index: number) => {
      deckCardRefs.current[index]?.focus();
    }, []),
  });

  // Cursos recém-abertos ainda não têm todos os dados (duração, valores):
  // as cartas sem conteúdo saem da faixa em vez de ficarem vazias.
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
        : (course.priceNotes ?? []),
    },
  ].filter((card) => card.items.length > 0);

  return (
    <div className={`course-page course-page--${course.category}`}>
      <Seo
        title={`Curso de ${course.shortTitle}`}
        description={course.excerpt}
        path={`/cursos/${course.slug}`}
        image={course.cover}
      />

      <section
        className={`course-deck course-deck--${course.category}${
          course.gallery.length === 0 ? ' course-deck--bare' : ''
        }`}
      >
        <div className="container">
          <div className="course-deck__header">
            <div className="course-deck__heading">
              <span className="course-deck__eyebrow">{course.shortTitle}</span>
              <Heading level={1}>{course.tagline}</Heading>
              {course.title !== course.shortTitle && (
                <p className="course-deck__formal-title">{course.title}</p>
              )}
            </div>
            <p className="course-deck__lead">{course.excerpt}</p>
          </div>

          {/* Cursos novos podem entrar no ar antes das fotos: sem galeria,
              a primeira dobra fica só com o título e a chamada. */}
          {course.gallery.length > 0 && (
          <div className="course-deck__cards">
            {/*
              Uma trilha só, com o conjunto de cartas duplicado dentro dela
              (o segundo conjunto, oculto no desktop via `display: none` por
              carta). No mobile a trilha vira uma fileira contínua de 8
              cartas e anima com translateX(-50%): como os dois conjuntos são
              idênticos, exatamente metade do percurso equivale a exatamente
              um conjunto (cartas + gaps), então o loop reinicia sem costura,
              sem depender de medir pixels. No desktop a trilha e o wrapper
              do segundo conjunto viram `display: contents`, então só as 4
              cartas reais participam do baralho estático de sempre.
            */}
            <div className="course-deck__track">
              {course.gallery.slice(0, 4).map((img, i) => (
                <button
                  key={img}
                  type="button"
                  className={`course-deck__card course-deck__card--${i + 1}`}
                  ref={(node) => {
                    deckCardRefs.current[i] = node;
                  }}
                  onClick={(event) =>
                    deckLightbox.openWork(i, event.currentTarget)
                  }
                  aria-label={`Ampliar trabalho ${i + 1}`}
                >
                  <img
                    src={asset(img)}
                    alt={`${galleryCaption}, imagem ${i + 1}`}
                  />
                </button>
              ))}
              {/*
                No marquee do mobile as cópias também são clicáveis: a carta
                que o dedo alcança pode ser qualquer uma das duas, e o voo sai
                justamente da que foi tocada (ver openWork).
              */}
              <div className="course-deck__track-duplicate" aria-hidden="true">
                {course.gallery.slice(0, 4).map((img, i) => (
                  <button
                    key={`dup-${img}`}
                    type="button"
                    tabIndex={-1}
                    className={`course-deck__card course-deck__card--${i + 1} course-deck__card--duplicate`}
                    onClick={(event) =>
                      deckLightbox.openWork(i, event.currentTarget)
                    }
                  >
                    <img src={asset(img)} alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
        {deckLightbox.lightbox}
      </section>

      {/*
        A seção é uma pilha de blocos nomeados: a descrição (com o convite
        para tirar dúvidas ao lado, preenchendo a coluna que sobrava), as
        linguagens do curso e o resumo em fatos. Cada bloco tem um rótulo
        próprio, para a leitura não virar três caixas soltas na mesma cor.
      */}
      <div className="container course-intro">
        <div className="course-intro__top">
          <div className="prose course-intro__prose">
            {course.description.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <aside className="course-intro__aside">
            <span className="course-intro__label">Ainda em dúvida?</span>
            <Text as="p" type="supporting">
              Conte para a gente o que você quer aprender e a gente indica o
              melhor caminho dentro do curso de {course.shortTitle}.
            </Text>
            {/* Ação de apoio: a conversão principal da página é o CTA do fim
                e o "Matricule-se" do header, ambos primários. */}
            <WhatsCta
              message={enrollMessage}
              label="Fale com a gente"
              size="sm"
              variant="secondary"
            />
          </aside>
        </div>

        {/*
          Curso guarda-chuva: um bloco por linguagem reunida no curso, cada
          um com título próprio (ex.: Mangá, HQ e Cartoon). Cards lado a lado
          no desktop; accordions no mobile (ver StrandAccordions).
        */}
        {course.strands && (
          <div className="course-intro__block">
            <span className="course-intro__label">
              As {course.strands.length} linguagens deste curso
            </span>
            <StrandAccordions strands={course.strands} />
          </div>
        )}

        <div className="course-intro__block">
          <span className="course-intro__label">O curso em resumo</span>
          <div
            className={`course-facts course-facts--${course.category} course-facts--cols-${factCards.length}`}
          >
            {factCards.map(({icon: Icon, title, items}) => (
              <div key={title} className="course-facts__card">
                <span className="course-facts__icon-badge">
                  <Icon size={22} weight="light" className="course-facts__icon" />
                </span>
                <div className="course-facts__title">{title}</div>
                {items.length > 0 && (
                  <ul className="course-facts__list">
                    {items.map((item) => (
                      <li key={item} className="course-facts__item">
                        <span className="course-facts__bullet" aria-hidden="true" />
                        <Text className="course-facts__value">{item}</Text>
                      </li>
                    ))}
                  </ul>
                )}
                {title === 'Mensalidade' && pricing && (
                  <Link to="/precos" className="course-facts__link">
                    Ver planos completos
                    <span className="course-facts__link-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Timeline
        kicker="Conteúdo"
        title="Como o curso é estruturado"
        lead="Ensino individualizado: os cronogramas são adaptáveis e personalizados para alinhar com os objetivos e interesses de cada aluno, seja iniciante ou avançado."
        items={course.modules.map((mod) => ({
          label: mod.title,
          heading: mod.heading,
          description: mod.description,
        }))}
        icons={MODULE_ICONS}
        tone={course.category}
      />

      {schedule && (
        <Section kicker="Horários" title="Turmas desta modalidade">
          <div className="timetable">
            <div className="timetable__scroll">
              <div className="timetable__board">
                <div className="timetable__row timetable__row--head">
                  <span className="timetable__corner" />
                  {SCHEDULE_DAYS.map((day) => (
                    <span key={day} className="timetable__day-head">
                      {day.slice(0, 3)}
                    </span>
                  ))}
                </div>

                {weeklyRows.map((row) => (
                  <div key={row.period} className="timetable__row">
                    <span className="timetable__period">{row.label}</span>
                    {row.cells.map((cell) => (
                      <div
                        key={cell.day}
                        className={`timetable__cell${
                          cell.times.length === 0 ? ' is-empty' : ''
                        }`}
                      >
                        <span className="timetable__cell-day">{cell.day}</span>
                        {cell.times.length > 0 ? (
                          cell.times.map((time) => (
                            <span key={time} className="timetable__time">
                              {time}
                            </span>
                          ))
                        ) : (
                          <span className="timetable__empty" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {schedule.note && (
            <div style={{marginTop: 16}}>
              <Text type="supporting">{schedule.note}</Text>
            </div>
          )}
          <div style={{marginTop: 24}} className="text-center">
            <WhatsCta
              message={`Olá! Gostaria de confirmar a disponibilidade de vagas no curso de ${course.shortTitle}.`}
              label="Confirmar vaga pelo WhatsApp"
              size="sm"
            />
            <div style={{marginTop: 12}}>
              <Text type="supporting">
                Ou <Link to="/horarios">veja a grade completa</Link> antes de decidir.
              </Text>
            </div>
          </div>
        </Section>
      )}

      {course.gallery.length > 0 && (
        <Section
          kicker="Galeria"
          title={course.galleryCaption ?? 'Trabalhos de alunos'}
          lead="Abra qualquer imagem para ver de perto."
          muted
        >
          <CourseGallery
            images={course.gallery}
            caption={galleryCaption}
            credits={course.galleryCredits}
          />
        </Section>
      )}

      {relatedCourses.length > 0 && (
        <Section
          kicker="Continue explorando"
          title="Cursos relacionados"
          lead="Outros caminhos para seguir dentro da escola."
          muted
        >
          <div className="course-grid">
            {relatedCourses.map((related) => (
              <CourseCard key={related.slug} course={related} />
            ))}
          </div>
        </Section>
      )}

      {/*
        Faixa final na cor da categoria do curso, como a primeira dobra:
        fecha a página no mesmo tom em que ela abriu. Layout inspirado em
        https://www.flowbase.co/preview/cycle-cta-03 (chamada grande à
        esquerda, com um trecho em destaque).
      */}
      <section className={`course-cta course-cta--${course.category}`}>
        <div className="container course-cta__inner">
          <div className="course-cta__copy">
            <span className="course-cta__eyebrow">Matrículas abertas o ano todo</span>
            <Heading level={2} className="course-cta__headline">
              Comece <span className="course-cta__highlight">quando quiser</span>.
            </Heading>
            <Text
              type="large"
              color="inherit"
              display="block"
              className="course-cta__lead"
            >
              O curso acompanha o seu ritmo, do primeiro traço à técnica
              avançada. Venha fazer a primeira aula (experimental).
            </Text>
            <div className="course-cta__action">
              <WhatsCta
                message={enrollMessage}
                label="Entre em contato"
                size="sm"
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
