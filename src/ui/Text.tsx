import {createElement} from 'react';
import type {CSSProperties, ElementType, ReactNode} from 'react';

type TextType = 'body' | 'large' | 'supporting' | 'display-3';
type TextColor = 'primary' | 'secondary' | 'accent' | 'inherit';
type Weight = 'normal' | 'medium' | 'semibold' | 'bold';

const TYPE_STYLE: Record<TextType, CSSProperties> = {
  body: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  large: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-lg)',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  supporting: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 400,
    lineHeight: 1.6667,
  },
  'display-3': {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--font-size-3xl)',
    fontWeight: 400,
    lineHeight: 1.297,
  },
};

const WEIGHT: Record<Weight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const COLOR: Record<TextColor, string> = {
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-text-secondary)',
  accent: 'var(--color-accent)',
  inherit: 'inherit',
};

export interface TextProps {
  children: ReactNode;
  type?: TextType;
  color?: TextColor;
  weight?: Weight;
  display?: 'inline' | 'block';
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/** Texto tematizado. Substitui o <Text> do Astryx. */
export function Text({
  children,
  type = 'body',
  color,
  weight,
  display,
  as,
  className,
  style,
}: TextProps) {
  const Tag = as ?? 'span';
  // 'supporting' tem cor secundária por padrão; os demais, primária.
  const defaultColor: TextColor = type === 'supporting' ? 'secondary' : 'primary';
  const merged: CSSProperties = {
    ...TYPE_STYLE[type],
    color: COLOR[color ?? defaultColor],
    ...(weight ? {fontWeight: WEIGHT[weight]} : null),
    ...(display ? {display} : null),
    ...style,
  };
  return createElement(Tag, {className, style: merged}, children);
}

export interface HeadingProps {
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/**
 * Título. Renderiza o <hN> correspondente; o tamanho/peso vem do reset
 * tipográfico em tokens.css (mesmo mapeamento do tema Astryx).
 */
export function Heading({children, level, className, style, id}: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return createElement(Tag, {className, style, id}, children);
}
