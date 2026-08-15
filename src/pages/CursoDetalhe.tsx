import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
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
import {CourseGallery} from '../components/CourseGallery';
import {useWorkLightbox} from '../components/WorkLightbox';
import {WhatsCta} from '../components/WhatsCta';
import {
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

/**
 * Progresso (0 a 1) de rolagem por dentro de um elemento: 0 quando o topo
 * dele encosta na base da viewport, 1 quando a base dele encosta no topo.
 * Usado para o rastro colorido que cresce dentro da linha do tempo.
 */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const value = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return [ref, progress] as const;
}

/**
 * "Sticky" manual: o header da linha do tempo precisa grudar no topo
 * enquanto a lista de módulos, ao lado, rola. `position: sticky` não
 * funciona aqui porque o `.site-shell` (ver RootLayout.tsx) usa
 * `overflow: hidden` para recortar os cantos arredondados e para o efeito de
 * gaveta do rodapé, o que impede qualquer sticky nativo dentro dele. O
 * wrapper (`boundsRef`) fica no fluxo normal, esticado pela grid até a
 * altura da lista de módulos; o conteúdo (`innerRef`) alterna entre estático
 * (antes de alcançar o topo), fixo (colado no topo enquanto o wrapper ainda
 * "sobra" espaço abaixo) e absoluto no fim do wrapper (parado quando a lista
 * termina), replicando sticky com um fallback para o fim do contêiner.
 */
function useStickyColumn<B extends HTMLElement, I extends HTMLElement>(
  topOffset: number,
) {
  const boundsRef = useRef<B>(null);
  const innerRef = useRef<I>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const bounds = boundsRef.current;
    const inner = innerRef.current;
    if (!bounds || !inner) return;

    let frame = 0;
    const update = () => {
      // Abaixo de 760px a grid empilha em 1 coluna (ver media query no CSS):
      // o header some do "bounds" wrapper e volta ao fluxo normal.
      if (window.innerWidth <= 760) {
        setStyle({});
        return;
      }

      const boundsRect = bounds.getBoundingClientRect();
      const innerHeight = inner.offsetHeight;

      if (boundsRect.top > topOffset) {
        setStyle({});
      } else if (boundsRect.bottom < topOffset + innerHeight) {
        setStyle({position: 'absolute', bottom: 0, left: 0, width: '100%'});
      } else {
        setStyle({
          position: 'fixed',
          top: topOffset,
          left: boundsRect.left,
          width: boundsRect.width,
        });
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [topOffset]);

  return {boundsRef, innerRef, style};
}

/** Página de detalhe de curso: descrição, módulos, horários, preço e CTA. */
export function CursoDetalhe({slug}: {slug: string}) {
  const course = getCourse(slug);
  const pricing = PRICING.find((t) => t.id === course.pricingTier);
  const schedule = SCHEDULE.find((s) => s.courseSlug === course.slug);
  const weeklyRows = schedule ? weeklyRowsForCourse(schedule) : [];
  const enrollMessage = `Olá! Tenho interesse no curso de ${course.shortTitle} e gostaria de mais informações.`;
  const [timelineRef, timelineProgress] = useScrollProgress<HTMLOListElement>();
  const stickyHeader = useStickyColumn<HTMLDivElement, HTMLDivElement>(96);

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
              <span className="course-deck__eyebrow">
                {course.shortTitle}
                {course.featuredSubtitle ? `: ${course.featuredSubtitle}` : ''}
              </span>
              <Heading level={1}>{course.tagline}</Heading>
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

      <div className="container course-intro">
        <div className="prose course-intro__prose">
          {course.description.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

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
                      <Text>{item}</Text>
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

      <section
        className={`section section--muted course-timeline course-timeline--${course.category}`}
      >
        <div className="container course-timeline__layout">
          {/*
            "Sticky" manual (ver useStickyColumn): o wrapper abaixo fica no
            fluxo normal da grid, esticado até a altura da lista de módulos;
            o header dentro dele é quem recebe a posição calculada.
          */}
          <div className="course-timeline__header-bounds" ref={stickyHeader.boundsRef}>
            <div
              className="course-timeline__header"
              ref={stickyHeader.innerRef}
              style={stickyHeader.style}
            >
              <span className="section__eyebrow">Conteúdo</span>
              <Heading level={2}>Como o curso é estruturado</Heading>
              <Text as="p" color="secondary">
                Ensino individualizado: os cronogramas são adaptáveis e
                personalizados para alinhar com os objetivos e interesses de
                cada aluno, seja iniciante ou avançado.
              </Text>
            </div>
          </div>

          {/*
            Trilha central: fica numa coluna própria, exatamente entre as
            outras duas (que têm a mesma largura, 1fr cada), então cai no
            centro horizontal do .container, o mesmo eixo em que a logo
            DESENHE do header se centraliza. Um rastro colorido cresce dentro
            dela conforme a lista de módulos é rolada (ver useScrollProgress).
          */}
          <div className="course-timeline__track" aria-hidden="true">
            <div
              className="course-timeline__track-fill"
              style={{height: `${timelineProgress * 100}%`}}
            />
          </div>

          <ol className="course-timeline__list" ref={timelineRef}>
            {course.modules.map((mod, i) => {
              const Icon = MODULE_ICONS[i % MODULE_ICONS.length];
              return (
                <li key={mod.title} className="course-timeline__item">
                  <div className="course-timeline__meta">
                    <Icon
                      size={20}
                      weight="light"
                      className="course-timeline__icon"
                    />
                    <span className="course-timeline__label">{mod.title}</span>
                  </div>
                  <Heading level={3} className="course-timeline__heading">
                    {mod.heading}
                  </Heading>
                  <Text color="secondary">{mod.description}</Text>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

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
    </div>
  );
}
