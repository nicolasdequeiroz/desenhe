import {useEffect, useRef} from 'react';
import {X} from '@phosphor-icons/react';
import {Button} from '../ui';
import {WhatsCta} from './WhatsCta';
import {SITE, asset, type FeaturedPromo, type PromoEvent} from '../data';
import {useScrollLock} from './useScrollLock';
import {ExpoSeal} from './ExpoSeal';

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Pop-up de um evento do destaque da home (campanha sem página própria, ver
 * `event` em src/data/promo.ts): a arte à esquerda e, ao lado, o texto, a
 * ficha (quando, onde, entrada) e os botões. No celular a arte vai para cima.
 * Mesmo comportamento do modal dos professores: fecha com Esc, no fundo ou
 * no X, prende o foco dentro e trava a rolagem da página.
 */
export function PromoEventModal({
  promo,
  event,
  onClose,
}: {
  promo: FeaturedPromo;
  event: PromoEvent;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock();

  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') {
        onClose();
        return;
      }
      if (keyEvent.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (keyEvent.shiftKey && document.activeElement === first) {
        keyEvent.preventDefault();
        last.focus();
      } else if (!keyEvent.shiftKey && document.activeElement === last) {
        keyEvent.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      <div className="promo-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="promo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
        ref={panelRef}
      >
        <button type="button" className="promo-modal__close" onClick={onClose} aria-label="Fechar">
          <X size={18} weight="bold" />
        </button>

        <div className="promo-modal__media">
          <img src={asset(promo.hero.image)} alt={promo.hero.imageAlt} />
          {promo.seal && <ExpoSeal className="promo-modal__seal" />}
        </div>

        <div className="promo-modal__body">
          <span className="section__eyebrow">{event.kicker}</span>
          <h2 id="promo-modal-title" className="heading-style-h3 promo-modal__title">
            {event.title}
          </h2>
          {event.subtitle && <p className="promo-modal__subtitle">{event.subtitle}</p>}

          <div className="promo-modal__text">
            {event.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="promo-modal__facts">
            {event.facts.map((fact) => (
              <div className="promo-modal__fact" key={fact.label}>
                <dt className="text-style-label">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="promo-modal__actions">
            <Button
              label="Como chegar"
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="sm"
            />
            <WhatsCta message={event.whatsappMessage} label="Falar com a escola" variant="secondary" size="sm" />
          </div>
        </div>
      </div>
    </>
  );
}
