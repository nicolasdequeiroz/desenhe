import {useState, type ReactNode} from 'react';
import {Check, X} from '@phosphor-icons/react';
import {Badge, Button, Card, Divider, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {NoteGrid} from '../components/NoteGrid';
import {WhatsCta} from '../components/WhatsCta';
import {
  COMMON_FEATURES,
  type CommonFeature,
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

/** Texto do item para a duração escolhida e se ele vale nela. */
function resolveFeature(item: Feature, months?: number) {
  if (typeof item === 'string') return {label: item, off: false};
  const off =
    item.minMonths !== undefined &&
    months !== undefined &&
    months < item.minMonths;
  const short = item.short !== undefined && months !== undefined && months < 6;
  return {label: short ? item.short! : item.label, off};
}

/**
 * Faixa abaixo dos cards de cursos práticos com o que vale igual para os
 * três, no mesmo check dos checklists: título curto e detalhe. O detalhe muda
 * nos planos curtos, e o item que não vale na duração escolhida fica
 * apagado com um "x" (ex.: certificação no plano de 3 meses).
 */
function CommonFeatures({
  items,
  months,
}: {
  items: CommonFeature[];
  months: number;
}) {
  return (
    <div className="pricing-common">
      <span className="pricing-common__label">Incluso nos três cursos</span>
      <ul className="pricing-common__list">
        {items.map((item) => {
          const off = item.minMonths !== undefined && months < item.minMonths;
          const StatusIcon = off ? X : Check;
          return (
            <li
              key={item.title}
              className={`pricing-check pricing-common__item${off ? ' pricing-check--off' : ''}`}
            >
              <StatusIcon
                size={14}
                weight="bold"
                className="pricing-check__icon"
                aria-hidden="true"
              />
              <span className="pricing-common__text">
                <span className="pricing-common__title">{item.title}</span>
                <span className="pricing-common__detail">
                  {months < 6 && item.shortDetail
                    ? item.shortDetail
                    : item.detail}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CheckList({items, months}: {items: Feature[]; months?: number}) {
  return (
    <ul className="pricing-check-list">
      {items.map((item) => {
        const {label, off} = resolveFeature(item, months);
        return (
          <li
            key={label}
            className={`pricing-check${off ? ' pricing-check--off' : ''}`}
          >
            {off ? (
              <X
                size={14}
                weight="bold"
                className="pricing-check__icon"
                aria-hidden="true"
              />
            ) : (
              <Check
                size={14}
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
  renderLabel: (value: T) => ReactNode;
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

  // Quanto a mensalidade do plano mais longo (12 meses) fica abaixo da do
  // mais curto (3 meses). Usa o menor desconto entre os cursos, pra o selo
  // "-X%" na opção "12 meses" nunca prometer mais do que qualquer plano dá.
  const longPlanDiscount = Math.round(
    Math.min(
      ...PRICING.map((tier) => {
        const longest = tier.plans[0];
        const shortest = tier.plans[tier.plans.length - 1];
        return 1 - longest.monthly / shortest.monthly;
      }),
    ) * 100,
  );

  // Mesma ideia para História da Arte: a versão completa (9 meses) fica
  // abaixo da curta (3 meses).
  const historyLongPlan = HISTORY_OF_ART.plans[0];
  const historyShortPlan =
    HISTORY_OF_ART.plans[HISTORY_OF_ART.plans.length - 1];
  const historyLongPlanDiscount = Math.round(
    (1 - historyLongPlan.monthly / historyShortPlan.monthly) * 100,
  );

  return (
    <>
      <Seo
        title="Preços e Mensalidades dos Cursos"
        description="Mensalidades dos cursos de Desenho, Pintura em aquarela e guache e Pintura a óleo e acrílica da Desenhe, em planos de 3, 6 e 12 meses, além de História da Arte e do coworking artístico."
        path="/precos"
      />
      <Section
        className="section--pricing"
        kicker="Investimento"
        title="Planos e mensalidades 2026"
        lead="Uma aula por semana nos cursos de desenho e pintura, presencial em Curitiba ou online ao vivo. A mensalidade depende só da duração do plano: quanto mais longo o compromisso, menor o valor por mês."
      >
        {/*
          Cursos práticos (aula semanal): um card por modalidade. O seletor
          12/6/3 troca parcela e total dos três ao mesmo tempo.
        */}
        <div className="pricing-block pricing-block--practice">
          <div className="pricing-block__intro">
            <div className="pricing-block__head">
              <span className="pricing-block__label">Cursos práticos</span>
              <Text as="p" color="secondary" className="pricing-block__lead">
                {PLAN_INFO[months].note}.
              </Text>
            </div>

            <Toggle
              label="Duração do plano dos cursos práticos"
              options={PLAN_MONTHS}
              value={months}
              onChange={setMonths}
              renderLabel={(m) => (
                <>
                  {PLAN_INFO[m].label}
                  {m === 12 && (
                    <span className="pricing-toggle__badge">
                      -{longPlanDiscount}%
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <div className="pricing-grid pricing-grid--3">
            {PRICING.map((tier) => {
              const active =
                tier.plans.find((p) => p.months === months) ?? tier.plans[0];
              return (
                <Card
                  key={tier.id}
                  padding={6}
                  className={`pricing-card pricing-card--course pricing-card--${tier.category}`}
                >
                  <div className="pricing-card__head">
                    <Heading level={3} className="pricing-card__name">
                      {tier.name}
                      {tier.technique && (
                        <span className="pricing-card__technique">
                          {' '}({tier.technique})
                        </span>
                      )}
                    </Heading>
                    <p className="pricing-card__covers">{tier.covers}</p>
                    <Text type="supporting" display="block">
                      {tier.subtitle}
                    </Text>
                  </div>

                  <Divider />

                  <div className="pricing-card__hero">
                    <div className="pricing-card__price">
                      <span className="pricing-card__price-prefix">
                        {active.months}x
                      </span>
                      <span className="pricing-card__price-value">
                        {formatBRL(active.monthly)}
                      </span>
                    </div>
                    <Text type="supporting" display="block">
                      Total do curso:{' '}
                      <span className="pricing-card__total-value">
                        {formatBRL(planTotal(active))}
                      </span>
                    </Text>
                  </div>

                  <div className="pricing-card__cta">
                    <WhatsCta
                      message={`Olá! Quero saber mais sobre o curso de ${tier.title}, no plano de ${active.months} meses.`}
                      label="Falar sobre esse plano"
                      size="sm"
                    />
                    <Button
                      label={tier.courseHref ? 'Ver curso' : 'Ver cursos'}
                      href={tier.courseHref ?? '/cursos'}
                      variant="tint"
                      size="sm"
                    />
                  </div>
                </Card>
              );
            })}
          </div>

          {/*
            Abaixo da grade, lado a lado no desktop: o que vale nos três
            cursos e a primeira aula. A primeira aula é avulsa, não pertence
            a nenhum plano; o valor é só por duração da aula, não por curso.
          */}
          <div className="pricing-extras">
            <CommonFeatures items={COMMON_FEATURES} months={months} />

            <div className="pricing-first">
              <div className="pricing-first__intro">
                <span className="pricing-first__eyebrow">
                  Primeira aula{' '}
                  <span className="pricing-first__paren">(experimental)</span>
                </span>
                <Text as="p" color="secondary" className="pricing-first__text">
                  Uma aula avulsa para conhecer a escola e o professor antes de
                  fechar um plano. O valor depende só da duração da aula, não do
                  curso escolhido.
                </Text>
              </div>
              <div className="pricing-first__offer">
                <dl className="pricing-first__prices">
                  {FIRST_CLASS_PRICES.map(({hours, price}) => (
                    <div key={hours} className="pricing-first__price-row">
                      <dt className="pricing-first__hours">Aula de {hours}h</dt>
                      <dd className="pricing-first__price">{formatBRL(price)}</dd>
                    </div>
                  ))}
                </dl>
                <WhatsCta
                  message="Olá! Quero agendar a primeira aula (experimental) na Desenhe."
                  label="Agendar primeira aula"
                  variant="ghost"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/*
          História da Arte: curso teórico em turma fechada, sem vaga
          garantida nem entrada contínua. Vem depois dos cursos práticos,
          secundário a eles, no mesmo formato de card do coworking, com
          cor e seletor (9/3 meses) próprios.
        */}
        <div className="pricing-break" role="presentation">
          <Divider />
        </div>

        <div className="pricing-block pricing-block--theory">
          <div className="pricing-block__intro">
            <div className="pricing-block__head">
              <span className="pricing-block__label">Curso teórico</span>
              <Heading level={2} className="pricing-block__title">
                {HISTORY_OF_ART.name}
              </Heading>
              <Text as="p" color="secondary" className="pricing-block__lead">
                {HISTORY_OF_ART.title}. {HISTORY_OF_ART.subtitle}.
              </Text>
            </div>

            <Toggle
              label="Duração do curso de História da Arte"
              options={HISTORY_OF_ART.plans.map((p) => p.months)}
              value={historyMonths}
              onChange={setHistoryMonths}
              renderLabel={(m) => (
                <>
                  {HISTORY_OF_ART.plans.find((p) => p.months === m)?.label ?? `${m}`}
                  {m === historyLongPlan.months && historyLongPlanDiscount > 0 && (
                    <span className="pricing-toggle__badge">
                      -{historyLongPlanDiscount}%
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <div className="pricing-solo">
            <Card
              padding={6}
              className="pricing-card pricing-card--solo pricing-card--theory"
            >
              <div className="pricing-card__main">
                <div className="pricing-card__hero">
                  <div className="pricing-card__price">
                    <span className="pricing-card__price-prefix">
                      {historyPlan.months}x
                    </span>
                    <span className="pricing-card__price-value">
                      {formatBRL(historyPlan.monthly)}
                    </span>
                  </div>
                  <Text
                    type="supporting"
                    display="block"
                    color="primary"
                    weight="medium"
                  >
                    Taxa de matrícula única de{' '}
                    {formatBRL(HISTORY_OF_ART.enrollmentFee)}.
                  </Text>
                  <Text type="supporting" display="block">
                    {historyPlan.scope}.
                  </Text>
                </div>

                <p className="pricing-card__intake">{HISTORY_OF_ART.intake}</p>

                <div className="pricing-card__cta">
                  <WhatsCta
                    message={`Olá! Quero entrar na lista de espera do curso de ${HISTORY_OF_ART.name} da Desenhe (versão de ${historyPlan.months} meses).`}
                    label="Entrar na lista de espera"
                    size="sm"
                  />
                  <Button
                    label="Saiba mais"
                    href="/cursos/historia-da-arte"
                    variant="tint"
                    size="sm"
                  />
                </div>
              </div>

              <Divider />

              <div className="pricing-card__includes">
                <span className="pricing-card__includes-label">
                  O que está incluso
                </span>
                <CheckList
                  items={HISTORY_OF_ART.features}
                  months={historyPlan.months}
                />
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
            <div className="pricing-block__title-row">
              <Heading level={2} className="pricing-block__title">
                {COWORKING.title}
              </Heading>
              <Badge label="Novidade" variant="orange" />
            </div>
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
                  <Button
                    label="Saiba mais"
                    href="/coworking-artistico"
                    variant="tint"
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
            columns={4}
          />
        </div>
      </Section>

      <section className="course-cta course-cta--institucional">
        <div className="container course-cta__inner">
          <div className="course-cta__copy">
            <span className="course-cta__eyebrow">Sem letras miúdas</span>
            <Heading level={2} className="course-cta__headline">
              Alguma dúvida sobre a precificação?
            </Heading>
            <Text
              type="large"
              color="inherit"
              display="block"
              className="course-cta__lead"
            >
              A gente explica os planos, a taxa de matrícula e o que muda de
              uma duração para outra, e ajuda a escolher a que cabe na sua
              rotina.
            </Text>
            <div className="course-cta__action">
              <WhatsCta
                message="Olá! Tenho uma dúvida sobre os planos e valores dos cursos da Desenhe."
                label="Entre em contato"
                size="sm"
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
