import {useEffect, useRef, useState, type RefObject} from 'react';
import {
  CalendarCheck,
  ChatCircleText,
  Clock,
  DoorOpen,
  MapPin,
  Sun,
  SpeakerSimpleSlash,
  UsersThree,
  type Icon,
} from '@phosphor-icons/react';
import {Button, Card, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {NoteGrid} from '../components/NoteGrid';
import {Timeline, type TimelineItem} from '../components/Timeline';
import {WhatsCta} from '../components/WhatsCta';
import {WorksArc} from '../components/WorksArc';
import {SITE, asset} from '../data';

const MESSAGE = 'Olá! Quero reservar uma sala no coworking artístico da Desenhe.';

const FACTS: {icon: Icon; title: string; items: string[]}[] = [
  {
    icon: Clock,
    title: 'Reserva',
    items: ['Mínimo de 2 horas por reserva'],
  },
  {
    icon: UsersThree,
    title: 'Capacidade',
    items: ['Até 3 pessoas na mesma sala'],
  },
  {
    icon: CalendarCheck,
    title: 'Horários',
    items: ['Consulte pelo WhatsApp'],
  },
  {
    icon: MapPin,
    title: 'Onde',
    items: [`${SITE.address.street}, ${SITE.address.neighborhood}, ${SITE.address.city}`],
  },
];

const HIGHLIGHTS = [
  {
    icon: () => <Sun size={24} weight="light" aria-hidden="true" />,
    title: 'Infraestrutura pronta',
    text: 'Cavaletes de mesa, mesas de desenho e boa iluminação natural, sem precisar montar nada.',
  },
  {
    icon: () => <SpeakerSimpleSlash size={24} weight="light" aria-hidden="true" />,
    title: 'Silêncio e foco',
    text: 'Um espaço pensado pra concentração, longe das distrações de casa.',
  },
  {
    icon: () => <Clock size={24} weight="light" aria-hidden="true" />,
    title: 'Flexibilidade de horário',
    text: 'Reserve por hora ou feche um pacote mensal, do jeito que encaixa na sua rotina.',
  },
];

interface PricingRow {
  id: string;
  title: string;
  subtitle: string;
  avulso: string;
  pacote: string;
  pacoteNote: string;
}

const PRICING_ROWS: PricingRow[] = [
  {
    id: 'matriculado',
    title: 'Aluno matriculado',
    subtitle: 'Quem já estuda na Desenhe',
    avulso: 'R$ 20',
    pacote: 'R$ 70',
    pacoteNote: 'R$ 17,50/h no pacote de 4h mensais',
  },
  {
    id: 'nao-matriculado',
    title: 'Não matriculado',
    subtitle: 'Quem quer conhecer o espaço',
    avulso: 'R$ 35',
    pacote: 'R$ 120',
    pacoteNote: 'R$ 30/h no pacote de 4h mensais',
  },
];

const PRICING_NOTES = [
  {
    title: 'Mais de uma pessoa',
    text: 'A sala pode ser compartilhada por até 3 pessoas. Cada pessoa além da primeira tem um valor adicional por hora: consulte pelo WhatsApp.',
  },
  {
    title: 'O que está incluso',
    text: 'Godê, paleta de vidro, cavaletes de mesa, toalhas de papel, mesas de desenho, suporte de mesa para celular e pia para limpeza.',
  },
  {
    title: 'Sobre os materiais',
    text: 'Materiais de consumo (tintas e outros itens de uso das aulas) não estão inclusos: traga os seus. A sala deve ser devolvida limpa.',
  },
];

const STEPS: TimelineItem[] = [
  {
    label: 'Passo 1',
    heading: 'Chame no WhatsApp',
    description: 'Diga o dia e o horário que você quer usar a sala.',
  },
  {
    label: 'Passo 2',
    heading: 'Confirme sua reserva',
    description:
      'A gente responde rapidinho com a disponibilidade e envia o link de pagamento pra garantir seu horário.',
  },
  {
    label: 'Passo 3',
    heading: 'Chegue e crie',
    description: 'A sala está pronta pra você, com tudo no lugar.',
  },
];

const STEP_ICONS = [ChatCircleText, CalendarCheck, DoorOpen];

/** Fotos da infraestrutura da escola, para o arco em "Sinta o espaço". */
const SPACE_PHOTOS = [
  '/images/espaco/sala-01-mesas.webp',
  '/images/espaco/sala-02.webp',
  '/images/espaco/atelie-galeria.webp',
  '/images/espaco/sala-03.webp',
  '/images/espaco/biblioteca.webp',
  '/images/espaco/sala-01-parede.webp',
  '/images/espaco/cozinha.webp',
];

/**
 * Se o fundo em vídeo pode rodar: só falta o modo "menos movimento" do
 * usuário, já que aqui (ao contrário do vídeo mobile da home) ele substitui
 * a foto em qualquer largura de tela.
 */
function useHeroVideo(): boolean {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!calm.matches);
    update();
    calm.addEventListener('change', update);
    return () => calm.removeEventListener('change', update);
  }, []);

  return enabled;
}

/** Velocidade do vídeo, nos dois sentidos: câmera lenta, metade do tempo real. */
const VIDEO_RATE = 0.5;

/**
 * Vídeo "bumerangue": toca pra frente e, ao chegar no fim, volta de trás
 * pra frente até o início antes de tocar de novo, em vez do corte seco do
 * `loop` nativo. O <video> não suporta `playbackRate` negativo, então a
 * volta é simulada: o vídeo é pausado e cada quadro de animação recua
 * `currentTime` proporcionalmente ao tempo real decorrido (na mesma
 * velocidade da ida, `VIDEO_RATE`).
 */
function useBoomerangVideo(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let frame = 0;
    let reversing = false;
    let lastTime: number | null = null;

    const play = () => {
      video.playbackRate = VIDEO_RATE;
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {});
      }
    };

    const stepReverse = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = ((time - lastTime) / 1000) * VIDEO_RATE;
      lastTime = time;

      video.currentTime = Math.max(0, video.currentTime - dt);

      if (video.currentTime <= 0) {
        reversing = false;
        lastTime = null;
        play();
        return;
      }
      frame = requestAnimationFrame(stepReverse);
    };

    const onEnded = () => {
      reversing = true;
      lastTime = null;
      frame = requestAnimationFrame(stepReverse);
    };

    video.muted = true;
    video.defaultMuted = true;
    video.loop = false;

    play();
    video.addEventListener('ended', onEnded);

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (!reversing) play();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [ref]);
}

function HeroBackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useBoomerangVideo(ref);

  return (
    <video
      ref={ref}
      className="hero__background-video"
      autoPlay
      muted
      playsInline
      preload="auto"
      poster={asset('/images/espaco/sala-01-mesas.webp')}
    >
      <source src={asset('/videos/fundo-coworking.mp4')} type="video/mp4" />
    </video>
  );
}

/**
 * Item de FAQ com painel animado: a altura interpola via `grid-template-rows`
 * (0fr a 1fr) em vez do corte seco do `<details>` nativo, a mesma técnica do
 * accordion mobile das linguagens de curso (ver StrandAccordions.tsx).
 */
function FaqItem({question, answer}: {question: string; answer: string}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`coworking-faq__item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="coworking-faq__summary"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {question}
        <span className="coworking-faq__icon" aria-hidden="true" />
      </button>
      <div className="coworking-faq__panel">
        <div className="coworking-faq__panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

const FAQ = [
  {
    question: 'Preciso trazer meu próprio material?',
    answer:
      'Sim. A sala oferece suportes como godê, paleta de vidro, cavaletes de mesa e mesas de desenho, mas materiais de consumo (tintas e outros itens de uso das aulas) não estão inclusos: traga os seus.',
  },
  {
    question: 'Posso reservar em qualquer horário?',
    answer:
      'A sala fica disponível fora dos horários de aula e do intervalo de almoço. Confirme a disponibilidade direto pelo WhatsApp.',
  },
  {
    question: 'Como funciona o pacote mensal?',
    answer:
      'São 4 horas para usar ao longo do mês, no horário que você quiser, sujeitas à disponibilidade da sala.',
  },
  {
    question: 'Alunos matriculados têm prioridade?',
    answer:
      'Sim, alunos ativos têm valor especial e preferência de horário na agenda.',
  },
  {
    question: 'Posso usar a sala com meu professor particular, ou pra dar aula?',
    answer:
      'Não. O espaço é destinado à prática livre e individual de artistas: não é permitido usar a sala pra ministrar aulas, cursos ou oficinas com professores ou instrutores externos à Desenhe, remunerados ou não.',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'Ao confirmar a disponibilidade, enviamos um link de pagamento. A reserva é garantida com o pagamento antecipado.',
  },
];

export function CoworkingArtistico() {
  const heroVideo = useHeroVideo();

  return (
    <div className="coworking-page">
      <Seo
        title="Coworking Artístico: Aluguel de Ateliê por Hora"
        description="Alugue por hora um ateliê equipado em Curitiba: cavaletes, mesas de desenho e luz natural. Reserva mínima de 2h, valores especiais para alunos matriculados."
        path="/coworking-artistico"
      />

      {/*
        Primeira dobra no mesmo formato do /sobre, só que com vídeo em vez de
        foto: a gravação sangra no bloco inteiro e o header sobrevoa a seção
        (ver `overlay` em SiteHeader). "Menos movimento" cai de volta pro
        quadro estático.
      */}
      <section className="hero hero--coworking">
        <div className="hero__background" aria-hidden="true">
          {heroVideo ? (
            <HeroBackgroundVideo />
          ) : (
            <img
              src={asset('/images/espaco/sala-01-mesas.webp')}
              alt=""
              className="hero__background-image"
            />
          )}
          <div className="hero__background-overlay" />
        </div>

        <div className="container hero__inner">
          <div className="hero__main">
            <div className="hero__bottom">
              <div className="hero__subheading">
                <div className="hero__heading">
                  <span className="section__eyebrow hero__top-eyebrow">Novidade em Curitiba</span>
                  <h1 className="hero__title">Coworking Artístico</h1>
                  <div className="hero__lead">
                    <p>
                      Um espaço só seu para criar, no seu ritmo. Alugue nosso
                      ateliê por hora em Curitiba e tenha luz natural,
                      estrutura completa e silêncio para dar forma às suas
                      ideias, sem compromisso de longo prazo.
                    </p>
                  </div>
                </div>
                <div className="hero__actions">
                  <WhatsCta message={MESSAGE} label="Quero reservar" size="sm" />
                  <Button label="Ver valores" href="#precos" variant="secondary" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container about-facts">
        <dl className="course-summary">
          {FACTS.map(({icon: Icon, title, items}) => (
            <div className="course-summary__row" key={title}>
              <dt className="course-summary__term">
                <Icon
                  size={18}
                  weight="light"
                  className="course-summary__icon"
                  aria-hidden="true"
                />
                {title}
              </dt>
              <dd className="course-summary__detail">
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Section>
        <div className="coworking-highlights">
          <NoteGrid eyebrow="Vantagens" items={HIGHLIGHTS} columns={3} />
        </div>
      </Section>

      <Section
        id="precos"
        kicker="Investimento"
        title="Escolha como reservar"
        lead="Alugue avulso por hora ou feche um pacote mensal de 4 horas. Alunos matriculados têm valor especial."
        muted
      >
        <div className="pricing-grid">
          {PRICING_ROWS.map((row) => (
            <Card key={row.id} padding={6} className="pricing-card">
              <div className="pricing-card__head">
                <Heading level={3}>{row.title}</Heading>
                <Text type="supporting" display="block">
                  {row.subtitle}
                </Text>
              </div>

              <dl className="pricing-first__prices">
                <div className="pricing-first__price-row">
                  <dt className="pricing-first__hours">Avulso (hora)</dt>
                  <dd className="pricing-first__price">{row.avulso}</dd>
                </div>
                <div className="pricing-first__price-row">
                  <dt className="pricing-first__hours">Pacote mensal (4h)</dt>
                  <dd className="pricing-first__price">{row.pacote}</dd>
                </div>
              </dl>
              <Text type="supporting" display="block">
                {row.pacoteNote}
              </Text>

              <div className="pricing-card__cta">
                <WhatsCta
                  message={`Olá! Quero reservar uma sala no coworking artístico da Desenhe (${row.title.toLowerCase()}).`}
                  label="Quero reservar"
                  size="sm"
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="pricing-notes">
          <NoteGrid eyebrow="Antes de reservar" items={PRICING_NOTES} columns={3} />
        </div>
      </Section>

      <Timeline
        kicker="Como funciona"
        title="É bem simples!"
        lead="Três passos entre chamar no WhatsApp e se sentar pra desenhar."
        items={STEPS}
        icons={STEP_ICONS}
        tone="institucional"
      />

      {/*
        Mesmo formato do rio de trabalhos em /sobre (ver WorksArc.tsx), só que
        com fotos da infraestrutura em vez de trabalhos de alunos: dá pra
        sentir o espaço sem sair da página, antes de decidir pela visita.
      */}
      <section className="works-arc-section">
        <div className="container">
          <div className="works-arc-section__head">
            <span className="section__eyebrow">Conheça a Desenhe</span>
            <Heading level={2}>Sinta o espaço antes de decidir</Heading>
            <Text as="p" type="large" color="secondary">
              Alugar a sala é uma ótima forma de sentir o espaço antes de
              decidir se quer estudar com a gente. Se depois disso você
              quiser entrar de vez, é só perguntar sobre nossas turmas: vai
              ser um prazer te receber.
            </Text>
            <div className="about-actions">
              <Button label="Conhecer as turmas da Desenhe" href="/cursos" size="sm" />
            </div>
          </div>
        </div>

        <WorksArc images={SPACE_PHOTOS} caption="Espaço da Desenhe" />
      </section>

      <Section kicker="Dúvidas" title="Perguntas frequentes">
        <div className="coworking-faq">
          {FAQ.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </Section>

      <section className="course-cta course-cta--institucional">
        <div className="container course-cta__inner">
          <div className="course-cta__copy">
            <span className="course-cta__eyebrow">Vagas por horário, sujeitas à agenda</span>
            <Heading level={2} className="course-cta__headline">
              Pronto pra reservar seu horário?
            </Heading>
            <Text
              type="large"
              color="inherit"
              display="block"
              className="course-cta__lead"
            >
              Fale com a gente e garanta seu espaço.
            </Text>
            <div className="course-cta__action about-actions" style={{justifyContent: 'flex-start'}}>
              <WhatsCta message={MESSAGE} label="Falar no WhatsApp" size="sm" variant="secondary" />
              <Button
                label="Como chegar"
                variant="secondary"
                size="sm"
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
