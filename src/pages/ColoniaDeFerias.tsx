import type {ReactElement} from 'react';
import {Backpack, Palette, UsersThree} from '@phosphor-icons/react';
import {Badge, Card, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {asset, formatBRL} from '../data';

const MESSAGE =
  'Olá! Quero inscrever meu filho(a) na Colônia de Férias de inverno da Desenhe.';

/** Fotos das turmas em atividade. Baixadas do site atual (colonia-de-ferias). */
const GALLERY = [
  {
    src: '/images/colonia/atividade-1.webp',
    alt: 'Aluno colorindo um desenho de foguete em papel kraft',
  },
  {
    src: '/images/colonia/atividade-7.webp',
    alt: 'Turma inteira desenhando lado a lado numa mesa comunitária',
  },
  {
    src: '/images/colonia/atividade-3.webp',
    alt: 'Criança pintando com guache vermelho sobre papel kraft',
  },
  {
    src: '/images/colonia/atividade-9.webp',
    alt: 'Trabalhos da turma pendurados no varal de exposição',
  },
  {
    src: '/images/colonia/atividade-6.webp',
    alt: 'Crianças desenhando e recortando em mesa comunitária',
  },
  {
    src: '/images/colonia/atividade-11.webp',
    alt: 'Aluno concentrado desenhando com lápis de cor',
  },
  {
    src: '/images/colonia/atividade-4.webp',
    alt: 'Estudo de quadrinhos a lápis em papel kraft',
  },
  {
    src: '/images/colonia/atividade-12.webp',
    alt: 'Aluno observando os próprios trabalhos expostos na parede',
  },
  {
    src: '/images/colonia/atividade-2.webp',
    alt: 'Materiais de desenho organizados sobre a mesa de trabalho',
  },
];

interface Highlight {
  icon: () => ReactElement;
  title: string;
  text: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    icon: () => <Palette size={24} weight="light" aria-hidden="true" />,
    title: 'Arte de verdade',
    text: 'Desenho à mão livre, guache, lápis de cor, recorte e colagem. Cada dia é uma nova técnica para explorar.',
  },
  {
    icon: () => <UsersThree size={24} weight="light" aria-hidden="true" />,
    title: 'Pensado por idade',
    text: 'Atividades adaptadas para cada idade. Cada criança no seu ritmo, do iniciante ao mais experiente.',
  },
  {
    icon: () => <Backpack size={24} weight="light" aria-hidden="true" />,
    title: 'É só chegar',
    text: 'Materiais inclusos. Você traz a criança cheia de vontade, a gente cuida do resto.',
  },
];

interface Package {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  features: string[];
  highlight?: boolean;
}

const PACKAGES: Package[] = [
  {
    id: 'diaria',
    title: 'Diária',
    subtitle: '1 dia de atividades (3h)',
    price: 105,
    features: ['Contato com diferentes técnicas', 'Escolha manhã ou tarde'],
  },
  {
    id: '3-dias',
    title: '3 dias',
    subtitle: '9h totais de atividades',
    price: 285,
    features: ['Desenvolvimento prático e divertido', 'Escolha manhã ou tarde'],
    highlight: true,
  },
  {
    id: 'semana',
    title: 'Semana completa',
    subtitle: '5 dias · 15h totais',
    price: 430,
    features: ['Mergulho em todas as técnicas propostas', 'Escolha manhã ou tarde'],
  },
];

export function ColoniaDeFerias() {
  return (
    <>
      <Seo
        title="Colônia de Férias · Inverno 2026"
        description="Colônia de férias de arte em Curitiba: de 13 a 17 de julho de 2026, para crianças de 6 a 12 anos. Desenho à mão livre, guache, lápis de cor e colagem, com materiais e lanche inclusos."
        path="/colonia-de-ferias"
      />

      <div className="container course-hero">
        <div>
          <span className="section__eyebrow">Inverno 2026 · 13 a 17 de julho</span>
          <Heading level={1}>Colônia de Férias: Ateliê de Inverno</Heading>
          <div className="prose" style={{marginTop: 20}}>
            <p>
              Cinco dias de muita arte nas férias de inverno! Desenho à mão
              livre, guache, lápis de cor e colagem. Sempre de um jeito leve e
              divertido, com técnica de verdade.
            </p>
            <p>
              Para crianças de 6 a 12 anos, em turmas da manhã (9h às 12h) ou
              da tarde (14h às 17h). Materiais e lanche inclusos em todos os
              pacotes.
            </p>
          </div>

          <div className="fact-list">
            <div className="fact-list__item">
              <span className="fact-list__label">Quando</span>
              <Text>13 a 17 de julho de 2026</Text>
            </div>
            <div className="fact-list__item">
              <span className="fact-list__label">Turmas</span>
              <Text>Manhã (9h–12h) ou tarde (14h–17h)</Text>
            </div>
            <div className="fact-list__item">
              <span className="fact-list__label">Idades</span>
              <Text>Crianças de 6 a 12 anos</Text>
            </div>
            <div className="fact-list__item">
              <span className="fact-list__label">Onde</span>
              <Text>Rua Padre Anchieta, 265A, Mercês, Curitiba</Text>
            </div>
          </div>

          <WhatsCta message={MESSAGE} label="Reserve por WhatsApp" size="lg" />
        </div>

        <img
          src={asset('/images/colonia/poster-hero.jpg')}
          alt="Cartaz da Colônia de Férias de Inverno 2026 da Desenhe"
        />
      </div>

      <Section
        kicker="Turmas em atividade"
        title="O que faz dessa semana especial"
      >
        <div className="colonia-gallery">
          {GALLERY.map((img) => (
            <figure className="colonia-gallery__item" key={img.src}>
              <img src={asset(img.src)} alt={img.alt} loading="lazy" />
            </figure>
          ))}
        </div>

        <div className="colonia-highlights">
          {HIGHLIGHTS.map(({icon: Icon, title, text}) => (
            <div className="colonia-highlight" key={title}>
              <span className="colonia-highlight__icon">
                <Icon />
              </span>
              <Heading level={3}>{title}</Heading>
              <Text color="secondary">{text}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="Pacotes"
        title="Escolha o formato ideal"
        lead="De 13 a 17/07, crianças de 6 a 12 anos vão explorar desenho, pintura e colagem de forma lúdica. Todos os pacotes incluem material e lanche."
        muted
      >
        <div className="pricing-grid">
          {PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              padding={6}
              className={`pricing-card${pkg.highlight ? ' pricing-card--highlight' : ''}`}
            >
              {pkg.highlight && (
                <div style={{marginBottom: 8}}>
                  <Badge label="Mais escolhido" variant="orange" />
                </div>
              )}
              <Heading level={3}>{pkg.title}</Heading>
              <Text type="supporting" display="block">
                {pkg.subtitle}
              </Text>

              <div className="pricing-card__price">
                <span className="pricing-card__price-value">
                  {formatBRL(pkg.price)}
                </span>
              </div>

              <ul className="pricing-card__features" style={{marginTop: 20}}>
                {pkg.features.map((feature) => (
                  <li key={feature} className="pricing-card__feature">
                    <Text color="secondary">{feature}</Text>
                  </li>
                ))}
              </ul>

              <div className="pricing-card__cta">
                <WhatsCta
                  message={`Olá! Quero reservar a vaga no pacote "${pkg.title}" da Colônia de Férias da Desenhe.`}
                  label="Reserve a sua vaga"
                  size="sm"
                />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <div className="container course-hero">
        <img
          src={asset('/images/colonia/inscricao.webp')}
          alt="Aluno desenhando com lápis de cor em papel kraft na colônia de férias"
        />

        <div>
          <Heading level={2}>Garanta a vaga do seu pequeno artista</Heading>
          <div className="prose" style={{marginTop: 12}}>
            <p>As vagas são limitadas por turma: quanto antes, melhor.</p>
          </div>

          <div className="fact-list">
            <div className="fact-list__item">
              <span className="fact-list__label">Datas</span>
              <Text>13 a 17 de julho</Text>
            </div>
            <div className="fact-list__item">
              <span className="fact-list__label">Turmas</span>
              <Text>Manhã (9h–12h) ou tarde (14h–17h)</Text>
            </div>
            <div className="fact-list__item">
              <span className="fact-list__label">Onde</span>
              <Text>Rua Padre Anchieta, 265A, Mercês</Text>
            </div>
          </div>

          <WhatsCta message={MESSAGE} label="Reserve por WhatsApp" size="lg" />
        </div>
      </div>
    </>
  );
}
