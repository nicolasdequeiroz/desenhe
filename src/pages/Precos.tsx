import {Card} from '../ui';
import {Badge} from '../ui';
import {Heading, Text} from '../ui';
import {Divider} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {NoteGrid} from '../components/NoteGrid';
import {WhatsCta} from '../components/WhatsCta';
import {PRICING, PRICING_NOTES, formatBRL} from '../data';

export function Precos() {
  return (
    <>
      <Seo
        title="Preços e planos 2026"
        description="Planos de 3, 6 e 12 meses para os cursos de desenho e pintura da Desenhe, com aulas semanais e aula experimental avulsa. Confira os valores."
        path="/precos"
      />
      <Section
        kicker="Investimento"
        title="Planos e mensalidades 2026"
        lead="Aulas 1x por semana, em planos de 3, 6 ou 12 meses: quanto maior o compromisso, menor a mensalidade."
      >
        <div className="pricing-grid">
          {PRICING.map((tier) => {
            const [heroPlan, ...altPlans] = tier.plans;
            return (
              <Card key={tier.id} padding={6} className="pricing-card">
                <Heading level={3}>{tier.title}</Heading>
                <Text type="supporting" display="block">
                  {tier.subtitle}
                </Text>

                <div className="pricing-card__price">
                  <span className="pricing-card__price-value">
                    {formatBRL(heroPlan.monthly)}
                  </span>
                  <span className="pricing-card__price-unit">/mês</span>
                </div>
                <Text type="supporting" display="block">
                  No plano de {heroPlan.months} meses: {heroPlan.note.toLowerCase()}
                </Text>

                <div className="pricing-card__cta">
                  <WhatsCta
                    message={`Olá! Quero saber mais sobre o curso de ${tier.title}, no plano de ${heroPlan.months} meses.`}
                    label="Falar sobre esse plano"
                    size="sm"
                  />
                </div>

                <Divider />

                <ul className="pricing-card__features" role="list">
                  {altPlans.map((plan) => (
                    <li key={plan.months} className="pricing-card__feature">
                      <span>
                        <Text weight="semibold">{plan.months} meses</Text>
                        {' — '}
                        <Text weight="semibold">
                          {formatBRL(plan.monthly)} /mês
                        </Text>
                        <Text type="supporting" display="block">
                          {plan.note}
                        </Text>
                      </span>
                    </li>
                  ))}
                  <li className="pricing-card__feature">
                    <span className="pricing-card__trial">
                      <Text weight="semibold">Aula experimental avulsa</Text>
                      <Badge label={formatBRL(tier.trialPrice)} variant="orange" />
                    </span>
                  </li>
                </ul>
              </Card>
            );
          })}
        </div>

        <div className="pricing-notes">
          {/*
            As observações somam 5 e a grade tem 3 colunas: a célula que sobra
            na última linha recebe a chamada de dúvidas, em vez de deixar um
            vão e repetir o botão logo abaixo da seção.
          */}
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
