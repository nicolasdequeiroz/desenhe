import type {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {
  Camera,
  Chalkboard,
  ChatCircleText,
  ClipboardText,
  Hammer,
  MapPin,
  Notebook,
  PaintBrush,
  PresentationChart,
  SquaresFour,
  UsersThree,
} from '@phosphor-icons/react';
import {Button} from '../ui';
import {Seo} from '../components/Seo';
import {JsonLd} from '../components/JsonLd';
import type {Fact} from '../components/FactsSummary';
import {InCompanyFacts} from '../components/InCompanyFacts';
import {FaqItem} from '../components/FaqItem';
import {NoteGrid, type Note} from '../components/NoteGrid';
import {Timeline} from '../components/Timeline';
import {InCompanyForm} from '../components/InCompanyForm';
import {InCompanyFormatCard} from '../components/InCompanyFormatCard';
import {
  IN_COMPANY_FAQ,
  IN_COMPANY_FORMATS,
  IN_COMPANY_MESSAGE,
  IN_COMPANY_STEPS,
  SITE,
  asset,
  breadcrumbSchema,
  faqSchema,
  serviceListSchema,
  whatsappLink,
} from '../data';

const HERO_FACTS: Fact[] = [
  {icon: SquaresFour, label: 'Formatos', value: '4 experiências sob medida'},
  {icon: UsersThree, label: 'Grupos', value: 'De 10 a 80 pessoas'},
  {icon: MapPin, label: 'Onde', value: 'Na empresa, no evento ou no ateliê'},
  {icon: Chalkboard, label: 'Condução', value: 'Professores da Desenhe'},
];

const WHY = [
  {
    title: 'O mérito é do método',
    text: 'Ninguém precisa ter talento: as regras do jogo garantem um resultado bonito, e o "eu não sou criativo" perde o sentido.',
  },
  {
    title: 'Sem certo nem errado',
    text: 'Sem tela em branco para defender. O grupo cria junto, e o foco fica na experiência, não no desempenho de cada um.',
  },
  {
    title: 'Conduzido por professores',
    text: 'Quem ensina desenho e pintura na Desenhe todos os dias conduz a ação, na sua empresa ou no nosso ateliê.',
  },
];

const STEP_ICONS = [ChatCircleText, Notebook, Hammer, PresentationChart, ClipboardText];

const RECEIVES: Note[] = [
  {
    icon: () => <Camera size={24} weight="light" aria-hidden="true" />,
    title: 'Registro da ação',
    text: 'Fotos da experiência para a comunicação interna, usadas com autorização dos participantes.',
  },
  {
    icon: () => <ClipboardText size={24} weight="light" aria-hidden="true" />,
    title: 'Devolutiva ao RH',
    text: 'Um resumo do que foi feito, de quantas pessoas participaram e do que foi produzido.',
  },
  {
    icon: () => <PaintBrush size={24} weight="light" aria-hidden="true" />,
    title: 'Personalização',
    text: 'Tema da empresa nos exemplos e nos materiais, e o logo nas peças quando o formato permite.',
  },
];

/** Cabeçalho de seção alinhado à esquerda, com título grande. */
function SectionHead({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="ic-head">
      <span className="section__eyebrow">{kicker}</span>
      <h2 className="heading-style-h2">{title}</h2>
      {lead && <p className="ic-head__lead text-size-large text-color-secondary">{lead}</p>}
      {children}
    </header>
  );
}

export function InCompany() {
  return (
    <div className="ic-page">
      <Seo
        rawTitle="Ações Corporativas com Arte em Curitiba | Desenhe In Company"
        description="Palestra, ações de saúde mental, dinâmicas para confraternização e workshops de arte para empresas, pela Desenhe, escola de arte em Curitiba."
        path="/in-company"
        image="/images/og/in-company.jpg"
        imageAlt="Desenhe In Company: ações de arte para empresas e equipes em Curitiba"
      />
      <JsonLd
        graph={[
          breadcrumbSchema([{name: 'In Company', path: '/in-company'}]),
          serviceListSchema(IN_COMPANY_FORMATS),
          faqSchema(IN_COMPANY_FAQ),
        ]}
      />

      <section className="hero hero--coworking hero--ic">
        <div className="hero__background" aria-hidden="true">
          <img
            src={asset('/images/in-company/hero-palestra.webp')}
            alt=""
            className="hero__background-image"
            fetchPriority="high"
          />
          <div className="hero__background-overlay" />
        </div>

        <div className="container hero__inner">
          <div className="hero__main">
            <div className="hero__bottom">
              <div className="hero__subheading">
                <div className="hero__heading">
                  <span className="section__eyebrow hero__top-eyebrow">
                    In Company · Para empresas
                  </span>
                  <h1 className="hero__title">
                    <span className="text-color-accent">Ações corporativas</span> com arte para
                    equipes e eventos
                  </h1>
                  <div className="hero__lead">
                    <p>
                      Oficinas, palestras e ações criativas conduzidas por quem
                      ensina desenho e pintura todos os dias. Para times de RH,
                      organizadores de eventos, agências e startups, na sua
                      empresa, no seu evento ou no nosso ateliê, em Curitiba.
                    </p>
                  </div>
                </div>
                <div className="hero__actions">
                  <Button label="Peça uma proposta" href="#proposta" variant="primary" size="sm" />
                  <Button label="Ver os formatos" href="#formatos" variant="secondary" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container about-facts">
        <InCompanyFacts stats={HERO_FACTS} />
      </div>

      <section id="formatos" className="section ic-section">
        <div className="container">
          <SectionHead
            kicker="Formatos"
            title="Qual a necessidade da sua empresa?"
            lead="Cada experiência responde a uma ocasião diferente. Todas tiram as pessoas do automático e funcionam com quem nunca desenhou."
          />

          {/* Mesma grade de polaroids da listagem de /cursos. */}
          <div className="course-grid ic-format-grid">
            {IN_COMPANY_FORMATS.map((format, i) => (
              <InCompanyFormatCard key={format.slug} format={format} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Cartão em marrom mais claro, para quebrar a sequência de seções escuras. */}
      <section className="ic-why">
        <div className="container">
          <div className="ic-why__card">
            <div className="ic-why__top">
              <div>
                <span className="section__eyebrow">Por que arte no trabalho</span>
                <h2 className="ic-why__title heading-style-h2">Ninguém precisa saber desenhar.</h2>
              </div>
              <p className="text-size-large text-color-secondary">
                Nossas experiências tiram as pessoas do automático por alguns
                minutos ou algumas horas. O método garante um bom resultado
                para quem nunca pegou num pincel, e o grupo volta para a
                rotina mais leve, mais conectado e com outro olhar sobre os
                próprios problemas.
              </p>
            </div>
            <ol className="ic-why__points">
              {WHY.map((item, i) => (
                <li key={item.title}>
                  <span className="ic-why__number">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Mesma linha do tempo do "Como funciona" do Coworking e do /sobre. */}
      <Timeline
        kicker="Como trabalhamos"
        title="Da conversa à devolutiva"
        lead="Você diz o objetivo, o público e a data. O resto é com a gente."
        items={IN_COMPANY_STEPS}
        icons={STEP_ICONS}
        tone="institucional"
      />

      {/* Notas com ícone em cartão, como as vantagens do Coworking. */}
      <section className="section ic-section">
        <div className="container">
          <SectionHead kicker="Depois da ação" title="O que a empresa recebe" />
          <div className="coworking-highlights">
            <NoteGrid items={RECEIVES} columns={3} />
          </div>
        </div>
      </section>

      <section className="section section--muted ic-section">
        <div className="container ic-faq">
          <SectionHead kicker="Dúvidas" title="Perguntas frequentes">
            <p className="ic-head__lead text-size-regular text-color-secondary">
              Não achou a sua? Chame no{' '}
              <a href={whatsappLink(IN_COMPANY_MESSAGE)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
          </SectionHead>
          <div className="coworking-faq">
            {IN_COMPANY_FAQ.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      <section id="proposta" className="section ic-section">
        <div className="container">
          <div className="ic-contact">
            <div className="ic-contact__copy">
              <span className="section__eyebrow">Peça sua proposta</span>
              <h2 className="heading-style-h3">
                Escolha o formato. A gente cuida do resto.
              </h2>
              <p className="ic-head__lead text-size-large text-color-secondary">
                Cada ação é montada sob medida. Conte o que você precisa e
                enviamos uma proposta.
              </p>

              <dl className="ic-contact__details">
                <div>
                  <dt>WhatsApp</dt>
                  <dd>
                    <a href={whatsappLink(IN_COMPANY_MESSAGE)} target="_blank" rel="noopener noreferrer">
                      {SITE.whatsappDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Ateliê</dt>
                  <dd>
                    {SITE.address.street}, {SITE.address.neighborhood}, {SITE.address.city}
                  </dd>
                </div>
              </dl>

              <p className="ic-contact__aside">
                Procura um espaço só para criar? Conheça o{' '}
                <Link to="/coworking-artistico">coworking artístico</Link>.
              </p>
            </div>

            <InCompanyForm />
          </div>
        </div>
      </section>
    </div>
  );
}
