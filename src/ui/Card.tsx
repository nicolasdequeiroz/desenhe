import type {CSSProperties, ReactNode} from 'react';

type Pad = 0 | 2 | 3 | 4 | 5 | 6 | 8;

export interface CardProps {
  children: ReactNode;
  padding?: Pad;
  className?: string;
  style?: CSSProperties;
}

/** Contêiner com fundo, raio e padding. Substitui o <Card> do Astryx. */
export function Card({children, padding = 4, className, style}: CardProps) {
  const merged: CSSProperties = {
    padding: padding === 0 ? 0 : `var(--spacing-${padding})`,
    ...style,
  };
  return (
    <div className={['card', className].filter(Boolean).join(' ')} style={merged}>
      {children}
    </div>
  );
}
