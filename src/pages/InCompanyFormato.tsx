import {Link} from 'react-router-dom';
import {
  Chalkboard,
  Clock,
  Gift,
  Lightbulb,
  MapPin,
  Megaphone,
  PresentationChart,
  Target,
  UsersThree,
  type Icon,
} from '@phosphor-icons/react';
import {Button, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {FactsSummary, type Fact} from '../components/FactsSummary';
import {FaqItem} from '../components/FaqItem';
import {NoteGrid} from '../components/NoteGrid';
import {StrandAccordions} from '../components/StrandAccordions';
import {Timeline} from '../components/Timeline';
import {WhatsCta} from '../components/WhatsCta';
import {InCompanyFormatCard} from '../components/InCompanyFormatCard';
import {IN_COMPANY_FORMATS, asset, whatsappLink} from '../data';

const FACT_ICONS: Record<string, Icon> = {
  Duração: Clock,
  Participantes: UsersThree,
  Onde: MapPin,
  Equipe: Chalkboard,
  'Ideal para': Target,
};

const STEP_ICONS = [PresentationChart, UsersThree, Megaphone, Lightbulb];

/**
 * Página de um formato In Company, dirigida por `slug` como o CursoDetalhe.
 * Formatos sem `page` nos dados aparecem só como card no hub /in-company.
 */
export function InCompanyFormato({slug}: {slug: string}) {
  const format = IN_COMPANY_FORMATS.find((f) => f.slug === slug);
  const page = format?.page;
  if (!format || !page) return null;

  // Etapas com `label` são variantes do formato (bloco ou estação), não um
  // cronograma: viram os cards de "linguagens" das páginas de curso em vez
  // da linha do tempo.
  const options = page.steps.every((step) => step.label);
  // Resumo do formato: os três dados curtos do card mais os detalhes da página.
  const facts: Fact[] = [...format.facts, ...page.details].map(({label, value}) => ({
    icon: FACT_ICONS[label] ?? Gift,
    label,
    value,
  }));
  const others = IN_COMPANY_FORMATS.filter((f) => f.slug !== slug);

  return (
    <div className="ic-page">
      <Seo title={page.seoTitle} description={page.seoDescription} path={`/in-company/${slug}`} />

      {/*
        Primeira dobra no formato das páginas de curso (faixa colorida com um
        baralho de fotos vazando pela borda), para a página do formato não
        repetir o hero com foto de fundo do hub /in-company.
      */}
      <section className="course-deck course-deck--institucional ic-deck">
        <div className="container">
          <div className="course-deck__header">
            <div className="course-deck__heading">
              <span className="course-deck__eyebrow">
                <Link to="/in-company" className="ic-crumb">
                  In Company
                </Link>{' '}
                · {page.kicker}
              </span>
              <Heading level={1}>{format.title}</Heading>
            </div>
            <div className="ic-deck__aside">
              <p className="course-deck__lead">{page.lead}</p>
              <div className="ic-deck__actions">
                <WhatsCta message={page.message} label="Peça uma proposta" size="sm" variant="secondary" />
                <Button label="Como acontece" href="#como-acontece" variant="ghost" size="sm" />
              </div>
            </div>
          </div>

          <div className="course-deck__cards" aria-hidden="true">
            {/* Mesma trilha duplicada das páginas de curso: no mobile vira
                marquee infinita; no desktop só as 4 primeiras aparecem. */}
            <div className="course-deck__track">
              {page.deck.map((img, i) => (
                <div key={img} className={`course-deck__card course-deck__card--${i + 1}`}>
                  <img src={asset(img)} alt="" />
                </div>
              ))}
              <div className="course-deck__track-duplicate">
                {page.deck.map((img, i) => (
                  <div
                    key={`dup-${img}`}
                    className={`course-deck__card course-deck__card--${i + 1} course-deck__card--duplicate`}
                  >
                    <img src={asset(img)} alt="" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        Mesmo bloco de abertura das páginas de curso (.course-intro): a
        descrição com o convite para tirar dúvidas ao lado, as variantes do
        formato quando há mais de uma, e o resumo em fatos.
      */}
      <div className="container course-intro">
        <div className="course-intro__top">
          <div className="prose course-intro__prose">
            {page.description.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <aside className="course-intro__aside">
            <span className="course-intro__label">Ainda em dúvida?</span>
            <Text as="p" type="supporting">
              Conte a data, o tamanho do grupo e o objetivo, e a gente indica o
              melhor jeito de levar {format.title.toLowerCase()} para a sua equipe.
            </Text>
            <WhatsCta message={page.message} label="Fale com a gente" size="sm" variant="secondary" />
          </aside>
        </div>

        {options && (
          <div className="course-intro__block" id="como-acontece">
            <span className="course-intro__label">{page.stepsTitle}</span>
            <StrandAccordions
              prefix=""
              strands={page.steps.map((step) => ({
                name: `${step.label} · ${step.time}`,
                description: `${step.title}. ${step.text}`,
              }))}
            />
          </div>
        )}

        <div className="course-intro__block">
          <span className="course-intro__label">Resumo do formato</span>
          <FactsSummary items={facts} />
        </div>
      </div>

      {/* Cronograma na mesma linha do tempo dos módulos de curso. */}
      {!options && (
        <Timeline
          id="como-acontece"
          kicker="Como acontece"
          title={page.stepsTitle}
          lead={page.stepsLead ?? ''}
          items={page.steps.map((step) => ({
            label: step.time,
            heading: step.title,
            description: step.text,
          }))}
          icons={STEP_ICONS}
          tone="institucional"
        />
      )}

      <section className="section section--muted ic-section">
        <div className="container">
          <header className="ic-head">
            <span className="section__eyebrow">Antes da ação</span>
            <h2 className="heading-style-h2">Como preparamos</h2>
          </header>
          <div className="coworking-highlights">
            <NoteGrid items={page.prepare} columns={3} />
          </div>
        </div>
      </section>

      <section className="section ic-section">
        <div className="container ic-faq">
          <header className="ic-head">
            <span className="section__eyebrow">Dúvidas</span>
            <h2 className="heading-style-h2">Perguntas frequentes</h2>
            <p className="ic-head__lead text-size-regular text-color-secondary">
              Mais respostas em <Link to="/in-company">In Company</Link>, ou
              chame no{' '}
              <a href={whatsappLink(page.message)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
          </header>
          <div className="coworking-faq">
            {page.faq.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted ic-section">
        <div className="container">
          <header className="ic-head">
            <span className="section__eyebrow">Outros formatos</span>
            <h2 className="heading-style-h2">Conheça também</h2>
          </header>
          <div className="course-grid">
            {others.map((other) => (
              <InCompanyFormatCard key={other.slug} format={other} />
            ))}
          </div>
        </div>
      </section>

      <section className="course-cta course-cta--institucional">
        <div className="container course-cta__inner">
          <div className="course-cta__copy">
            <span className="course-cta__eyebrow">Proposta sob medida</span>
            <Heading level={2} className="course-cta__headline">
              Vamos montar a sua ação?
            </Heading>
            <Text type="large" color="inherit" display="block" className="course-cta__lead">
              Conte a data, o tamanho do grupo e o objetivo, e enviamos uma proposta.
            </Text>
            <div className="course-cta__action about-actions" style={{justifyContent: 'flex-start'}}>
              <WhatsCta message={page.message} label="Peça uma proposta" size="sm" variant="secondary" />
              <Button label="Todos os formatos" variant="secondary" size="sm" href="/in-company" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
