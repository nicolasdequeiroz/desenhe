import type {ReactNode} from 'react';
import {Heading, Text} from '../ui';

interface SectionProps {
  kicker?: string;
  title?: string;
  lead?: string;
  muted?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

/** Seção de página com kicker (rótulo), título e conteúdo. */
export function Section({
  kicker,
  title,
  lead,
  muted,
  actions,
  children,
}: SectionProps) {
  return (
    <section className={muted ? 'section section--muted' : 'section'}>
      <div className="container">
        {(kicker || title) && (
          <div className="section__head">
            <div style={{maxWidth: 640}}>
              {kicker && <span className="section__eyebrow">{kicker}</span>}
              {title && <Heading level={2}>{title}</Heading>}
              {lead && (
                <div style={{marginTop: 8}}>
                  <Text type="large" color="secondary">
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
