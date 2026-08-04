import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {X} from '@phosphor-icons/react';

const DISMISS_KEY = 'desenhe:colonia-promo-dismissed';

/**
 * Faixa promocional da Colônia de Férias, só no mobile/tablet (ver CSS):
 * substitui o card com foto que no desktop flutua ao lado do hero. Fica
 * acima até do header (que desce via a classe `has-promo-bar` no body) e
 * fecha com o X, sumindo pelo resto da sessão do navegador.
 */
export function ColoniaPromoBar() {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY) === '1',
  );

  // Empurra o header (e o respiro do hero) para baixo enquanto a faixa existe.
  useEffect(() => {
    document.body.classList.toggle('has-promo-bar', !dismissed);
    return () => document.body.classList.remove('has-promo-bar');
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="promo-bar">
      <Link to="/colonia-de-ferias" className="promo-bar__link">
        Colônia de Férias 2026: saiba mais
      </Link>
      <button
        type="button"
        className="promo-bar__close"
        aria-label="Fechar aviso da Colônia de Férias"
        onClick={() => {
          sessionStorage.setItem(DISMISS_KEY, '1');
          setDismissed(true);
        }}
      >
        <X size={16} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
