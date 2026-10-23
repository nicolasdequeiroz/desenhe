import type {ReactNode} from 'react';
import {
  Camera,
  Chalkboard,
  ChatCircleText,
  ClipboardText,
  Clock,
  Hammer,
  MapPin,
  Notebook,
  PaintBrush,
  PresentationChart,
  UsersThree,
} from '@phosphor-icons/react';
import {Badge, Blockquote, Button, Card, Divider, EmptyState, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {NoteGrid, type Note} from '../components/NoteGrid';
import {FactsSummary, type Fact} from '../components/FactsSummary';
import {InCompanyFacts} from '../components/InCompanyFacts';
import {FaqItem} from '../components/FaqItem';
import {StrandAccordions} from '../components/StrandAccordions';
import {Timeline} from '../components/Timeline';
import {CourseCard} from '../components/CourseCard';
import {CourseGallery} from '../components/CourseGallery';
import {InCompanyFormatCard} from '../components/InCompanyFormatCard';
import {WhatsCta} from '../components/WhatsCta';
import {COURSES, IN_COMPANY_FORMATS, IN_COMPANY_STEPS} from '../data';

/**
 * Página escondida (fora do menu, do sitemap e do Google) com o inventário
 * de componentes e tokens do site, para conferir o design system num lugar
 * só. Os exemplos usam os dados reais do site; quando um componente muda,
 * esta página acompanha sozinha.
 */

const COLORS: {token: string; use: string}[] = [
  {token: '--color-background-body', use: 'Fundo da página'},
  {token: '--color-background-card', use: 'Card, fundo muted'},
  {token: '--color-background-surface', use: 'Superfície mais clara'},
  {token: '--color-text-primary', use: 'Texto principal'},
  {token: '--color-text-secondary', use: 'Texto secundário'},
  {token: '--color-accent', use: 'Laranja da marca'},
  {token: '--color-border-emphasized', use: 'Borda destacada'},
  {token: '--color-corporate', use: 'Faixas de In Company'},
  {token: '--color-category-desenho', use: 'Categoria: desenho'},
  {token: '--color-category-pintura', use: 'Categoria: pintura'},
  {token: '--color-category-institucional', use: 'Categoria: institucional'},
  {token: '--color-category-infantil', use: 'Categoria: infantil'},
  {token: '--color-category-teorico', use: 'Categoria: teórico'},
  {token: '--color-teacher-tone-1', use: 'Professores, tom 1'},
  {token: '--color-teacher-tone-2', use: 'Professores, tom 2'},
  {token: '--surface-warm-bg', use: 'Papel (depoimentos, rodapé)'},
  {token: '--surface-warm-card', use: 'Papel, cartão e moldura'},
  {token: '--surface-warm-text', use: 'Texto sobre o papel'},
];

const TYPE_SCALE: {className: string; token: string; role: string}[] = [
  {className: 'heading-style-display', token: '--heading-display', role: 'h1 de hero, faixa de CTA (30 a 48px)'},
  {className: 'heading-style-h2', token: '--heading-h2', role: 'Título de seção (28 a 40px)'},
  {className: 'heading-style-h3', token: '--heading-h3', role: 'Título em cartão grande (24 a 32px)'},
  {className: 'heading-style-h4', token: '--heading-h4', role: 'Título de bloco (23px)'},
  {className: 'heading-style-h5', token: '--heading-h5', role: 'Título de card (19px)'},
  {className: 'heading-style-h6', token: '--heading-h6', role: 'Título pequeno (15px)'},
  {className: 'text-size-large', token: '--text-size-large', role: 'Lead de seção (16px)'},
  {className: 'text-size-regular', token: '--text-size-regular', role: 'Texto corrido (15px)'},
  {className: 'text-size-small', token: '--text-size-small', role: 'Legenda, nota (12px)'},
  {className: 'text-style-label', token: '--text-size-tiny', role: 'Rótulo em caixa alta (10px)'},
];

const SPACING: {name: string; token: string; px: number}[] = [
  {name: 'tiny', token: '--spacing-1', px: 4},
  {name: 'xxsmall', token: '--spacing-2', px: 8},
  {name: 'xsmall', token: '--spacing-4', px: 16},
  {name: 'small', token: '--spacing-6', px: 24},
  {name: 'medium', token: '--spacing-8', px: 32},
  {name: 'large', token: '--spacing-12', px: 48},
  {name: 'xlarge', token: 'calc(--spacing-8 * 2)', px: 64},
  {name: 'xxlarge', token: 'calc(--spacing-10 * 2)', px: 80},
];

const NOTES: Note[] = [
  {
    icon: () => <Camera size={24} weight="light" aria-hidden="true" />,
    title: 'Nota com ícone',
    text: 'Card curto de título e texto, dentro de .coworking-highlights.',
  },
  {
    icon: () => <ClipboardText size={24} weight="light" aria-hidden="true" />,
    title: 'Segunda nota',
    text: 'As colunas vêm da prop columns (2, 3 ou 4).',
  },
  {
    icon: () => <PaintBrush size={24} weight="light" aria-hidden="true" />,
    title: 'Terceira nota',
    text: 'Usado em Coworking, In Company e páginas de formato.',
  },
];

const FACTS: Fact[] = [
  {icon: Clock, label: 'Duração', value: 'Cerca de 1h30'},
  {icon: UsersThree, label: 'Participantes', value: '16 a 50 pessoas'},
  {icon: MapPin, label: 'Onde', value: 'Na empresa'},
  {icon: Chalkboard, label: 'Equipe', value: '1 condutor e 2 apoios'},
];

const STEP_ICONS = [ChatCircleText, Notebook, Hammer, PresentationChart, ClipboardText];

const SECTIONS = [
  ['cores', 'Cores'],
  ['tipografia', 'Tipografia'],
  ['espacamento', 'Espaçamento'],
  ['ui', 'Primitivos de UI'],
  ['blocos', 'Blocos de conteúdo'],
  ['cards', 'Cards'],
  ['secoes', 'Seções inteiras'],
  ['layout', 'Layout do site'],
] as const;

/** Cabeçalho de cada exemplo: nome, arquivo e onde aparece no site. */
function Specimen({name, file, usage, children}: {name: string; file: string; usage: string; children: ReactNode}) {
  return (
    <div className="ds-specimen">
      <div className="ds-specimen__head">
        <h3 className="heading-style-h5">{name}</h3>
        <code className="ds-specimen__file text-size-small">{file}</code>
        <p className="text-size-small text-color-secondary">{usage}</p>
      </div>
      <div className="ds-specimen__body">{children}</div>
    </div>
  );
}

function Group({id, kicker, title, children}: {id: string; kicker: string; title: string; children: ReactNode}) {
  return (
    <section id={id} className="section ds-group">
      <div className="container">
        <header className="ic-head">
          <span className="section__eyebrow">{kicker}</span>
          <h2 className="heading-style-h2">{title}</h2>
        </header>
        <div className="ds-group__items">{children}</div>
      </div>
    </section>
  );
}

export function Componentes() {
  const course = COURSES.find((c) => c.strands && c.gallery.length >= 3) ?? COURSES[0];
  const [featuredFormat, ...otherFormats] = IN_COMPANY_FORMATS;

  return (
    <div className="ds-page">
      <Seo
        title="Componentes"
        description="Inventário interno de componentes e tokens do site da Desenhe."
        path="/componentes"
        noindex
      />

      <section className="section ds-intro">
        <div className="container">
          <span className="section__eyebrow">Página interna</span>
          <h1 className="heading-style-display">Componentes</h1>
          <p className="text-size-large text-color-secondary max-width-large">
            Tudo o que o site usa para se montar, com os dados reais. Fora do menu e do
            Google. As regras de uso estão na skill desenhe-design-system.
          </p>
          <nav className="ds-toc" aria-label="Índice">
            {SECTIONS.map(([id, label]) => (
              <Button key={id} label={label} href={`#${id}`} variant="ghost" size="sm" />
            ))}
          </nav>
        </div>
      </section>

      <Group id="cores" kicker="Tokens" title="Cores">
        <div className="ds-swatches">
          {COLORS.map(({token, use}) => (
            <div key={token} className="ds-swatch">
              <span className="ds-swatch__chip" style={{background: `var(${token})`}} />
              <code className="text-size-small">{token}</code>
              <span className="text-size-small text-color-secondary">{use}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group id="tipografia" kicker="Tokens" title="Tipografia">
        <div className="ds-type">
          {TYPE_SCALE.map(({className, token, role}) => (
            <div key={className} className="ds-type__row">
              <span className={className}>Desenhe escola de arte</span>
              <span className="ds-type__meta text-size-small text-color-secondary">
                <code>.{className}</code> · <code>{token}</code> · {role}
              </span>
            </div>
          ))}
        </div>
      </Group>

      <Group id="espacamento" kicker="Tokens" title="Espaçamento">
        <div className="ds-spacing">
          {SPACING.map(({name, token, px}) => (
            <div key={name} className="ds-spacing__row">
              <span className="ds-spacing__bar" style={{width: px}} />
              <code className="text-size-small">{name}</code>
              <span className="text-size-small text-color-secondary">
                {px}px · {token}
              </span>
            </div>
          ))}
        </div>
      </Group>

      <Group id="ui" kicker="src/ui" title="Primitivos de UI">
        <Specimen name="Button" file="src/ui/Button.tsx" usage="Todas as páginas. Vira Link, <a> ou <button> conforme o href.">
          <div className="ds-row">
            <Button label="Primary" variant="primary" />
            <Button label="Secondary" variant="secondary" />
            <Button label="Ghost" variant="ghost" />
            <Button label="Tint" variant="tint" />
          </div>
          <div className="ds-row">
            <Button label="Small" size="sm" />
            <Button label="Medium" size="md" />
            <Button label="Large" size="lg" />
          </div>
        </Specimen>
        <Specimen name="WhatsCta" file="src/components/WhatsCta.tsx" usage="Botão que abre o WhatsApp com mensagem pronta.">
          <div className="ds-row">
            <WhatsCta message="Olá! Vim pela página de componentes." label="Fale com a gente" size="sm" />
          </div>
        </Specimen>
        <Specimen name="Badge" file="src/ui/Badge.tsx" usage="Selos em Preços e Colônia de Férias.">
          <div className="ds-row">
            <Badge label="Neutral" variant="neutral" />
            <Badge label="Orange" variant="orange" />
            <Badge label="Warning" variant="warning" />
          </div>
        </Specimen>
        <Specimen name="Text" file="src/ui/Text.tsx" usage="Texto com tipo, cor e peso da escala.">
          <Text type="large">Text type="large"</Text>
          <Text type="body">Text type="body"</Text>
          <Text type="supporting">Text type="supporting"</Text>
          <Text type="body" color="accent">Text color="accent"</Text>
        </Specimen>
        <Specimen name="Heading" file="src/ui/Text.tsx" usage="h1 a h6 com o visual base de título.">
          <Heading level={2}>Heading level 2</Heading>
          <Heading level={3}>Heading level 3</Heading>
          <Heading level={4}>Heading level 4</Heading>
        </Specimen>
        <Specimen name="Card" file="src/ui/Card.tsx" usage="Caixa com fundo de card e padding da escala.">
          <Card>
            <Text type="body">Conteúdo dentro de um Card com padding 4.</Text>
          </Card>
        </Specimen>
        <Specimen name="Divider" file="src/ui/Divider.tsx" usage="Fio horizontal entre blocos.">
          <Divider />
        </Specimen>
        <Specimen name="Blockquote" file="src/ui/Blockquote.tsx" usage="Citação destacada.">
          <Blockquote>Desenhar é aprender a olhar.</Blockquote>
        </Specimen>
        <Specimen name="EmptyState" file="src/ui/EmptyState.tsx" usage="Estado vazio, com título, texto e ações.">
          <EmptyState
            title="Nada por aqui ainda"
            description="Quando houver conteúdo, ele aparece neste espaço."
            actions={<Button label="Voltar ao início" href="/" size="sm" />}
          />
        </Specimen>
      </Group>

      <Group id="blocos" kicker="src/components" title="Blocos de conteúdo">
        <Specimen name="NoteGrid" file="src/components/NoteGrid.tsx" usage="Cards curtos com ícone: Coworking, In Company, formatos.">
          <div className="coworking-highlights">
            <NoteGrid items={NOTES} columns={3} />
          </div>
        </Specimen>
        <Specimen name="FactsSummary" file="src/components/FactsSummary.tsx" usage="Ficha de fatos de curso, Coworking e /sobre.">
          <FactsSummary items={FACTS} />
        </Specimen>
        <Specimen name="InCompanyFacts" file="src/components/InCompanyFacts.tsx" usage="Régua de fatos de In Company e das páginas de formato.">
          <InCompanyFacts
            stats={FACTS}
            notes={[{icon: UsersThree, label: 'Para quem', value: 'Times de RH, liderança e áreas de inovação'}]}
          />
        </Specimen>
        <Specimen name="FaqItem" file="src/components/FaqItem.tsx" usage="Perguntas frequentes, dentro de .coworking-faq.">
          <div className="coworking-faq">
            <FaqItem question="Precisa saber desenhar?" answer="Não. O método funciona com quem nunca desenhou." />
            <FaqItem question="Onde acontece?" answer="Na empresa, no evento ou no ateliê da Desenhe." />
          </div>
        </Specimen>
        {course.strands && (
          <Specimen name="StrandAccordions" file="src/components/StrandAccordions.tsx" usage="Linguagens de curso e variantes de formato.">
            <StrandAccordions strands={course.strands} />
          </Specimen>
        )}
      </Group>

      <Group id="cards" kicker="src/components" title="Cards">
        <Specimen name="CourseCard" file="src/components/CourseCard.tsx" usage="Polaroid de curso em /cursos e relacionados.">
          <div className="course-grid">
            {COURSES.slice(0, 3).map((c) => (
              <CourseCard key={c.slug} course={c} fullTitle />
            ))}
          </div>
        </Specimen>
        <Specimen
          name="InCompanyFormatCard"
          file="src/components/InCompanyFormatCard.tsx"
          usage="Formatos In Company: destaque com foto e pequenos com cena de objetos (hover)."
        >
          <div className="course-grid ic-format-grid">
            <InCompanyFormatCard format={featuredFormat} featured />
            {otherFormats.map((f) => (
              <InCompanyFormatCard key={f.slug} format={f} />
            ))}
          </div>
        </Specimen>
      </Group>

      <div id="secoes" className="ds-anchor" />
      <Section kicker="Section" title="Section" lead="Wrapper de seção com kicker, título e lead (src/components/Section.tsx).">
        <Text type="body" color="secondary" display="block" className="text-align-center">
          O conteúdo da seção entra aqui.
        </Text>
      </Section>

      <Timeline
        kicker="Timeline"
        title="Linha do tempo"
        lead="src/components/Timeline.tsx: processos passo a passo."
        items={IN_COMPANY_STEPS}
        icons={STEP_ICONS}
        tone="institucional"
      />

      <Section kicker="CourseGallery" title="Galeria" lead="src/components/CourseGallery.tsx: parede de polaroids com visor.">
        <CourseGallery images={course.gallery.slice(0, 3)} caption={course.shortTitle} credits={course.galleryCredits} />
      </Section>

      <section className="course-cta course-cta--institucional">
        <div className="container course-cta__inner">
          <div className="course-cta__copy">
            <span className="course-cta__eyebrow">.course-cta</span>
            <Heading level={2} className="course-cta__headline">
              Faixa final colorida
            </Heading>
            <Text type="large" color="inherit" display="block" className="course-cta__lead">
              Fechamento de página de curso, Coworking e In Company.
            </Text>
          </div>
        </div>
      </section>

      <Group id="layout" kicker="Estrutura" title="Layout do site">
        <p className="text-size-regular text-color-secondary max-width-large">
          Estes aparecem em todas as páginas (ou só em uma) e não fazem sentido isolados aqui.
        </p>
        <ul className="ds-list text-size-regular">
          <li><code>SiteHeader</code>, <code>NavDropdown</code>, <code>NavCoursesDropdown</code>: header fixo e menus.</li>
          <li><code>SiteFooter</code>, <code>Guestbook</code>, <code>GuestbookPanel</code>, <code>DoodlePile</code>: rodapé com livro de visitas.</li>
          <li><code>WhatsFloat</code>: botão flutuante do WhatsApp.</li>
          <li><code>RootLayout</code>, <code>Seo</code>, <code>Redirect</code>: estrutura, metadados e redirecionamentos.</li>
          <li><code>FeaturedCoursesSection</code>, <code>FeaturedPromoCard</code>, <code>SpaceShowcaseSection</code>, <code>TestimonialsSection</code>, <code>WorksArc</code>: home.</li>
          <li><code>WorkLightbox</code>, <code>WorkViewer</code>: visor de imagens das galerias.</li>
          <li><code>ProfessorModal</code>: bio dos professores em /professores.</li>
          <li><code>InCompanyForm</code>: formulário de proposta em /in-company.</li>
          <li><code>BrandLogo</code>: logo, usada no header e na Central da Marca.</li>
        </ul>
      </Group>
    </div>
  );
}
