/**
 * Desenhe — Escola de Arte
 *
 * Tema da marca para o novo site. Direção visual: galeria de arte
 * contemporânea — neutros quentes (papel, gesso) e o laranja da marca
 * (#F67800, extraído do logo atual) como único acento.
 *
 * O laranja puro não tem contraste suficiente para texto branco em
 * botões (WCAG); no modo claro usamos um tom queimado derivado dele,
 * e o vivo fica para o dark mode e elementos decorativos.
 *
 * Tipografia: Courier Prime (monoespaçada tipo máquina de escrever,
 * ecoando o traço do logo) para títulos; Manrope para corpo e parágrafos.
 */

import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export const desenheTheme = defineTheme({
  name: 'desenhe',
  extends: neutralTheme,

  color: {
    accent: '#BC5B00',
    neutralStyle: 'warm',
  },

  typography: {
    scale: {base: 15, ratio: 1.25},
    // O carregamento das fontes é responsabilidade do consumidor:
    // os <link> do Google Fonts estão no index.html.
    heading: {
      family: 'Courier Prime',
      fallbacks: '"Courier New", Courier, monospace',
    },
    body: {
      family: 'Manrope',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
  },

  radius: {base: 4, multiplier: 1},

  tokens: {
    // Laranja da marca: queimado no claro (contraste AA com branco),
    // vivo no escuro (o #F67800 original do logo)
    '--color-accent': ['#BC5B00', '#F67800'],
    // O gerador "warm" tinge os fundos de pêssego forte demais;
    // fixamos tons de papel/gesso mais sutis, quentes porém neutros.
    '--color-background-body': ['#FAF7F3', '#171310'],
    '--color-background-card': ['#FFFFFF', '#1D1813'],
    '--color-background-muted': ['#F2EDE6', '#1D1813'],
    '--color-background-surface': ['#FFFFFF', '#282219'],
    '--color-background-popover': ['#FFFFFF', '#1D1813'],
  },
});
