/** Informações institucionais e helpers compartilhados por todo o site. */

export const SITE = {
  name: 'Desenhe · Escola de Arte',
  shortName: 'Desenhe',
  tagline: 'Escola de desenho e pintura em Curitiba há 38 anos',
  description:
    'Cursos de desenho artístico, quadrinhos, desenho de moda, pintura a óleo e acrílica, aquarela e guache e desenho infantil em Curitiba. Turmas pequenas e ensino individualizado, para todas as idades.',
  url: 'https://www.desenhe.com.br',
  address: {
    street: 'Rua Padre Anchieta, 265A',
    neighborhood: 'Mercês',
    city: 'Curitiba',
    state: 'PR',
  },
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
