/** Informações institucionais e helpers compartilhados por todo o site. */

export const SITE = {
  name: 'Desenhe · Escola de Arte',
  /** Título das páginas sem título próprio (home). */
  defaultTitle: 'Escola de Desenho e Pintura em Curitiba | Desenhe',
  shortName: 'Desenhe',
  tagline: 'Escola de desenho e pintura em Curitiba há 38 anos',
  description:
    'Escola de arte em Curitiba há 38 anos. Cursos de desenho, pintura, quadrinhos e ilustração para todas as idades, em turmas pequenas, com ensino individualizado.',
  url: 'https://www.desenhe.com.br',
  address: {
    street: 'Rua Padre Anchieta, 265A',
    neighborhood: 'Mercês',
    city: 'Curitiba',
    state: 'PR',
  },
  /**
   * Imagem padrão do preview de link (og:image): a fachada da escola, em
   * JPEG 1200x630. Páginas com imagem própria passam a delas pelo <Seo>.
   */
  ogImage: '/images/brand/og-desenhe.jpg',
  ogImageAlt: 'Fachada da Desenhe, escola de arte na Rua Padre Anchieta, em Curitiba',
  /** Coordenadas da escola, para centrar o mapa embutido em /contato. */
  coordinates: '-25.4265516,-49.2826804',
  whatsapp: '5541987121371',
  whatsappDisplay: '(41) 98712-1371',
  instagram: 'https://www.instagram.com/desenheestudio/',
  facebook: 'https://www.facebook.com/estudiodesenhe',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Padre+Anchieta+265A+Merc%C3%AAs+Curitiba',
  googleReviewUrl:
    'https://www.google.com/search?q=desenhe%20escola%20de%20arte&sourceid=chrome&ie=UTF-8#lrd=0x94dce408114c0f31:0xc92df404ccd5457c,3,,,,',
} as const;

/** Link de WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message: string): string {
  return `https://api.whatsapp.com/send?phone=${SITE.whatsapp}&text=${encodeURIComponent(message)}`;
}

/** Prefixa caminhos de assets com o base path do deploy (GitHub Pages). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  return base.replace(/\/$/, '') + path;
}
