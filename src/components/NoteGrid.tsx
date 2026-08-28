import type {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {Heading, Text} from '../ui';

export interface Note {
  title: string;
  text: string;
  /** Se presente, a nota inteira vira um link interno para essa rota. */
  href?: string;
  /** Texto do link exibido no rodapé da nota (padrão: "Saiba mais"). */
  linkLabel?: string;
}

interface Props {
  /** Rótulo pequeno acima do grid, no mesmo estilo dos kickers de seção. */
  eyebrow?: string;
  items: Note[];
  /** Colunas no desktop; abaixo de 860px cai para 2 e abaixo de 560px para 1. */
  columns?: 2 | 3;
  /**
   * Card livre no fim da grade, para ocupar a célula que sobra quando os
   * itens não fecham a última linha (ver a chamada de dúvidas em /precos).
   */
  footerCard?: ReactNode;
}

/**
 * Grade de notas curtas (título + parágrafo), separada do conteúdo acima por
 * um fio. É o formato usado para a proposta pedagógica em /cursos, para as
 * observações de /precos e para os princípios em /sobre. Uma nota com `href`
 * vira uma carta clicável para a rota indicada.
 */
export function NoteGrid({eyebrow, items, columns = 3, footerCard}: Props) {
  return (
    <div className="note-grid">
      {eyebrow && <span className="note-grid__eyebrow">{eyebrow}</span>}
      <div className={`note-grid__items note-grid__items--${columns}`}>
        {items.map((item) => {
          const body = (
            <>
              <Heading level={3}>{item.title}</Heading>
              <Text color="secondary">{item.text}</Text>
              {item.href && (
                <span className="note-grid__item-link" aria-hidden="true">
                  {item.linkLabel ?? 'Saiba mais'}
                  <span className="note-grid__item-arrow">→</span>
                </span>
              )}
            </>
          );

          return item.href ? (
            <Link
              key={item.title}
              to={item.href}
              className="note-grid__item note-grid__item--link"
            >
              {body}
            </Link>
          ) : (
            <div className="note-grid__item" key={item.title}>
              {body}
            </div>
          );
        })}
        {footerCard}
      </div>
    </div>
  );
}
