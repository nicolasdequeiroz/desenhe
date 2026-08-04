import {WhatsappLogo} from '@phosphor-icons/react';
import {whatsappLink} from '../data/site';

const DEFAULT_MESSAGE = 'Olá! Vim pelo site da Desenhe.';

/** Botão flutuante de WhatsApp, visível em todas as páginas. */
export function WhatsFloat() {
  return (
    <a
      href={whatsappLink(DEFAULT_MESSAGE)}
      className="whats-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" aria-hidden="true" />
    </a>
  );
}
