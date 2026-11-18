/**
 * Paleta automática dos posts do blog: as cores principais das imagens do
 * próprio post (capa, fotos e cartazes dos vídeos), tiradas no build.
 *
 * Quem escreve não precisa fazer nada. Uma lista "Paleta" escrita no texto
 * (com os pigmentos de verdade, "Azul ultramar #1f3a93") continua valendo e
 * tem prioridade: ver scripts/blog-markdown.ts.
 *
 * O método: cada imagem é reduzida a poucos pixels, os pixels de todas são
 * agrupados por k-means em espaço RGB, e saem os grupos mais representativos,
 * dando peso à saturação (uma pintura interessa pelas cores, não pelo cinza
 * da mesa) e descartando os parecidos demais entre si. Cada cor ganha um nome
 * descritivo em português a partir do matiz e da luminosidade.
 */
import {existsSync} from 'node:fs';
import sharp from 'sharp';

type RGB = [number, number, number];

/** Cores na paleta: o bastante para dizer algo, pouco para não virar ruído. */
const COLORS = 5;
const CLUSTERS = 10;
/** Distância mínima (RGB) entre duas cores da paleta. */
const MIN_DISTANCE = 52;

const distance = (a: RGB, b: RGB) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function toHsl([r, g, b]: RGB) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return {h: 0, s: 0, l};
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0) : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
  h *= 60;
  return {h, s, l};
}

/** Nome descritivo e curto: "Vermelho escuro", "Azul claro", "Ocre". */
export function colorName(rgb: RGB) {
  const {h, s, l} = toHsl(rgb);
  // Quase branco é o papel, mesmo puxando um pouco para o quente.
  if (l > 0.9) return 'Branco';
  if (s < 0.12 || (s < 0.2 && (l < 0.15 || l > 0.85))) {
    if (l > 0.9) return 'Branco';
    if (l > 0.7) return 'Cinza claro';
    if (l > 0.4) return 'Cinza';
    if (l > 0.15) return 'Grafite';
    return 'Preto';
  }
  // Tons quentes pouco saturados são os da madeira, do papel e da terra.
  if (s < 0.3 && h >= 15 && h < 60) return l > 0.55 ? 'Bege' : 'Marrom';

  let name: string;
  if (h < 15 || h >= 340) name = l > 0.68 ? 'Rosa' : 'Vermelho';
  else if (h < 40) name = l < 0.38 ? 'Marrom' : l > 0.7 ? 'Pêssego' : 'Laranja';
  else if (h < 52) name = l < 0.45 ? 'Ocre' : 'Amarelo-ouro';
  else if (h < 68) name = l < 0.38 ? 'Oliva' : 'Amarelo';
  else if (h < 160) name = l < 0.38 && h < 95 ? 'Oliva' : 'Verde';
  else if (h < 195) name = 'Verde-água';
  else if (h < 250) name = 'Azul';
  else if (h < 285) name = l > 0.62 ? 'Lilás' : 'Violeta';
  else name = l > 0.62 ? 'Rosa' : 'Magenta';

  // Um único ajuste, para o nome não virar uma frase.
  const fixed = ['Marrom', 'Pêssego', 'Ocre', 'Oliva', 'Rosa', 'Lilás'].includes(name);
  if (!fixed && l < 0.3) return `${name} escuro`;
  if (!fixed && l > 0.72) return `${name} claro`;
  if (s < 0.3) return `${name} acinzentado`;
  return name;
}

const toHex = (rgb: RGB) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

async function samplePixels(file: string) {
  const {data} = await sharp(file)
    .resize(64, 64, {fit: 'inside'})
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
  const pixels: RGB[] = [];
  for (let i = 0; i < data.length; i += 3) pixels.push([data[i], data[i + 1], data[i + 2]]);
  return pixels;
}

/** k-means com início determinístico (pixels espaçados), para o build sair sempre igual. */
function kmeans(pixels: RGB[], k: number) {
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centers: RGB[] = Array.from({length: k}, (_, i) => [...pixels[(i * step) % pixels.length]] as RGB);
  let counts = new Array(k).fill(0);
  for (let round = 0; round < 12; round++) {
    const sums = centers.map(() => [0, 0, 0]);
    counts = new Array(k).fill(0);
    for (const pixel of pixels) {
      let best = 0;
      let bestDistance = Infinity;
      centers.forEach((center, index) => {
        const d = distance(pixel, center);
        if (d < bestDistance) {
          bestDistance = d;
          best = index;
        }
      });
      counts[best]++;
      sums[best][0] += pixel[0];
      sums[best][1] += pixel[1];
      sums[best][2] += pixel[2];
    }
    centers = centers.map((center, index) =>
      counts[index] ? (sums[index].map((v) => v / counts[index]) as RGB) : center,
    );
  }
  return centers.map((rgb, index) => ({rgb, count: counts[index]}));
}

/**
 * Paleta das imagens (caminhos absolutos no disco). Devolve lista vazia se
 * nenhuma imagem puder ser lida ou se elas não renderem três cores
 * diferentes: aí o post simplesmente fica sem paleta.
 */
export async function extractPalette(files: string[]) {
  const pixels: RGB[] = [];
  for (const file of files) {
    if (!existsSync(file)) continue;
    try {
      pixels.push(...(await samplePixels(file)));
    } catch {
      // Arquivo que o conversor não lê: segue com os outros.
    }
  }
  if (pixels.length < CLUSTERS) return [];

  const ranked = kmeans(pixels, CLUSTERS)
    .filter((cluster) => cluster.count > pixels.length * 0.02)
    .map((cluster) => ({...cluster, score: cluster.count * (0.25 + toHsl(cluster.rgb).s)}))
    .sort((a, b) => b.score - a.score);

  // Cores distantes entre si e com nomes diferentes: três "Laranja" seguidos
  // não dizem nada a quem lê.
  const chosen: RGB[] = [];
  const names = new Set<string>();
  for (const {rgb} of ranked) {
    const name = colorName(rgb);
    if (names.has(name) || chosen.some((other) => distance(other, rgb) < MIN_DISTANCE)) continue;
    chosen.push(rgb);
    names.add(name);
    if (chosen.length === COLORS) break;
  }

  // Desenho a grafite também tem paleta: os valores do branco ao preto.
  // Só fica sem paleta a imagem que não rende nem três cores com nomes
  // diferentes.
  if (chosen.length < 3) return [];

  // Do mais escuro ao mais claro dentro de cada matiz: a lista lê como uma paleta.
  return chosen
    .sort((a, b) => toHsl(a).h - toHsl(b).h || toHsl(a).l - toHsl(b).l)
    .map((rgb) => ({name: colorName(rgb), hex: toHex(rgb)}));
}
