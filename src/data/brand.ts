/**
 * Central da Marca: versões da logo, combinações de cor e paleta.
 *
 * A fonte é o Manual da Marca no Figma, página "Central da Marca": um
 * component set `Logo` (Versão × Cor) e um frame 1080x1080 por combinação,
 * exportado em SVG e PNG (fundo transparente) para
 * `public/images/brand/central/desenhe-{versão}-{cor}.{svg,png}`.
 * Para trocar uma logo, exporte de novo o frame com o mesmo nome.
 */

export type BrandInk =
  | 'laranja'
  | 'branco'
  | 'preto'
  | 'laranja-web'
  | 'laranja-quente'
  | 'terracota'
  | 'vermelho'
  | 'amarelo'
  | 'turquesa'
  | 'turquesa-claro'
  | 'bege'
  | 'cafe'
  | 'chumbo';

export type BrandUsage = 'Uso primário' | 'Uso secundário' | 'Complemento';

export interface BrandLogo {
  slug: string;
  name: string;
  usage: BrandUsage;
  description: string;
}

/**
 * Na ordem da hierarquia de uso: logo primária e box logo, monograma e,
 * por fim, os complementos (selos e lockup com tagline lado a lado).
 */
export const BRAND_LOGOS: BrandLogo[] = [
  {
    slug: 'primaria',
    name: 'Logo primária',
    usage: 'Uso primário',
    description: 'A assinatura do dia a dia. Na dúvida, comece por ela.',
  },
  {
    slug: 'box',
    name: 'Box logo',
    usage: 'Uso primário',
    description: 'Maior impacto: produtos, redes sociais, camisetas e foto de perfil.',
  },
  {
    slug: 'monograma',
    name: 'Monograma DSN',
    usage: 'Uso secundário',
    description: 'Para espaços pequenos: ícone de perfil, favicon e detalhes.',
  },
  {
    slug: 'selo-redondo',
    name: 'Selo redondo',
    usage: 'Complemento',
    description: 'Chancela de tradição: certificados, produtos e convites.',
  },
  {
    slug: 'tagline',
    name: 'Lockup com tagline',
    usage: 'Complemento',
    description: 'Apresenta a escola a quem ainda não a conhece.',
  },
  {
    slug: 'selo-vertical',
    name: 'Selo vertical',
    usage: 'Complemento',
    description: 'Rodapés, etiquetas e impressos. Nunca junto do selo redondo.',
  },
  {
    slug: 'assinatura',
    name: 'Assinatura à mão livre',
    usage: 'Complemento',
    description: 'Toque autoral em campanhas e eventos. Não substitui a logo.',
  },
];

/**
 * Tom de cada cor, para a regra do manual: "nome escuro em fundo claro,
 * nome branco em fundo escuro ou colorido".
 */
export type BrandTone = 'claro' | 'colorido' | 'escuro';

export interface BrandColor {
  /** Também é o sufixo do arquivo exportado (`desenhe-primaria-cafe.svg`). */
  id: BrandInk;
  name: string;
  hex: string;
  tone: BrandTone;
  /** Valores de partida da tabela de impressão do manual. */
  cmyk: string;
}

/**
 * Todas as cores do manual (paleta primária, escala sequencial e usos
 * internos). A logo existe em cada uma delas, e cada uma serve de fundo na
 * prévia. A ordem é a dos seletores: as três da logo oficial primeiro.
 */
export const BRAND_COLORS: BrandColor[] = [
  {id: 'laranja', name: 'Laranja Desenhe', hex: '#DF7400', tone: 'colorido', cmyk: '0 / 55 / 100 / 5'},
  {id: 'branco', name: 'Branco', hex: '#FFFFFF', tone: 'claro', cmyk: '0 / 0 / 0 / 0'},
  {id: 'preto', name: 'Preto', hex: '#000000', tone: 'escuro', cmyk: '0 / 0 / 0 / 100'},
  {id: 'laranja-web', name: 'Laranja web', hex: '#F67800', tone: 'colorido', cmyk: '0 / 52 / 100 / 0'},
  {id: 'laranja-quente', name: 'Laranja quente', hex: '#D55415', tone: 'colorido', cmyk: '0 / 65 / 95 / 10'},
  {id: 'terracota', name: 'Terracota', hex: '#A3471A', tone: 'colorido', cmyk: '0 / 60 / 90 / 35'},
  {id: 'vermelho', name: 'Vermelho', hex: '#CD3E28', tone: 'colorido', cmyk: '0 / 70 / 85 / 15'},
  {id: 'amarelo', name: 'Amarelo', hex: '#F6A12B', tone: 'colorido', cmyk: '0 / 37 / 85 / 0'},
  {id: 'turquesa', name: 'Turquesa', hex: '#6BAAA1', tone: 'colorido', cmyk: '58 / 15 / 38 / 5'},
  {id: 'turquesa-claro', name: 'Turquesa claro', hex: '#B8CDB5', tone: 'claro', cmyk: '28 / 10 / 32 / 0'},
  {id: 'bege', name: 'Bege', hex: '#FFF4E0', tone: 'claro', cmyk: '0 / 4 / 12 / 0'},
  {id: 'cafe', name: 'Café', hex: '#552A15', tone: 'escuro', cmyk: '25 / 60 / 80 / 55'},
  {id: 'chumbo', name: 'Chumbo', hex: '#1E1E1E', tone: 'escuro', cmyk: '0 / 0 / 0 / 90'},
];

export function brandColor(id: BrandInk): BrandColor {
  return BRAND_COLORS.find((color) => color.id === id) ?? BRAND_COLORS[0];
}

/** As quatro combinações do manual ("Versões de cor"), como `fundo/logo`. */
const OFFICIAL_COMBOS = ['laranja/branco', 'branco/laranja', 'branco/preto', 'preto/branco'];

export function isOfficialCombo(background: BrandInk, ink: BrandInk): boolean {
  return OFFICIAL_COMBOS.includes(`${background}/${ink}`);
}

/** Contraste WCAG entre duas cores hex (de 1 a 21). */
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Contraste mínimo para a logo. 3:1 é o limite WCAG para elementos
 * gráficos e texto grande, e é onde ficam as combinações oficiais com o
 * laranja Desenhe (3,2:1).
 */
const MIN_CONTRAST = 3;

/**
 * Exceções aprovadas pela marca, além da regra geral. Os dois laranjas
 * principais têm as mesmas opções de logo: branca ou bege (creme), mesmo
 * abaixo de 3:1 (2,9:1 e 2,6:1 para o bege), e preto, café ou chumbo. No
 * laranja Desenhe as escuras entram aqui porque a regra de fundo colorido
 * só as libera quando nenhuma cor clara passa no contraste.
 */
const EXTRA_INKS: Partial<Record<BrandInk, BrandInk[]>> = {
  laranja: ['branco', 'bege', 'preto', 'cafe', 'chumbo'],
  'laranja-web': ['branco', 'bege'],
  // Turquesa também aceita logo clara: branco (2,7:1) e bege (2,4:1).
  turquesa: ['branco', 'bege'],
};

/**
 * Cores de logo permitidas sobre um fundo, estendendo a regra do manual às
 * demais cores: em fundo claro, logo escura ou colorida; em fundo escuro,
 * logo clara ou colorida; em fundo colorido, logo clara (branco, bege) e,
 * só quando nenhuma clara tem contraste, escura. Nunca abaixo de 3:1, salvo
 * as exceções de `EXTRA_INKS`. A lista segue a ordem de `BRAND_COLORS`.
 */
export function allowedInks(background: BrandInk): BrandInk[] {
  const bg = brandColor(background);
  const legible = BRAND_COLORS.filter(
    (ink) => ink.id !== bg.id && contrastRatio(bg.hex, ink.hex) >= MIN_CONTRAST,
  );
  let allowed: BrandColor[];
  if (bg.tone === 'colorido') {
    const light = legible.filter((ink) => ink.tone === 'claro');
    allowed = light.length ? light : legible.filter((ink) => ink.tone === 'escuro');
  } else {
    allowed = legible.filter((ink) => ink.tone !== bg.tone);
  }
  const extra = EXTRA_INKS[background] ?? [];
  return BRAND_COLORS.filter((ink) => allowed.includes(ink) || extra.includes(ink.id)).map(
    (ink) => ink.id,
  );
}

/** Caminho (sem o base path) de um arquivo exportado do Figma. */
export function brandLogoFile(slug: string, ink: BrandInk, format: 'svg' | 'png'): string {
  return `/images/brand/central/desenhe-${slug}-${ink}.${format}`;
}

export interface BrandPaletteGroup {
  title: string;
  description: string;
  colors: {id: BrandInk; note?: string}[];
}

/** Os três blocos de cor do manual, para o acordeão da paleta. */
export const BRAND_PALETTE: BrandPaletteGroup[] = [
  {
    title: 'Paleta primária',
    description: 'O laranja lidera e os neutros apoiam: um laranja em destaque, um fundo que o valorize e texto num tom que se leia sem esforço.',
    colors: [
      {id: 'laranja-web'},
      {id: 'laranja'},
      {id: 'laranja-quente'},
      {id: 'terracota'},
      {id: 'bege'},
      {id: 'preto'},
      {id: 'chumbo'},
      {id: 'cafe'},
      {id: 'branco'},
    ],
  },
  {
    title: 'Escala sequencial',
    description: 'Para quando a cor carrega informação (volume, etapas, intensidade). Respeite a ordem: do amarelo, mais suave, ao vermelho, mais forte.',
    colors: [{id: 'amarelo'}, {id: 'laranja'}, {id: 'laranja-quente'}, {id: 'vermelho'}],
  },
  {
    title: 'Usos internos',
    description: 'Um tom para cada frente da escola, para materiais, calendários e salas se identificarem num relance.',
    colors: [
      {id: 'amarelo', note: 'Eventos de verão'},
      {id: 'laranja', note: 'Institucional'},
      {id: 'laranja-quente', note: 'Cursos de desenho'},
      {id: 'vermelho', note: 'Cursos de pintura'},
      {id: 'turquesa', note: 'Professores'},
      {id: 'turquesa-claro', note: 'Eventos de inverno'},
    ],
  },
];
