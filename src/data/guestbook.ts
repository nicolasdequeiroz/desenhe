/**
 * Livro de visitas desenhado do rodapé.
 *
 * O desenho não é salvo como imagem, e sim como traços vetoriais com
 * coordenadas normalizadas (0..1) — assim o mesmo dado é redesenhado tanto no
 * quadro grande quanto nas miniaturas da pilha, sempre nítido, e o payload cabe
 * numa célula de planilha.
 *
 * Persistência: um Web App do Google Apps Script gravando numa Planilha Google
 * (mesma abordagem do site que serviu de referência). Enquanto o endpoint não
 * estiver configurado, tudo funciona só no navegador de quem desenhou.
 * Instruções de instalação: `apps-script/README.md`.
 */

/** Cole aqui a URL /exec publicada pelo Apps Script para ativar o modo remoto. */
export const GUESTBOOK_ENDPOINT = '';

/** Um traço: cor, espessura (fração da largura) e pontos [x0,y0,x1,y1,...]. */
export interface Stroke {
  c: string;
  w: number;
  p: number[];
}

export interface Doodle {
  id: string;
  name: string;
  createdAt: string;
  strokes: Stroke[];
}

const LOCAL_KEY = 'desenhe:guestbook';
/** Proporção do quadro de desenho — usada no quadro e nas miniaturas. */
export const DOODLE_RATIO = 4 / 3;

export const isRemoteEnabled = () => GUESTBOOK_ENDPOINT.length > 0;

/* ---------- Desenho ---------- */

/** Redesenha os traços num contexto 2D de tamanho arbitrário. */
export function renderStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const stroke of strokes) {
    const {p} = stroke;
    if (p.length < 2) continue;

    ctx.strokeStyle = stroke.c;
    ctx.lineWidth = Math.max(1, stroke.w * width);
    ctx.beginPath();
    ctx.moveTo(p[0] * width, p[1] * height);

    if (p.length === 2) {
      // Ponto isolado: um tracinho mínimo, senão nada é pintado.
      ctx.lineTo(p[0] * width + 0.01, p[1] * height);
    } else {
      for (let i = 2; i < p.length; i += 2) {
        ctx.lineTo(p[i] * width, p[i + 1] * height);
      }
    }
    ctx.stroke();
  }
}

/* ---------- Armazenamento local ---------- */

function readLocal(): Doodle[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(doodles: Doodle[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(doodles.slice(-60)));
  } catch {
    /* cota estourada: o desenho ainda foi enviado ao servidor */
  }
}

/* ---------- API ---------- */

/**
 * Lista os desenhos. Os enviados por este navegador entram sempre, mesmo que a
 * planilha ainda não os tenha devolvido — quem desenhou vê o próprio na hora.
 */
export async function listDoodles(): Promise<Doodle[]> {
  const local = readLocal();
  if (!isRemoteEnabled()) return local;

  try {
    const response = await fetch(`${GUESTBOOK_ENDPOINT}?action=list`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const remote: Doodle[] = await response.json();
    const seen = new Set(remote.map((d) => d.id));
    return [...remote, ...local.filter((d) => !seen.has(d.id))];
  } catch {
    return local;
  }
}

/**
 * Envia um desenho. Grava local primeiro para nunca perder o traço do visitante
 * e só então tenta a planilha; devolve se a gravação remota deu certo.
 */
export async function submitDoodle(
  name: string,
  strokes: Stroke[],
): Promise<{stored: 'remote' | 'local'}> {
  const doodle: Doodle = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim().slice(0, 24) || 'Anônimo',
    createdAt: new Date().toISOString(),
    strokes,
  };

  writeLocal([...readLocal(), doodle]);
  if (!isRemoteEnabled()) return {stored: 'local'};

  try {
    /*
     * text/plain de propósito: o Apps Script não responde ao preflight OPTIONS,
     * então a requisição precisa ser "simples" (sem header customizado).
     */
    const response = await fetch(GUESTBOOK_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify(doodle),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return {stored: 'remote'};
  } catch {
    return {stored: 'local'};
  }
}
