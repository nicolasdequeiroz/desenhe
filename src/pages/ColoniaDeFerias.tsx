import {Card} from '../ui';
import {Badge} from '../ui';
import {Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {asset, formatBRL} from '../data';

const PACKAGES = [
  {label: '1 dia avulso', price: 105},
  {label: 'Pacote de 3 dias', price: 285},
  {label: 'Semana completa (5 dias)', price: 430, highlight: true},
];

export function ColoniaDeFerias() {
  const message =
    'Olá! Quero inscrever meu filho(a) na Colônia de Férias de inverno da Desenhe.';

  return (
    <>
      <Seo
        title="Colônia de Férias — Inverno 2026"
        description="Colônia de férias de arte em Curitiba: de 13 a 17 de julho de 2026, para crianças de 6 a 12 anos. Desenho à mão livre, guache, lápis de cor e colagem, com materiais e lanche inclusos."
        path="/colonia-de-ferias"
      />

      <div className="container course-hero">
        <div>
          <span className="section__eyebrow">Inverno 2026 · 13 a 17 de julho</span>
          <Heading level={1}>Colônia de Férias de Arte</Heading>
          <div className="prose" style={{marginTop: 20}}>
            <p>
              Cinco dias de muita arte nas férias de inverno: desenho à mão
              livre, guache, lápis de cor e colagem, com orientação dos
              professores da Desenhe.
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
              <Text>Rua Padre Anchieta, 265A — Mercês, Curitiba</Text>
            </div>
          </div>

          <WhatsCta message={message} label="Garantir vaga" size="lg" />
        </div>

        <img
          src={asset('/images/colonia/atividade.webp')}
          alt="Atividade de pintura na colônia de férias da Desenhe"
        />
      </div>

      <Section kicker="Pacotes" title="Escolha quantos dias" muted>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {PACKAGES.map((pkg) => (
            <Card key={pkg.label} padding={6}>
              {pkg.highlight && (
                <div style={{marginBottom: 8}}>
                  <Badge label="Mais escolhido" variant="orange" />
                </div>
              )}
              <Text weight="semibold" display="block">
                {pkg.label}
              </Text>
              <div style={{marginTop: 8}}>
                <Text type="display-3">{formatBRL(pkg.price)}</Text>
              </div>
              <div style={{marginTop: 8}}>
                <Text type="supporting">Materiais e lanche inclusos</Text>
              </div>
            </Card>
          ))}
        </div>
        <div style={{marginTop: 32}} className="text-center">
          <WhatsCta message={message} label="Inscrever pelo WhatsApp" size="lg" />
        </div>
      </Section>
    </>
  );
}
