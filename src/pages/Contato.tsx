import {Heading, Text} from '../ui';
import {Button} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {SITE} from '../data';

export function Contato() {
  return (
    <>
      <Seo
        title="Contato e localização"
        description="Fale com a Desenhe pelo WhatsApp (41) 98712-1371 ou visite a escola na Rua Padre Anchieta, 265A — Mercês, Curitiba/PR."
        path="/contato"
      />
      <Section
        kicker="Contato"
        title="Vamos conversar sobre arte?"
        lead="O jeito mais rápido de falar com a gente é pelo WhatsApp — para dúvidas, matrículas ou para agendar uma visita à escola."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 40,
            alignItems: 'start',
          }}
        >
          <div style={{display: 'grid', gap: 24}}>
            <div>
              <Heading level={3}>WhatsApp</Heading>
              <div style={{marginTop: 8, marginBottom: 12}}>
                <Text color="secondary">{SITE.whatsappDisplay}</Text>
              </div>
              <WhatsCta message="Olá! Vim pelo site da Desenhe e gostaria de mais informações." />
            </div>

            <div>
              <Heading level={3}>Endereço</Heading>
              <div style={{marginTop: 8, marginBottom: 12}}>
                <Text color="secondary">
                  {SITE.address.street} — {SITE.address.neighborhood},{' '}
                  {SITE.address.city}/{SITE.address.state}
                </Text>
              </div>
              <Button
                label="Abrir no Google Maps"
                variant="secondary"
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>

            <div>
              <Heading level={3}>Redes sociais</Heading>
              <div style={{marginTop: 12, display: 'flex', gap: 12}}>
                <Button
                  label="Instagram"
                  variant="ghost"
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                />
                <Button
                  label="Facebook"
                  variant="ghost"
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          </div>

          <iframe
            title="Mapa da localização da Desenhe"
            src="https://www.google.com/maps?q=Rua+Padre+Anchieta+265A,+Merc%C3%AAs,+Curitiba&output=embed"
            width="100%"
            height="420"
            style={{border: 0, borderRadius: 'var(--radius-container)'}}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>
    </>
  );
}
