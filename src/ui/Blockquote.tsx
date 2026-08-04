import type {ReactNode} from 'react';

/** Citação com borda à esquerda. Substitui o <Blockquote> do Astryx. */
export function Blockquote({children}: {children: ReactNode}) {
  return <blockquote className="blockquote">{children}</blockquote>;
}
