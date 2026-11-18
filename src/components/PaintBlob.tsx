/**
 * Borrão de tinta: uma mancha arredondada de contorno irregular, numa cor.
 * Usado nas amostras da paleta dos posts do blog.
 *
 * O formato é sorteado, mas a partir de uma semente (o texto em `seed`):
 * cada cor ganha um borrão só dela, e ele sai igual no HTML gerado no build
 * e no navegador, sem o React acusar diferença na hidratação.
 */

/** Gerador pseudoaleatório pequeno (mulberry32) alimentado por um hash do texto. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 40;
const CENTER = SIZE / 2;

/** Contorno fechado e suave passando por pontos de raio sorteado em volta do centro. */
function blobPath(seed: string) {
  const random = seededRandom(seed);
  const count = 6 + Math.floor(random() * 4); // 6 a 9 pontos
  const turn = random() * Math.PI * 2;
  const points = Array.from({length: count}, (_, i) => {
    // Ângulo com folga e raio entre 68% e 100% do máximo: irregular, mas sem pontas.
    const angle = turn + ((i + (random() - 0.5) * 0.55) / count) * Math.PI * 2;
    const radius = (CENTER - 1.5) * (0.68 + random() * 0.32);
    return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius];
  });

  // Catmull-Rom fechada convertida em curvas de Bézier.
  const at = (i: number) => points[(i + count) % count];
  const f = (n: number) => n.toFixed(2);
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < count; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(
      p2[0] - (p3[0] - p1[0]) / 6,
    )} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

export function PaintBlob({color, seed, className}: {color: string; seed: string; className?: string}) {
  return (
    <svg className={className} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" focusable="false">
      <path d={blobPath(seed)} fill={color} />
    </svg>
  );
}
