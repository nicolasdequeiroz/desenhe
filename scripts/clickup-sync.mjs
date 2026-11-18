/**
 * Traz os posts do blog do ClickUp para o repositório.
 *
 * Cada tarefa da lista do blog é um post. Quando alguém muda a tarefa para o
 * status "publicar", este script (rodado de hora em hora pelo
 * .github/workflows/blog-clickup.yml) baixa o texto e as imagens, grava
 * content/blog/<slug>.md, public/images/blog/<slug>/ e public/videos/blog/<slug>/, e o workflow faz o
 * commit. Vídeos anexados são convertidos por scripts/blog-video.mjs (precisa
 * de ffmpeg). Só depois do push a tarefa vai para "publicado", com o link do post
 * num comentário: se algo falhar no meio, ela continua em "publicar" e entra
 * de novo na próxima rodada.
 *
 * O post é copiado, não lido do ClickUp a cada build: mexer na tarefa depois
 * não muda o site. Para atualizar um post, basta voltar a tarefa para
 * "publicar"; ele é regravado no mesmo endereço.
 *
 * Uso:
 *   node scripts/clickup-sync.mjs --check   só diz se há tarefa esperando (sem dependências)
 *   node scripts/clickup-sync.mjs           importa as tarefas em "publicar"
 *   node scripts/clickup-sync.mjs --finish  move as importadas para "publicado"
 *   node scripts/clickup-sync.mjs --fail "mensagem"   devolve as importadas com o erro
 *
 * Ambiente: CLICKUP_TOKEN (token pessoal, pk_...) e CLICKUP_LIST_ID.
 * Opcionais: CLICKUP_STATUS_READY (padrão "publicar"),
 * CLICKUP_STATUS_DONE ("publicado"), CLICKUP_STATUS_ERROR ("escrevendo"),
 * BLOG_SYNC_STATE (arquivo de estado entre as etapas, padrão .blog-sync.json).
 */
import {existsSync, readFileSync, readdirSync, rmSync, writeFileSync, appendFileSync} from 'node:fs';
import {join} from 'node:path';

const API = 'https://api.clickup.com/api/v2';
const SITE_URL = 'https://www.desenhe.com.br';
const CONTENT = 'content/blog';
const STATE = process.env.BLOG_SYNC_STATE || '.blog-sync.json';

const TOKEN = process.env.CLICKUP_TOKEN;
const LIST_ID = process.env.CLICKUP_LIST_ID;
const READY = (process.env.CLICKUP_STATUS_READY || 'publicar').toLowerCase();
const DONE = (process.env.CLICKUP_STATUS_DONE || 'publicado').toLowerCase();
const ERROR = (process.env.CLICKUP_STATUS_ERROR || 'escrevendo').toLowerCase();

/**
 * Campos personalizados da lista, pelo nome (sem diferenciar maiúsculas e
 * acentos). Só "Resumo" é obrigatório; os outros têm um valor padrão.
 */
const FIELDS = {
  description: ['resumo'],
  date: ['data de publicacao', 'data'],
  author: ['autora', 'autor', 'autoria'],
  category: ['categoria'],
  coverAlt: ['descricao da capa', 'texto da capa', 'alt da capa'],
  slug: ['endereco', 'slug'],
  course: ['curso relacionado', 'curso'],
  exercise: ['sua vez', 'exercicio', 'desafio'],
};

// ---------------------------------------------------------------- utilidades

const normalize = (text) =>
  String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Endereço a partir do título: até 80 caracteres, sem cortar palavra no meio. */
function slugify(text) {
  const slug = normalize(text).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (slug.length <= 80) return slug;
  const cut = slug.slice(0, 81);
  return cut.slice(0, cut.lastIndexOf('-'));
}

/** Data de hoje em Curitiba, AAAA-MM-DD. */
const today = () =>
  new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo'}).format(new Date());

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif|avif|tiff?)$/i;
const VIDEO_EXT = /\.(mov|mp4|m4v|webm)$/i;

/** Texto literal dentro de uma expressão regular. */
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

async function clickup(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {Authorization: TOKEN, 'Content-Type': 'application/json', ...init.headers},
  });
  if (!response.ok) {
    throw new Error(`ClickUp ${init.method || 'GET'} ${path}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

const comment = (taskId, text) =>
  clickup(`/task/${taskId}/comment`, {
    method: 'POST',
    body: JSON.stringify({comment_text: text, notify_all: false}),
  });

const setStatus = (taskId, status) =>
  clickup(`/task/${taskId}`, {method: 'PUT', body: JSON.stringify({status})});

/** Tarefas da lista no status "publicar" (só id e nome). */
async function readyTasks() {
  const tasks = [];
  for (let page = 0; ; page++) {
    const query = new URLSearchParams({page: String(page), subtasks: 'true'});
    query.append('statuses[]', READY);
    const data = await clickup(`/list/${LIST_ID}/task?${query}`);
    tasks.push(...data.tasks);
    if (data.last_page !== false) break;
  }
  return tasks;
}

/**
 * Baixa um anexo. Os links de anexo do ClickUp costumam ser públicos, mas
 * workspaces com anexos protegidos pedem o token: tenta sem e depois com.
 */
async function download(url) {
  let response = await fetch(url);
  if (response.status === 401 || response.status === 403) {
    response = await fetch(url, {headers: {Authorization: TOKEN}});
  }
  if (!response.ok) throw new Error(`não consegui baixar a imagem ${url} (${response.status})`);
  return Buffer.from(await response.arrayBuffer());
}

/** Valor legível de um campo personalizado, qualquer que seja o tipo. */
function fieldValue(field) {
  const {type, value, type_config: config} = field;
  if (value === undefined || value === null || value === '') return undefined;
  if (type === 'drop_down') {
    const option = config?.options?.find((o) => o.id === value || o.orderindex === Number(value));
    return option?.name;
  }
  if (type === 'labels') {
    return config?.options?.filter((o) => value.includes(o.id)).map((o) => o.label ?? o.name).join(', ');
  }
  if (type === 'date') {
    return new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo'}).format(new Date(Number(value)));
  }
  if (type === 'users') return value.map((u) => u.username).join(', ');
  return typeof value === 'string' ? value.trim() : String(value);
}

function readFields(task) {
  const result = {};
  for (const [key, names] of Object.entries(FIELDS)) {
    const field = task.custom_fields?.find((f) => names.includes(normalize(f.name)));
    if (field) result[key] = fieldValue(field);
  }
  return result;
}

/** Posts que já existem, por id de tarefa: um post atualizado mantém o endereço. */
function existingPosts() {
  const byTask = new Map();
  const slugs = new Set();
  if (!existsSync(CONTENT)) return {byTask, slugs};
  for (const file of readdirSync(CONTENT).filter((f) => f.endsWith('.md'))) {
    const slug = file.slice(0, -3);
    slugs.add(slug);
    const id = readFileSync(join(CONTENT, file), 'utf8').match(/^clickupId:\s*"?([\w-]+)"?/m)?.[1];
    if (id) byTask.set(id, slug);
  }
  return {byTask, slugs};
}

// ---------------------------------------------------------------- importação

async function importTask(summary, existing, {saveCover, saveInline, saveVideo, VideoError, stringify}) {
  const task = await clickup(`/task/${summary.id}?include_markdown_description=true`);
  const fields = readFields(task);
  const errors = [];

  const title = task.name.trim();
  const description = fields.description;
  if (!description) errors.push('preencha o campo "Resumo" (uma ou duas frases sobre o post).');
  if (description && description.length > 300) {
    errors.push(`o "Resumo" tem ${description.length} caracteres; o ideal é até 160 e o máximo, 300.`);
  }

  let body = (task.markdown_description || '').trim();
  if (!body) errors.push('o texto do post (descrição da tarefa) está vazio.');

  const images = (task.attachments || []).filter(
    (a) => IMAGE_EXT.test(a.title || '') || IMAGE_EXT.test(a.extension ? `.${a.extension}` : ''),
  );
  const cover = images.find((a) => normalize(a.title || '').startsWith('capa')) ?? images[0];
  if (!cover) errors.push('anexe a foto de capa à tarefa (de preferência com um nome começando por "capa").');

  const date = fields.date || today();
  const slug = existing.byTask.get(task.id) ?? slugify(fields.slug || title);
  if (!slug) errors.push('não consegui montar o endereço do post a partir do título.');
  if (!existing.byTask.has(task.id) && existing.slugs.has(slug)) {
    errors.push(`já existe um post com o endereço /blog/${slug}. Preencha o campo "Endereço" com outro.`);
  }

  if (errors.length) return {ok: false, task, errors};

  // Imagens: a capa e as do meio do texto, baixadas, convertidas e trocadas
  // pelo caminho no site. Foto em formato que o conversor não lê (HEIC do
  // iPhone, por exemplo) volta para a tarefa como erro, não trava a fila.
  let coverPath;
  let ogImage;
  /** Avisos que não impedem a publicação: vão no comentário de "publicado". */
  const notes = [];
  try {
    // Recomeça a pasta de imagens do post: numa atualização, as fotos que
    // saíram do texto não ficam para trás.
    rmSync(join('public/images/blog', slug), {recursive: true, force: true});
    rmSync(join('public/videos/blog', slug), {recursive: true, force: true});
    ({cover: coverPath, ogImage} = await saveCover(await download(cover.url), slug));

    let index = 0;
    const inline = [...body.matchAll(/!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)/g)];
    for (const [whole, alt, url, caption] of inline) {
      if (!/^https?:\/\//.test(url)) continue;
      index += 1;
      const path = await saveInline(await download(url), slug, `imagem-${index}`);
      const altText = alt && !IMAGE_EXT.test(alt) && normalize(alt) !== 'image' ? alt : '';
      body = body.replace(whole, `![${altText}](${path}${caption ? ` "${caption}"` : ''})`);
    }

    // Vídeos: anexos da tarefa. O lugar de cada um no texto é a linha que
    // traz o nome do arquivo ("tomates.mov", com ou sem "Vídeo:" na frente e
    // com a legenda depois) ou o link que o ClickUp cria ao colar o vídeo na
    // descrição. A linha inteira é trocada pelo vídeo já convertido; colada
    // a uma imagem (sem linha em branco), os dois ficam lado a lado.
    const videos = (task.attachments || []).filter(
      (a) => VIDEO_EXT.test(a.title || '') || VIDEO_EXT.test(a.extension ? `.${a.extension}` : ''),
    );
    for (const attachment of videos) {
      const file = attachment.title || '';
      const names = [...new Set([file, encodeURIComponent(file), encodeURI(file)])].filter(Boolean).map(escapeRegExp);
      if (names.length === 0) continue;
      const name = `(?:${names.join('|')})`;
      const line = new RegExp(
        `^[ \\t]*(?:v[ií]deo\\s*:\\s*)?(?:!?\\[[^\\]]*${name}[^\\]]*\\]\\([^)]*\\)|!?\\[[^\\]]*\\]\\([^)]*${name}[^)]*\\)|${name})[ \\t]*(.*)$`,
        'im',
      );
      const match = body.match(line);
      if (!match) {
        notes.push(`O vídeo "${file}" está anexado, mas não entrou no post: escreva o nome do arquivo sozinho numa linha do texto, no lugar em que ele deve aparecer.`);
        continue;
      }
      const caption = match[1].replace(/^[\s\-|:]+/, '').replace(/^["“”']+|["“”']+$/g, '').trim();
      const extension = (file.match(VIDEO_EXT)?.[1] || attachment.extension || 'mov').toLowerCase();
      const base = slugify(file.replace(VIDEO_EXT, '')) || `video-${videos.indexOf(attachment) + 1}`;
      const path = await saveVideo(await download(attachment.url), slug, base, extension);
      const alt = (caption || file.replace(VIDEO_EXT, '')).replace(/[[\]]/g, '');
      body = body.replace(match[0], `![${alt}](${path}${caption ? ` "${caption.replace(/"/g, "'")}"` : ''})`);
    }
  } catch (error) {
    rmSync(join('public/images/blog', slug), {recursive: true, force: true});
    rmSync(join('public/videos/blog', slug), {recursive: true, force: true});
    const reason = error instanceof VideoError
      ? error.message
      : /unsupported image format|heif/i.test(error.message)
      ? 'uma das imagens está num formato que o site não lê (HEIC do iPhone, por exemplo). Envie em JPG ou PNG.'
      : `não consegui processar as imagens (${error.message}).`;
    return {ok: false, task, errors: [reason]};
  }

  const frontmatter = {
    title,
    description,
    date,
    author: fields.author || task.creator?.username || 'Equipe Desenhe',
    ...(fields.category ? {category: fields.category} : {}),
    cover: coverPath,
    coverAlt: fields.coverAlt || title,
    ogImage,
    ...(fields.course ? {course: fields.course} : {}),
    ...(fields.exercise ? {exercise: fields.exercise} : {}),
    clickupId: task.id,
  };
  writeFileSync(
    join(CONTENT, `${slug}.md`),
    `---\n${stringify(frontmatter, {lineWidth: 0, defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN'})}---\n\n${body}\n`,
  );
  return {ok: true, task, slug, notes, isNew: !existing.byTask.has(task.id)};
}

async function run() {
  const tasks = await readyTasks();
  if (tasks.length === 0) {
    console.log(`Nenhuma tarefa em "${READY}".`);
    writeFileSync(STATE, JSON.stringify({published: []}));
    output('changed', 'false');
    return;
  }

  const [{saveCover, saveInline}, {saveVideo, VideoError}, {stringify}] = await Promise.all([
    import('./blog-images.mjs'),
    import('./blog-video.mjs'),
    import('yaml'),
  ]);
  const existing = existingPosts();
  const published = [];

  for (const summary of tasks) {
    try {
      const result = await importTask(summary, existing, {saveCover, saveInline, saveVideo, VideoError, stringify});
      if (result.ok) {
        console.log(`✔ ${result.task.name} → /blog/${result.slug}`);
        published.push({
          taskId: result.task.id,
          title: result.task.name,
          slug: result.slug,
          isNew: result.isNew,
          notes: result.notes,
        });
        existing.slugs.add(result.slug);
        existing.byTask.set(result.task.id, result.slug);
      } else {
        console.log(`✘ ${result.task.name}: ${result.errors.join(' ')}`);
        await comment(
          result.task.id,
          `O post não foi publicado. Falta ajustar:\n${result.errors.map((e) => `• ${e}`).join('\n')}\n\nDepois de corrigir, volte a tarefa para "${READY}".`,
        );
        await setStatus(result.task.id, ERROR);
      }
    } catch (error) {
      // Erro de rede ou do ClickUp: a tarefa fica como está e entra na próxima rodada.
      console.error(`Erro ao importar ${summary.name}:`, error.message);
    }
  }

  writeFileSync(STATE, JSON.stringify({published}, null, 2));
  output('changed', published.length > 0 ? 'true' : 'false');
  output('titles', published.map((p) => p.title).join('; ').replace(/\n/g, ' '));
}

async function finish() {
  const {published} = JSON.parse(readFileSync(STATE, 'utf8'));
  for (const post of published) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    await comment(
      post.taskId,
      `${post.isNew ? 'Post publicado' : 'Post atualizado'}! Em alguns minutos estará no ar em ${url}${
        post.notes?.length ? `\n\n${post.notes.map((note) => `• ${note}`).join('\n')}` : ''
      }`,
    );
    await setStatus(post.taskId, DONE);
  }
}

async function fail(message) {
  const {published} = JSON.parse(readFileSync(STATE, 'utf8'));
  for (const post of published) {
    await comment(
      post.taskId,
      `O site não aceitou este post, então nada foi publicado. Detalhe técnico: ${message}\n\nQuem cuida do site foi avisado pelo GitHub. Se souber o que é, corrija e volte a tarefa para "${READY}".`,
    );
    await setStatus(post.taskId, ERROR);
  }
}

const [mode, arg] = process.argv.slice(2);

if (!TOKEN || !LIST_ID) {
  // Na consulta de hora em hora, ClickUp ainda não configurado não é erro:
  // o workflow termina em silêncio em vez de falhar (e mandar e-mail) toda
  // hora. Nas outras etapas, sem configuração não há o que fazer.
  if (mode === '--check') {
    console.log('CLICKUP_TOKEN ou CLICKUP_LIST_ID não configurados: nada a sincronizar.');
    output('pending', 'false');
    process.exit(0);
  }
  console.error('Defina CLICKUP_TOKEN e CLICKUP_LIST_ID.');
  process.exit(1);
}
if (mode === '--check') {
  const count = (await readyTasks()).length;
  console.log(`${count} tarefa(s) em "${READY}".`);
  output('pending', count > 0 ? 'true' : 'false');
} else if (mode === '--finish') {
  await finish();
} else if (mode === '--fail') {
  await fail(arg || 'erro no build');
} else {
  await run();
}
