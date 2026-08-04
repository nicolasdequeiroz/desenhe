import type {MouseEventHandler, ReactNode} from 'react';
import {Link} from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler;
  className?: string;
}

/**
 * Botão do site. O visual vem do CSS `.btn` (mantido do design
 * anterior). Renderiza <Link> para rotas internas, <a> para URLs externas
 * e <button> quando não há href.
 */
export function Button({
  label,
  children,
  variant = 'secondary',
  size = 'md',
  href,
  target,
  rel,
  type = 'button',
  onClick,
  className,
}: ButtonProps) {
  const classes = [
    'btn',
    variant,
    size !== 'md' ? size : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = <span>{children ?? label}</span>;
  const isExternal = href ? /^(https?:|mailto:|tel:)/.test(href) : false;

  if (href && isExternal) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={rel}
        aria-label={label}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link className={classes} to={href} aria-label={label} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} aria-label={label} onClick={onClick}>
      {content}
    </button>
  );
}
