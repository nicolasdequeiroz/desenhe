import {useState, type ReactNode} from 'react';
import {Check, X} from '@phosphor-icons/react';
import {Badge, Button, Card, Divider, Heading, Text} from '../ui';
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
        const short =
          typeof item !== 'string' &&
          item.short !== undefined &&
          months !== undefined &&
          months < 6;
        const label =
          typeof item === 'string' ? item : short ? item.short! : item.label;
        const off =
          typeof item !== 'string' &&
          item.minMonths !== undefined &&
          months !== undefined &&
          months < item.minMonths;
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
        description="Mensalidades dos cursos de desenho e pintura da Desenhe, em planos de 3, 6 e 12 meses com aulas semanais, e aluguel de sala por hora no coworking de arte."
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

          <div className="pricing-grid pricing-grid--2">
            {PRICING.map((tier) => {
              const active =
                tier.plans.find((p) => p.months === months) ?? tier.plans[0];
              return (
                <Card key={tier.id} padding={6} className="pricing-card">
                  <div className="pricing-card__head">
                    <Heading level={3}>{tier.cardTitle}</Heading>
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

                  <p className="pricing-card__intake">
                    {PLAN_INFO[active.months].note}.
                  </p>

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

        {/*
          Empilhado (mobile), o mesmo fio da "Infraestrutura" separa a
          primeira aula do curso teórico. No desktop some: a separação já
          é o vão entre as colunas da grade.
        */}
        <div className="pricing-break pricing-break--inline" role="presentation">
          <Divider />
        </div>

        {/*
          Bloco 2: História da Arte. É curso teórico em turma fechada, sem
          vaga garantida nem entrada contínua, então fica separado, com
          cor própria, seletor próprio (9/3 meses) e o texto deixando
          claro que a turma abre em janelas ao longo do ano.
        */}
        <div className="pricing-block pricing-block--theory">
          <span className="pricing-block__label">
            Curso teórico · {HISTORY_OF_ART.name}
          </span>

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

            <Divider />

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
              Alguma dúvida sobre a{' '}
              <span className="course-cta__highlight">precificação</span>?
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
