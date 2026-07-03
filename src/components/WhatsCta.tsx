import {Button} from '@astryxdesign/core/Button';
import {whatsappLink} from '../data/site';

interface WhatsCtaProps {
  message: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/** CTA padrão do site: abre conversa de WhatsApp com mensagem pré-preenchida. */
export function WhatsCta({
  message,
  label = 'Falar no WhatsApp',
  variant = 'primary',
  size = 'md',
}: WhatsCtaProps) {
  return (
    <Button
      label={label}
      variant={variant}
      size={size}
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
    />
  );
}
