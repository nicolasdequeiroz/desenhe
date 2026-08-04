import type {ReactNode} from 'react';
import {Heading, Text} from '../ui';

interface SectionProps {
  kicker?: string;
  title?: string;
  lead?: string;
  muted?: boolean;
  centered?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Seção de página com kicker (rótulo), título e conteúdo.
 * O bloco de cabeçalho é centralizado por padrão (padrão de início de
 * página interna); passe `centered={false}` para o layout antigo,
 * alinhado à esquerda com `actions` ao lado.
 */
export function Section({
  kicker,
  title,
  lead,
  muted,
  centered = true,
  actions,
  children,
}: SectionProps) {
  return (
    <section className={muted ? 'section section--muted' : 'section'}>
      <div className="container">
        {(kicker || title) && (
          <div
            className={
              centered ? 'section__head section__head--centered' : 'section__head'
            }
          >
            <div style={{maxWidth: 640, marginInline: centered ? 'auto' : undefined}}>
              {kicker && <span className="section__eyebrow">{kicker}</span>}
              {title && <Heading level={2}>{title}</Heading>}
              {lead && (
                <div style={{marginTop: 8}}>
                  <Text as="p" type="large" color="secondary">
                    {lead}
                  </Text>
                </div>
              )}
            </div>
            {actions}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
