/**
 * Tratamento das imagens do blog, usado pelo sync do ClickUp.
 *
 * Foto de celular chega com 3 a 8 MB: aqui ela é girada pela orientação do
 * EXIF, reduzida e convertida para WebP, que é o formato do resto do site.
 * A capa ganha também um JPEG 1200x630 para o preview do link, porque o
 * WhatsApp não gera preview de WebP. Tudo vai para
 * public/images/blog/<slug>/ e entra no commit já otimizado.
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/images/blog';

/** Pasta pública das imagens de um post, criada se não existir. */
function folder(slug) {
  const dir = join(ROOT, slug);
  mkdirSync(dir, {recursive: true});
  return dir;
}

/** Capa: WebP de até 1600px de largura e o JPEG do preview de link. */
export async function saveCover(buffer, slug) {
  const dir = folder(slug);
  const image = sharp(buffer).rotate();
  writeFileSync(
    join(dir, 'capa.webp'),
    await image.clone().resize({width: 1600, withoutEnlargement: true}).webp({quality: 80}).toBuffer(),
  );
  writeFileSync(
    join(dir, 'capa-og.jpg'),
    await image
      .clone()
      .resize({width: 1200, height: 630, fit: 'cover', position: 'attention'})
      .flatten({background: '#171310'})
      .jpeg({quality: 82, mozjpeg: true})
      .toBuffer(),
  );
  return {
    cover: `/images/blog/${slug}/capa.webp`,
    ogImage: `/images/blog/${slug}/capa-og.jpg`,
  };
}

/** Imagem do meio do texto: WebP de até 1400px. Devolve o caminho público. */
export async function saveInline(buffer, slug, name) {
  const file = `${name}.webp`;
  writeFileSync(
    join(folder(slug), file),
    await sharp(buffer).rotate().resize({width: 1400, withoutEnlargement: true}).webp({quality: 80}).toBuffer(),
  );
  return `/images/blog/${slug}/${file}`;
}
