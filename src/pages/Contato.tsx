import type {ReactElement} from 'react';
import {
  FacebookLogo,
  InstagramLogo,
  MapPin,
  WhatsappLogo,
} from '@phosphor-icons/react';
import {Button, Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {WhatsCta} from '../components/WhatsCta';
import {SITE, whatsappLink} from '../data';

interface Channel {
  icon: () => ReactElement;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  external?: boolean;
}

/** Os quatro canais da escola, um por coluna da faixa (ver .contact-grid). */
const CHANNELS: Channel[] = [
  {
    icon: () => <WhatsappLogo size={24} weight="light" aria-hidden="true" />,
    title: 'Fale pelo WhatsApp',
    description: 'Dúvidas, valores e matrículas',
    linkLabel: SITE.whatsappDisplay,
    href: whatsappLink(
      'Olá! Vim pelo site da Desenhe e gostaria de mais informações.',
    ),
    external: true,
  },
  {
    icon: () => <MapPin size={24} weight="light" aria-hidden="true" />,
    title: 'Visite a escola',
    description: 'Salas de aula, galeria e biblioteca',
    linkLabel: `${SITE.address.street}, ${SITE.address.neighborhood}`,
    href: SITE.mapsUrl,
    external: true,
  },
  {
    icon: () => <InstagramLogo size={24} weight="light" aria-hidden="true" />,
    title: 'Veja no Instagram',
    description: 'Trabalhos dos alunos e bastidores',
    linkLabel: '@desenheestudio',
    href: SITE.instagram,
    external: true,
  },
  {
    icon: () => <FacebookLogo size={24} weight="light" aria-hidden="true" />,
    title: 'Siga no Facebook',
    description: 'Turmas, eventos e exposições',
    linkLabel: '/estudiodesenhe',
    href: SITE.facebook,
    external: true,
  },
];

/**
 * Página de contato no layout "Helio Contact 03": cabeçalho centralizado,
 * uma faixa de quatro canais dividida por fios internos e, logo abaixo e
 * dentro da mesma moldura, o mapa com um cartão de endereço apoiado no
 * canto inferior esquerdo.
 */
export function Contato() {
  return (
    <div className="section contact-page">
      <Seo
        title="Contato e localização"
        description={`Fale com a Desenhe pelo WhatsApp ${SITE.whatsappDisplay} ou visite a escola na ${SITE.address.street}, ${SITE.address.neighborhood}, Curitiba/PR.`}
        path="/contato"
      />

      <div className="container">
        <div className="section__head section__head--centered">
          <div style={{maxWidth: 640, marginInline: 'auto'}}>
            <span className="section__eyebrow">Contato</span>
            <Heading level={1}>Como podemos ajudar?</Heading>
            <div style={{marginTop: 8}}>
              <Text as="p" type="large" color="secondary">
                Conte o que você procura e a gente indica o curso, o horário e o
                plano que fazem sentido para você.
              </Text>
            </div>
          </div>
        </div>

        {/*
          Moldura única: as bordas de cada célula da grade desenham só o topo
          e a esquerda, e o wrapper fecha a direita e a base. É assim que os
          fios internos não dobram de espessura nos encontros.
        */}
        <div className="contact-frame">
          <div className="contact-grid">
            {CHANNELS.map(({icon: Icon, title, description, linkLabel, href, external}) => (
              <div className="contact-card" key={title}>
                <span className="contact-card__icon">
                  <Icon />
                </span>
                <div className="contact-card__body">
                  <div className="contact-card__title">{title}</div>
                  <Text type="supporting" display="block">
                    {description}
                  </Text>
                  <a
                    className="contact-card__link"
                    href={href}
                    {...(external
                      ? {target: '_blank', rel: 'noopener noreferrer'}
                      : {})}
                  >
                    {linkLabel}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-map">
            {/*
              Centrado por coordenada, e não por endereço: com `q=` o Google
              desenha o próprio cartão de local no canto, que aqui brigaria
              com o alfinete e com o cartão de endereço logo abaixo.
            */}
            <iframe
              className="contact-map__frame"
              title="Mapa da localização da Desenhe"
              src={`https://maps.google.com/maps?ll=${SITE.coordinates}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="contact-map__detail">
              <div>
                <div className="contact-card__title">Desenhe · Mercês</div>
                <Text type="supporting" display="block">
                  {SITE.address.street}, {SITE.address.neighborhood},{' '}
                  {SITE.address.city}/{SITE.address.state}
                </Text>
              </div>
              <div className="contact-map__actions">
                <WhatsCta
                  message="Olá! Gostaria de agendar uma visita para conhecer a Desenhe."
                  label="Agendar visita"
                  size="sm"
                />
                <Button
                  label="Como chegar"
                  variant="ghost"
                  size="sm"
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
