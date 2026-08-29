import {useState} from 'react';
import {Check, X} from '@phosphor-icons/react';
import {Badge, Card, Divider, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {NoteGrid} from '../components/NoteGrid';
import {WhatsCta} from '../components/WhatsCta';
import {
  COWORKING,
  type Feature,
  FIRST_CLASS_PRICES,
  HISTORY_OF_ART,
  PLAN_INFO,
  PLAN_MONTHS,
  PRICING,
  PRICING_NOTES,
  formatBRL,
  planTotal,
} from '../data';

function CheckList({items, months}: {items: Feature[]; months?: number}) {
  return (
    <ul className="pricing-check-list">
      {items.map((item) => {
        const label = typeof item === 'string' ? item : item.label;
        const off =
          typeof item !== 'string' &&
          months !== undefined &&
          months < item.minMonths;
        return (
          <li
            key={label}
            className={`pricing-check${off ? ' pricing-check--off' : ''}`}
          >
            {off ? (
              <X
                size={16}
                weight="bold"
                className="pricing-check__icon"
                aria-hidden="true"
              />
            ) : (
              <Check
                size={16}
                weight="bold"
                className="pricing-check__icon"
                aria-hidden="true"
              />
            )}
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Toggle<T extends number>({
  label,
  options,
  value,
  onChange,
  renderLabel,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderLabel: (value: T) => string;
}) {
  return (
    <div className="pricing-toggle-wrap">
      <div className="pricing-toggle" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`pricing-toggle__option${value === option ? ' is-active' : ''}`}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {renderLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Precos() {
  const [months, setMonths] = useState<number>(PLAN_MONTHS[0]);
  const [historyMonths, setHistoryMonths] = useState<number>(
    HISTORY_OF_ART.plans[0].months,
  );
  const historyPlan =
    HISTORY_OF_ART.plans.find((p) => p.months === historyMonths) ??
    HISTORY_OF_ART.plans[0];

  return (
    <>
      <Seo
        title="Preços e planos 2026"
        description="Planos de 3, 6 e 12 meses para os cursos de desenho e pintura da Desenhe, com aulas semanais, e aluguel de sala por hora no coworking artístico."
        path="/precos"
      />
      <Section
        className="section--pricing"
        kicker="Investimento"
        title="Planos e mensalidades 2026"
        lead="Uma aula por semana nos cursos de desenho e pintura, presencial em Curitiba ou online ao vivo. A mensalidade depende só da duração do plano: quanto mais longo o compromisso, menor o valor por mês."
      >
        {/*
          Os dois blocos de curso ficam lado a lado no desktop (cursos de
          ateliê à esquerda, História da Arte à direita) e empilham no
          mobile. Cada um tem rótulo e seletor de duração próprios.
        */}
        <div className="pricing-blocks">
        {/*
          Bloco 1: os cursos de ateliê (aula semanal). O seletor 12/6/3
          troca os valores dos dois cards ao mesmo tempo e só deles.
        */}
        <div className="pricing-block">
          <span className="pricing-block__label">Cursos práticos</span>

          <Toggle
            label="Duração do plano dos cursos de ateliê"
            options={PLAN_MONTHS}
            value={months}
            onChange={setMonths}
            renderLabel={(m) => PLAN_INFO[m].label}
          />

          <div className="pricing-grid pricing-grid--2">
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
                    <CheckList items={tier.features} months={active.months} />
                  </div>
                </Card>
              );
            })}
          </div>

          {/*
            A primeira aula é avulsa, não pertence a nenhum plano: fecha o
            bloco dos cursos práticos, abaixo da grade. O valor é só por
            duração da aula, não por curso.
          */}
          <div className="pricing-first">
            <span className="pricing-first__eyebrow">
              Primeira aula{' '}
              <span className="pricing-first__paren">(experimental)</span>
            </span>
            <Text as="p" color="secondary" className="pricing-first__text">
              Uma aula avulsa para conhecer a escola e o professor antes de
              fechar um plano. O valor depende só da duração da aula, não do
              curso escolhido.
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
        </div>

        {/*
          Bloco 2: História da Arte. É curso teórico em turma fechada, sem
          vaga garantida nem entrada contínua, então fica separado, com
          cor própria, seletor próprio (9/3 meses) e o texto deixando
          claro que a turma abre em janelas ao longo do ano.
        */}
        <div className="pricing-block">
          <span className="pricing-block__label">Curso teórico</span>

          <Toggle
            label="Duração do curso de História da Arte"
            options={HISTORY_OF_ART.plans.map((p) => p.months)}
            value={historyMonths}
            onChange={setHistoryMonths}
            renderLabel={(m) =>
              HISTORY_OF_ART.plans.find((p) => p.months === m)?.label ?? `${m}`
            }
          />

          <Card
            padding={6}
            className="pricing-card pricing-card--theory"
          >
            <div className="pricing-card__head">
              <Heading level={3}>{HISTORY_OF_ART.title}</Heading>
              <Text type="supporting" display="block">
                {HISTORY_OF_ART.subtitle}
              </Text>
            </div>

            <div className="pricing-card__hero">
              <Badge label={HISTORY_OF_ART.availability} variant="neutral" />
              <div className="pricing-card__price">
                <span className="pricing-card__price-value">
                  {formatBRL(historyPlan.monthly)}
                </span>
                <span className="pricing-card__price-unit">/mês</span>
              </div>
              <Text type="supporting" display="block">
                {historyPlan.scope}. Mais taxa de matrícula única de{' '}
                {formatBRL(HISTORY_OF_ART.enrollmentFee)}.
              </Text>
            </div>

            <p className="pricing-card__intake">{HISTORY_OF_ART.intake}</p>

            <div className="pricing-card__cta">
              <WhatsCta
                message={`Olá! Quero entrar na lista de espera do curso de ${HISTORY_OF_ART.title} da Desenhe (versão de ${historyPlan.months} meses).`}
                label="Entrar na lista de espera"
                size="sm"
              />
            </div>

            <Divider />

            <div className="pricing-card__includes">
              <span className="pricing-card__includes-label">
                O que está incluso
              </span>
              <CheckList items={HISTORY_OF_ART.features} />
              <p className="pricing-card__fineprint">{HISTORY_OF_ART.note}</p>
            </div>
          </Card>
        </div>
        </div>

        {/*
          Fim da parte "escolar" (cursos e primeira aula). O coworking é
          outra coisa: aluguel de sala por hora, sem vínculo com curso. Um
          fio separa as duas.
        */}
        <div className="pricing-break" role="presentation">
          <Divider />
        </div>

        <div className="pricing-block">
          <div className="pricing-block__head">
            <span className="pricing-block__label">Infraestrutura</span>
            <Heading level={2} className="pricing-block__title">
              {COWORKING.title}
            </Heading>
            <Text as="p" color="secondary" className="pricing-block__lead">
              {COWORKING.intro}
            </Text>
          </div>

          <div className="pricing-solo">
            <Card padding={6} className="pricing-card pricing-card--solo">
              <div className="pricing-card__main">
                <div className="pricing-card__hero">
                  <div className="pricing-card__price">
                    <span className="pricing-card__price-value">
                      {formatBRL(COWORKING.hourly)}
                    </span>
                    <span className="pricing-card__price-unit">/hora</span>
                  </div>
                  <Text type="supporting" display="block">
                    Aluguel por hora, sem plano mensal.
                  </Text>
                </div>

                <div className="pricing-card__cta">
                  <WhatsCta
                    message="Olá! Quero saber sobre o coworking artístico (aluguel de sala por hora) da Desenhe."
                    label="Consultar disponibilidade"
                    size="sm"
                  />
                </div>
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
