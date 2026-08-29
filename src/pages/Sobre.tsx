import {
  CalendarCheck,
  ChatCircleText,
  Compass,
  Eye,
  MapPin,
  PencilSimple,
  UsersThree,
} from '@phosphor-icons/react';
import {Button, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {NoteGrid, type Note} from '../components/NoteGrid';
import {Timeline, type TimelineItem} from '../components/Timeline';
import {WorksArc} from '../components/WorksArc';
import {TestimonialsSection} from '../components/TestimonialsSection';
import {WhatsCta} from '../components/WhatsCta';
import {SITE, asset} from '../data';

/** Índice da página: âncoras para as seções, logo abaixo da primeira dobra. */
const INDEX = [
  {href: '#principios', label: 'Princípios'},
  {href: '#percurso', label: 'Percurso do aluno'},
  {href: '#espaco', label: 'Nosso espaço'},
];

/**
 * Os fatos que valem para a escola inteira, e que se repetem em /cursos,
 * /precos e nas páginas de curso. Aqui eles aparecem juntos, uma vez só.
 */
const FATOS = [
  {
    icon: UsersThree,
    title: 'Turmas pequenas',
    items: ['No máximo 8 alunos por turma', 'Crianças, adolescentes e adultos'],
  },
  {
    icon: Compass,
    title: 'Ensino individualizado',
    items: ['Cronograma adaptado a cada aluno', 'Do iniciante ao avançado'],
  },
  {
    icon: CalendarCheck,
    title: 'O ano todo',
    items: ['Matrículas abertas de janeiro a dezembro', '4 semanas de aula por mês'],
  },
  {
    icon: MapPin,
    title: 'Presencial ou online ao vivo',
    items: [
      `No espaço da escola, na ${SITE.address.neighborhood}, em Curitiba`,
      'Ou online ao vivo, junto com a turma na sala e o professor por videochamada',
    ],
  },
];

const PRINCIPIOS: Note[] = [
  {
    title: 'Técnica e criatividade crescem no mesmo trabalho',
    text: 'O ensino das técnicas do desenho artístico, aliado ao desenvolvimento criativo, são os alicerces da arte de alto nível. Uma coisa não vem antes da outra: elas crescem no mesmo trabalho.',
  },
  {
    title: 'Formação ou hobby, com evolução constante',
    text: 'O curso serve tanto para quem quer uma formação quanto para quem desenha por prazer. Em qualquer caso, o compromisso é o mesmo: aulas regulares e desenvolvimento contínuo, com técnica, repertório e critério próprio crescendo a cada encontro.',
  },
  {
    title: 'Quem ensina aqui também vive de produzir arte',
    text: 'A equipe é formada por artistas-professores que fazem uma leitura crítica do seu trabalho a cada encontro, com o rigor de quem ensina e a experiência de quem produz fora da sala de aula.',
  },
];

const PERCURSO: TimelineItem[] = [
  {
    label: 'Etapa 1',
    heading: 'Uma conversa antes de tudo',
    description:
      'Cada matrícula começa com uma conversa sobre o seu nível, seus interesses e onde você quer chegar. Dá para começar pela primeira aula (experimental), sem compromisso com o curso inteiro.',
  },
  {
    label: 'Etapa 2',
    heading: 'Um plano de estudos sob medida',
    description:
      'A partir dessa conversa, o conteúdo e o ritmo são ajustados à sua trajetória. Você não entra numa turma padrão com um cronograma fixo: entra num plano pensado para o seu momento como artista.',
  },
  {
    label: 'Etapa 3',
    heading: 'Prática acompanhada de perto',
    description:
      'Os resultados vêm da prática, e em turmas de no máximo 8 alunos o professor acompanha cada trabalho enquanto ele acontece, corrigindo o traço e ampliando o repertório de materiais.',
  },
  {
    label: 'Etapa 4',
    heading: 'O trabalho que é só seu',
    description:
      'Com a base consolidada, a técnica passa a servir à sua expressão autoral. É aqui que o curso deixa de ser sobre aprender a desenhar e passa a ser sobre o que você tem para dizer.',
  },
];

/** Um ambiente por card: a grade fecha em duas linhas de três (ver CSS). */
const ESPACO = [
  {
    src: '/images/espaco/atelie-galeria.webp',
    alt: 'Galeria de exposições da escola',
    label: 'Galeria',
  },
  {
    src: '/images/espaco/sala-01-mesas.webp',
    alt: 'Sala de aula 01 com mesas de desenho',
    label: 'Sala 01',
  },
  {
    src: '/images/espaco/sala-02.webp',
    alt: 'Sala de aula 02',
    label: 'Sala 02',
  },
  {
    src: '/images/espaco/sala-03.webp',
    alt: 'Sala de aula 03',
    label: 'Sala 03',
  },
  {
    src: '/images/espaco/biblioteca.webp',
    alt: 'Biblioteca de arte da escola',
    label: 'Biblioteca',
  },
  {
    src: '/images/espaco/cozinha.webp',
    alt: 'Cozinha e café da escola',
    label: 'Café',
  },
];

const PERCURSO_ICONS = [ChatCircleText, Compass, PencilSimple, Eye];

/**
 * Desenhos que atravessam o arco. Saem das galerias dos próprios cursos
 * (ver courses.ts), alternando de curso em curso para o rio não passar dois
 * trabalhos da mesma técnica em seguida.
 */
const TRABALHOS = [
  '/images/cursos/desenho-artistico/galeria-1.webp',
  '/images/cursos/aquarela-guache/galeria-2.webp',
  '/images/cursos/quadrinhos/galeria-1.webp',
  '/images/cursos/pintura-oleo-acrilica/galeria-3.webp',
  '/images/trabalhos/retrato-carvao.webp',
  '/images/cursos/desenho-infantil/galeria-2.webp',
  '/images/cursos/desenho-artistico/galeria-4.webp',
  '/images/cursos/aquarela-guache/galeria-5.webp',
  '/images/trabalhos/koi.webp',
  '/images/cursos/pintura-oleo-acrilica/galeria-1.webp',
];

export function Sobre() {
  return (
    <div className="about-page">
      <Seo
        title="Sobre a escola"
        description="A Desenhe ensina desenho e pintura em Curitiba desde 1988. Conheça a história da escola fundada por Oscar Pedroso, como o ensino individualizado funciona, o nosso espaço e a equipe de professores."
        path="/sobre"
      />

      {/*
        Primeira dobra no mesmo formato da home: a foto sangra no bloco
        inteiro e o header sobrevoa a seção (ver `overlay` em SiteHeader).
      */}
      <section className="hero hero--about">
        <div className="hero__background" aria-hidden="true">
          <img
            src={asset('/images/espaco/professor-biblioteca.avif')}
            alt=""
            className="hero__background-image"
          />
          <div className="hero__background-overlay" />
        </div>

        <div className="container hero__inner">
          <div className="hero__main">
            <div className="hero__bottom">
              <div className="hero__subheading">
                <div className="hero__heading">
                  <h1 className="hero__title">
                    38 anos formando artistas em Curitiba
                  </h1>
                  <div className="hero__lead">
                    <p>
                      A Desenhe nasceu em 1988, fundada pelo professor e artista
                      Oscar Pedroso, licenciado em Educação Artística pela FAP,
                      com passagem pela Editora Abril e autor de manuais de
                      desenho para o SENAC Paraná.
                    </p>
                    <p>
                      De lá para cá, a escola manteve a mesma convicção: técnica
                      e criatividade se ensinam juntas, e ninguém aprende as duas
                      num cronograma de prateleira. Por isso o ensino é
                      individualizado, em turmas de no máximo 8 alunos, com o
                      conteúdo adaptado aos objetivos e ao ritmo de cada um.
                    </p>
                    <p>
                      Hoje somos uma equipe de artistas-professores atendendo
                      crianças, adolescentes e adultos, do primeiro traço ao
                      trabalho autoral.
                    </p>
                  </div>
                </div>
                <div className="hero__actions">
                  <WhatsCta
                    message="Olá! Quero agendar a primeira aula na Desenhe."
                    label="Agende sua primeira aula"
                    size="sm"
                  />
                  <Button
                    label="Ver cursos"
                    href="/cursos"
                    variant="secondary"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Índice: a página é longa, e daqui se chega direto a qualquer seção. */}
      <nav className="container about-index" aria-label="Nesta página">
        {INDEX.map((entry) => (
          <a key={entry.href} href={entry.href} className="about-index__link">
            {entry.label}
          </a>
        ))}
      </nav>

      {/* Mesma ficha da página de curso (.course-summary): rótulo + ícone à
          esquerda, valores à direita, fios finos. */}
      <div className="container about-facts">
        <dl className="course-summary">
          {FATOS.map(({icon: Icon, title, items}) => (
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

      <Section
        id="principios"
        kicker="No que acreditamos"
        title="O que sustenta o jeito de ensinar daqui"
        lead="Três convicções que aparecem em cada curso, da primeira aula ao trabalho autoral."
      >
        <NoteGrid items={PRINCIPIOS} />
      </Section>

      <Timeline
        id="percurso"
        kicker="Percurso"
        title="Como funciona a sua formação"
        lead="Da primeira conversa ao trabalho autoral, o caminho é o mesmo para todos os cursos: só o conteúdo e o ritmo mudam de aluno para aluno."
        items={PERCURSO}
        icons={PERCURSO_ICONS}
        tone="institucional"
        headerExtra={
          <div className="about-timeline__action">
            <Button label="Ver todos os cursos" href="/cursos" variant="secondary" size="sm" />
          </div>
        }
      />

      {/*
        Fecho da linha do tempo: ela termina em "o trabalho que é só seu", e
        logo abaixo vêm justamente os trabalhos, atravessando a página inteira.
      */}
      <section className="works-arc-section">
        <div className="container">
          <div className="works-arc-section__head">
            <span className="section__eyebrow">Trabalhos de alunos</span>
            <Heading level={2}>Foi tudo feito aqui</Heading>
            <Text as="p" type="large" color="secondary">
              Um retrato do que sai das mesas da escola, do primeiro traço ao
              trabalho autoral.
            </Text>
          </div>
        </div>
        <WorksArc images={TRABALHOS} caption="Trabalho de aluno da Desenhe" />
      </section>

      <Section
        id="espaco"
        kicker="Nosso espaço"
        title="Salas, galeria e biblioteca"
        lead={`Salas equipadas, uma galeria para expor os trabalhos dos alunos, biblioteca de arte e um café para os intervalos, no bairro ${SITE.address.neighborhood}, em Curitiba.`}
      >
        <div className="space-grid">
          {ESPACO.map((img) => (
            <figure key={img.src} className="space-grid__figure">
              <div className="space-showcase__gallery-card">
                <div className="space-showcase__gallery-badge">
                  <span>{img.label}</span>
                </div>
                <img src={asset(img.src)} alt={img.alt} loading="lazy" />
              </div>
            </figure>
          ))}
        </div>
        <div className="about-actions">
          <WhatsCta
            message="Olá! Gostaria de agendar uma visita para conhecer a Desenhe."
            label="Agendar uma visita"
          />
          <Button
            label="Como chegar"
            variant="ghost"
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </Section>

      <TestimonialsSection />

      <section className="course-cta course-cta--institucional">
        <div className="container course-cta__inner">
          <div className="course-cta__copy">
            <span className="course-cta__eyebrow">Matrículas abertas o ano todo</span>
            <Heading level={2} className="course-cta__headline">
              Venha <span className="course-cta__highlight">conhecer a escola</span>.
            </Heading>
            <Text type="large" color="inherit" display="block" className="course-cta__lead">
              Agende a primeira aula (experimental) ou uma visita à escola: é o
              jeito mais rápido de descobrir se a Desenhe é o seu lugar.
            </Text>
            <div className="course-cta__action">
              <WhatsCta
                message="Olá! Gostaria de conhecer a Desenhe e agendar a primeira aula."
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
