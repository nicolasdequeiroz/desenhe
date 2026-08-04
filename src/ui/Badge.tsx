type BadgeVariant = 'neutral' | 'orange' | 'warning';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

/** Selo/etiqueta. Substitui o <Badge> do Astryx (valores fiéis ao tema). */
export function Badge({label, variant = 'neutral'}: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{label}</span>;
}
