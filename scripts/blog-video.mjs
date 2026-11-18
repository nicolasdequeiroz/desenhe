/**
 * Tratamento dos vídeos do blog, usado pelo sync do ClickUp.
 *
 * De um vídeo qualquer (MOV de iPhone, MP4 de câmera) saem os três arquivos
 * que um post precisa, em public/videos/blog/<slug>/:
 *   nome.mp4       completo, com som, 720px de largura: abre no visor
 *   nome-loop.mp4  mudo, 540px, até 12s: toca em loop dentro do texto
 *   nome.webp      cartaz (primeiro quadro)
 *
 * Vídeo de iPhone vem em HDR (HLG): sem conversão para SDR ele fica lavado
 * nos navegadores. A conversão usa o filtro zscale do ffmpeg (presente no
 * ffmpeg do Ubuntu, que é o que o workflow instala). No macOS, onde o ffmpeg
 * do Homebrew não traz o zscale, o `avconvert` do sistema faz esse passo.
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/videos/blog';

/** Duração máxima aceita: o vídeo mora no repositório e no site, tem que ser leve. */
export const MAX_SECONDS = 90;
/** O loop do texto é só uma amostra em movimento. */
const LOOP_SECONDS = 12;

/** Erro com mensagem para quem escreveu o post (vai para o comentário da tarefa). */
export class VideoError extends Error {}

const run = (command, args) =>
  execFileSync(command, args, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024});

function probe(file) {
  const data = JSON.parse(
    run('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,color_transfer:format=duration', '-of', 'json', file]),
  );
  const video = data.streams?.find((stream) => stream.codec_type === 'video');
  if (!video) throw new VideoError('o arquivo não parece ser um vídeo.');
  return {
    duration: Number(data.format?.duration) || 0,
    hdr: ['arib-std-b67', 'smpte2084'].includes(video.color_transfer),
    hasAudio: data.streams.some((stream) => stream.codec_type === 'audio'),
  };
}

const hasZscale = () => /\bzscale\b/.test(run('ffmpeg', ['-hide_banner', '-filters']));

/** HDR para SDR com tone mapping, no próprio ffmpeg. */
const TONEMAP =
  'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p';

/**
 * Converte o vídeo e devolve o caminho público do arquivo completo
 * (`/videos/blog/<slug>/<name>.mp4`), que é o que vai no Markdown do post.
 */
export async function saveVideo(buffer, slug, name, extension = 'mov') {
  const work = mkdtempSync(join(tmpdir(), 'blog-video-'));
  try {
    let source = join(work, `original.${extension}`);
    writeFileSync(source, buffer);

    const info = probe(source);
    if (info.duration > MAX_SECONDS) {
      throw new VideoError(
        `o vídeo tem ${Math.round(info.duration)} segundos; o máximo é ${MAX_SECONDS}. Envie um trecho mais curto.`,
      );
    }

    let filters = [];
    if (info.hdr) {
      if (hasZscale()) {
        filters = [TONEMAP];
      } else if (process.platform === 'darwin') {
        const sdr = join(work, 'sdr.mov');
        run('avconvert', ['--preset', 'Preset1920x1080', '--source', source, '--output', sdr]);
        source = sdr;
      } else {
        throw new VideoError('o vídeo está em HDR e este ffmpeg não tem o filtro zscale para converter.');
      }
    }

    const dir = join(ROOT, slug);
    mkdirSync(dir, {recursive: true});
    const encode = (width, extra, output) =>
      run('ffmpeg', [
        '-hide_banner', '-loglevel', 'error', '-y', '-i', source,
        // Nunca amplia: um vídeo menor que o alvo fica do tamanho que veio.
        '-vf', [...filters, `scale='min(${width},iw)':-2`].join(','),
        '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
        ...extra,
        '-movflags', '+faststart', output,
      ]);

    const full = join(dir, `${name}.mp4`);
    encode(720, ['-crf', '24', ...(info.hasAudio ? ['-c:a', 'aac', '-b:a', '96k'] : ['-an'])], full);
    encode(540, ['-crf', '27', '-an', '-t', String(LOOP_SECONDS)], join(dir, `${name}-loop.mp4`));

    // Cartaz: primeiro quadro do vídeo já convertido, em WebP como o resto do site.
    const frame = join(work, 'cartaz.png');
    run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', full, '-frames:v', '1', frame]);
    await sharp(frame).webp({quality: 80}).toFile(join(dir, `${name}.webp`));

    return `/videos/blog/${slug}/${name}.mp4`;
  } catch (error) {
    if (error instanceof VideoError) throw error;
    if (error.code === 'ENOENT') throw new VideoError('o conversor de vídeo (ffmpeg) não está instalado.');
    throw new VideoError(`não consegui converter o vídeo (${String(error.stderr || error.message).trim().split('\n').pop()}).`);
  } finally {
    rmSync(work, {recursive: true, force: true});
  }
}
