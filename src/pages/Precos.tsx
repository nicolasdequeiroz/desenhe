import {useState} from 'react';
import {Check} from '@phosphor-icons/react';
import {Badge, Card, Divider, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {NoteGrid} from '../components/NoteGrid';
import {WhatsCta} from '../components/WhatsCta';
import {
  COWORKING,
  FIRST_CLASS_PRICES,
  PLAN_INFO,
  PLAN_MONTHS,
  PRICING,
  PRICING_NOTES,
  formatBRL,
  planTotal,
} from '../data';

function CheckList({items}: {items: string[]}) {
  return (
    <ul className="pricing-check-list">
      {items.map((item) => (
        <li key={item} className="pricing-check">
          <Check
            size={16}
            weight="bold"
            className="pricing-check__icon"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Precos() {
  const [months, setMonths] = useState<number>(PLAN_MONTHS[0]);

  return (
    <>
      <Seo
        title="Preços e planos 2026"
        description="Planos de 3, 6 e 12 meses para os cursos de desenho e pintura da Desenhe, com aulas semanais, e aluguel de sala por hora no coworking artístico."
        path="/precos"
      />
      <Section
        kicker="Investimento"
        title="Planos e mensalidades 2026"
        lead="Uma aula por semana nos cursos de desenho e pintura, presencial em Curitiba ou online ao vivo. A mensalidade depende só da duração do plano: quanto mais longo o compromisso, menor o valor por mês."
      >
        {/* Seletor de duração: uma escolha só, que troca os valores dos dois
            cards de curso ao mesmo tempo (o coworking é por hora e não muda). */}
        <div className="pricing-toggle-wrap">
          <div
            className="pricing-toggle"
            role="group"
            aria-label="Duração do plano"
          >
            {PLAN_MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                className={`pricing-toggle__option${months === m ? ' is-active' : ''}`}
                aria-pressed={months === m}
                onClick={() => setMonths(m)}
              >
                {PLAN_INFO[m].label}
              </button>
            ))}
          </div>
        </div>

        <div className="pricing-grid pricing-grid--3">
          {PRICING.map((tier) => {
            const active =
              tier.plans.find((p) => p.months === months) ?? tier.plans[0];
            return (
              <Card key={tier.id} padding={6} className="pricing-card">
                <div className="pricing-card__head">
                  <Heading level={3}>{tier.title}</Heading>
                  <Text type="supporting" display="block">
                    {tier.subtitle}
                  </Text>
                </div>

                <div className="pricing-card__hero">
                  {active.months === 12 && (
                    <Badge label="Melhor custo-benefício" variant="orange" />
                  )}
                  <div className="pricing-card__price">
                    <span className="pricing-card__price-value">
                      {formatBRL(active.monthly)}
                    </span>
                    <span className="pricing-card__price-unit">/mês</span>
                  </div>
                  <Text type="supporting" display="block">
                    {formatBRL(planTotal(active))} no total, em {active.months}{' '}
                    parcelas. {PLAN_INFO[active.months].note}.
                  </Text>
                </div>

                <div className="pricing-card__cta">
                  <WhatsCta
                    message={`Olá! Quero saber mais sobre o curso de ${tier.title}, no plano de ${active.months} meses.`}
                    label="Falar sobre esse plano"
                    size="sm"
                  />
                </div>

                <Divider />

                <div className="pricing-card__includes">
                  <span className="pricing-card__includes-label">
                    O que está incluso
                  </span>
                  <CheckList items={tier.features} />
                </div>
              </Card>
            );
          })}

          {/* Coworking artístico: mesma diagramação, mas com valor por hora
              (fora do seletor de duração). */}
          <Card padding={6} className="pricing-card">
            <div className="pricing-card__head">
              <Heading level={3}>{COWORKING.title}</Heading>
              <Text type="supporting" display="block">
                {COWORKING.intro}
              </Text>
            </div>

            <div className="pricing-card__hero">
              <div className="pricing-card__price">
                <span className="pricing-card__price-value">
                  {formatBRL(COWORKING.hourly)}
                </span>
                <span className="pricing-card__price-unit">/hora</span>
              </div>
              <Text type="supporting" display="block">
                Aluguel por hora, sem plano mensal. Alunos e ex-alunos têm
                condições especiais.
              </Text>
            </div>

            <div className="pricing-card__cta">
              <WhatsCta
                message="Olá! Quero saber sobre o coworking artístico (aluguel de sala por hora) da Desenhe."
                label="Consultar disponibilidade"
                size="sm"
              />
            </div>

            <Divider />

            <div className="pricing-card__includes">
              <span className="pricing-card__includes-label">
                O que está incluso
              </span>
              <CheckList items={COWORKING.features} />
              <p className="pricing-card__fineprint">{COWORKING.note}</p>
            </div>
          </Card>
        </div>

        {/*
          A primeira aula é avulsa e não pertence a nenhum plano: fica num
          bloco próprio, centralizado abaixo da grade. O valor é só por
          duração da aula, não por curso.
        */}
        <div className="pricing-first">
          <span className="pricing-first__eyebrow">
            Primeira aula{' '}
            <span className="pricing-first__paren">(experimental)</span>
          </span>
          <Text as="p" color="secondary" className="pricing-first__text">
            Uma aula avulsa para conhecer a escola e o professor antes de fechar
            um plano. O valor depende só da duração da aula, não do curso
            escolhido.
          </Text>
          <div className="pricing-first__options">
            {FIRST_CLASS_PRICES.map(({hours, price}) => (
              <div key={hours} className="pricing-first__option">
                <span className="pricing-first__hours">Aula de {hours}h</span>
                <span className="pricing-first__price">{formatBRL(price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-notes">
          <NoteGrid
            eyebrow="Antes de matricular"
            items={PRICING_NOTES}
            footerCard={
              <div className="note-grid__item note-grid__item--cta">
                <Heading level={3}>Ficou com alguma dúvida?</Heading>
                <Text color="secondary">
                  A gente ajuda a escolher o plano e o horário que combinam com
                  a sua rotina.
                </Text>
                <WhatsCta
                  message="Olá! Gostaria de saber mais sobre os planos e valores dos cursos da Desenhe."
                  label="Falar sobre os planos"
                  size="sm"
                />
              </div>
            }
          />
        </div>
      </Section>
    </>
  );
}
