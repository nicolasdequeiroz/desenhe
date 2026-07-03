import {Card} from '@astryxdesign/core/Card';
import {Badge} from '@astryxdesign/core/Badge';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Divider} from '@astryxdesign/core/Divider';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
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
        lead="Aulas 1x por semana, em planos de 3, 6 ou 12 meses — quanto maior o compromisso, menor a mensalidade."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {PRICING.map((tier) => (
            <Card key={tier.id} padding={6}>
              <Heading level={3}>{tier.title}</Heading>
              <Text type="supporting" display="block">
                {tier.subtitle}
              </Text>
              <div style={{marginTop: 20, display: 'grid', gap: 16}}>
                {tier.plans.map((plan) => (
                  <div key={plan.months}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 12,
                      }}
                    >
                      <Text weight="semibold">{plan.months} meses</Text>
                      <Text type="large" weight="bold">
                        {formatBRL(plan.monthly)}
                        <Text type="supporting"> /mês</Text>
                      </Text>
                    </div>
                    <Text type="supporting">{plan.note}</Text>
                  </div>
                ))}
              </div>
              <div style={{marginTop: 20}}>
                <Divider />
                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Text color="secondary">Aula experimental avulsa</Text>
                  <Badge label={formatBRL(tier.trialPrice)} variant="orange" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{marginTop: 32, maxWidth: 720}}>
          <ul style={{margin: 0, paddingLeft: 20, display: 'grid', gap: 8}}>
            {PRICING_NOTES.map((note) => (
              <li key={note.slice(0, 24)}>
                <Text color="secondary">{note}</Text>
              </li>
            ))}
          </ul>
          <div style={{marginTop: 16}}>
            <Text color="secondary">
              O curso de História da Arte tem valores próprios — consulte pelo
              WhatsApp.
            </Text>
          </div>
        </div>

        <div style={{marginTop: 40}} className="text-center">
          <WhatsCta
            message="Olá! Gostaria de saber mais sobre os planos e valores dos cursos da Desenhe."
            label="Tirar dúvidas sobre planos"
            size="lg"
          />
        </div>
      </Section>
    </>
  );
}
