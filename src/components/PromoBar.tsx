import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {X} from '@phosphor-icons/react';
import type {FeaturedPromo} from '../data';

/**
 * Faixa promocional da campanha em destaque (`FEATURED_PROMO`), só no
 * mobile/tablet (ver CSS): substitui o card com foto que no desktop flutua ao
 * lado do hero. Fica acima até do header (que desce via a classe
 * `has-promo-bar` no body) e fecha com o X, sumindo pelo resto da sessão do
 * navegador. A chave de "fechar" inclui o `id` da campanha, então uma campanha
 * nova volta a aparecer mesmo para quem fechou a anterior.
 */
export function PromoBar({promo}: {promo: FeaturedPromo}) {
  const dismissKey = `desenhe:promo:${promo.id}:dismissed`;
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(dismissKey) === '1',
  );

  // Empurra o header (e o respiro do hero) para baixo enquanto a faixa existe.
  useEffect(() => {
    document.body.classList.toggle('has-promo-bar', !dismissed);
    return () => document.body.classList.remove('has-promo-bar');
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="promo-bar">
      <Link to={promo.path} className="promo-bar__link">
        {promo.bar.text}
      </Link>
      <button
        type="button"
        className="promo-bar__close"
        aria-label={promo.bar.closeLabel}
        onClick={() => {
          sessionStorage.setItem(dismissKey, '1');
          setDismissed(true);
        }}
      >
        <X size={16} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
