import {useState, type CSSProperties, type MouseEvent} from 'react';
import {Seo} from '../components/Seo';
import {FaqItem} from '../components/FaqItem';
import {
  BRAND_COLORS,
  BRAND_LOGOS,
  BRAND_PALETTE,
  allowedInks,
  asset,
  brandColor,
  brandLogoFile,
  contrastRatio,
  isOfficialCombo,
  whatsappLink,
  type BrandColor,
  type BrandInk,
} from '../data';

const MESSAGE = 'Olá! Vim pela Central da Marca da Desenhe e preciso de um arquivo da logo.';

const RULES: {ok: boolean; text: string}[] = [
  {ok: true, text: 'Use sempre os arquivos disponibilizados aqui.'},
  {ok: true, text: 'Respeite as cores e as proporções originais.'},
  {ok: true, text: 'Deixe ar em volta da logo: nenhum texto, imagem ou borda encosta nela.'},
  {ok: false, text: 'Não distorça, gire, incline nem aplique efeitos na logo.'},
  {ok: false, text: 'Não use cores de fora do manual nem combinações de baixo contraste.'},
  {ok: false, text: 'Não redigite o nome nem recomponha os elementos das versões.'},
];

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Baixa a logo com o fundo da prévia aplicado. Os arquivos publicados são
 * sempre transparentes; o fundo entra aqui, no navegador: no SVG, um
 * retângulo atrás dos traços; no PNG, o arquivo exportado do Figma
 * desenhado sobre a cor num canvas do mesmo tamanho.
 */
async function downloadWithBackground(url: string, format: 'svg' | 'png', hex: string, fileName: string) {
  let blob: Blob | null;
  if (format === 'svg') {
    const svg = await (await fetch(url)).text();
    const withRect = svg.replace(/<svg([^>]*)>/, `<svg$1><rect width="1080" height="1080" fill="${hex}"/>`);
    blob = new Blob([withRect], {type: 'image/svg+xml'});
  } else {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = hex;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  }
  if (!blob) return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

/**
 * Traduz o contraste numa escala de leitura para quem não conhece a conta.
 * Toda combinação habilitada no painel é aprovada pela marca (e o WCAG
 * isenta logotipos da exigência de contraste), então a escala nunca diz
 * "ruim": vai de Boa a Ótima, com o corte de 4,5:1 do WCAG para texto.
 * As combinações de assinatura (as oficiais do manual e o branco sobre o
 * laranja web) são sempre Ótima, independentemente da conta.
 */
function legibility(ratio: number, signature: boolean): {level: 2 | 3; label: string} {
  return signature || ratio >= 4.5 ? {level: 3, label: 'Ótima'} : {level: 2, label: 'Boa'};
}

/**
 * Configurador no formato dos brand centers de referência (bloomy, IONIC):
 * prévia grande com os downloads no canto e, ao lado, fundo, cor da logo e
 * versão. As 13 cores do manual servem de fundo e de logo; as combinações
 * sem contraste ou fora da regra do manual ficam desabilitadas (ver
 * `allowedInks`).
 */
function LogoConfigurator() {
  const [background, setBackground] = useState<BrandInk>('laranja');
  const [ink, setInk] = useState<BrandInk>('branco');
  const [logoSlug, setLogoSlug] = useState(BRAND_LOGOS[0].slug);
  // O fundo da prévia é ilustrativo: o download só o inclui se pedido.
  const [withBackground, setWithBackground] = useState(false);
  const logo = BRAND_LOGOS.find((item) => item.slug === logoSlug) ?? BRAND_LOGOS[0];
  const allowed = allowedInks(background);
  const bg = brandColor(background);
  const fg = brandColor(ink);
  const ratio = contrastRatio(bg.hex, fg.hex);
  const official = isOfficialCombo(background, ink);
  const reading = legibility(ratio, official || (background === 'laranja-web' && ink === 'branco'));
  const fileName = `desenhe-${logo.slug}-${ink}${withBackground ? `-fundo-${background}` : ''}`;

  const download = (format: 'svg' | 'png') => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!withBackground) return;
    event.preventDefault();
    void downloadWithBackground(event.currentTarget.href, format, bg.hex, `${fileName}.${format}`);
  };

  const pickBackground = (id: BrandInk) => {
    setBackground(id);
    const next = allowedInks(id);
    if (!next.includes(ink)) setInk(next[0]);
  };

  return (
    <div className="brand-center">
      {/* No desktop os downloads ficam sobre o canto da prévia; no celular, abaixo dela. */}
      <div className="brand-center__visual">
        <div className="brand-center__stage" style={{backgroundColor: bg.hex}}>
          <img
            className="brand-center__preview"
            src={asset(brandLogoFile(logo.slug, ink, 'svg'))}
            alt={`${logo.name} em ${fg.name.toLowerCase()} sobre ${bg.name.toLowerCase()}`}
            width={1080}
            height={1080}
          />
        </div>
        <div className="brand-center__downloads">
          <a
            className="brand-center__chip"
            href={asset(brandLogoFile(logo.slug, ink, 'png'))}
            download={`${fileName}.png`}
            onClick={download('png')}
          >
            <DownloadIcon />
            PNG
          </a>
          <a
            className="brand-center__chip"
            href={asset(brandLogoFile(logo.slug, ink, 'svg'))}
            download={`${fileName}.svg`}
            onClick={download('svg')}
          >
            <DownloadIcon />
            SVG
          </a>
          <label className="brand-center__chip brand-center__chip--toggle">
            <input
              type="checkbox"
              checked={withBackground}
              onChange={(event) => setWithBackground(event.target.checked)}
            />
            Exportar com fundo
          </label>
        </div>
      </div>

      <div className="brand-center__panel">
        <fieldset className="brand-center__group">
          <legend className="text-style-label text-color-secondary">
            Fundo <span className="brand-center__picked">{bg.name}</span>
          </legend>
          <div className="brand-center__swatches">
            {BRAND_COLORS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="brand-center__swatch"
                style={{background: item.hex}}
                aria-pressed={item.id === background}
                aria-label={`Fundo ${item.name}`}
                title={item.name}
                onClick={() => pickBackground(item.id)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="brand-center__group">
          <legend className="text-style-label text-color-secondary">
            Logo <span className="brand-center__picked">{fg.name}</span>
          </legend>
          <div className="brand-center__swatches">
            {BRAND_COLORS.map((item) => {
              const enabled = allowed.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className="brand-center__swatch"
                  style={{background: item.hex}}
                  aria-pressed={item.id === ink}
                  aria-label={`Logo ${item.name}`}
                  title={enabled ? item.name : `${item.name}: não combina com este fundo`}
                  disabled={!enabled}
                  onClick={() => setInk(item.id)}
                />
              );
            })}
          </div>
        </fieldset>

        <fieldset className="brand-center__group">
          <legend className="text-style-label text-color-secondary">
            Versão <span className="brand-center__picked">{logo.name}</span>
          </legend>
          <div className="brand-center__versions">
            {BRAND_LOGOS.map((item) => (
              <button
                key={item.slug}
                type="button"
                className="brand-center__version"
                style={{backgroundColor: bg.hex}}
                aria-pressed={item.slug === logo.slug}
                aria-label={item.name}
                title={item.name}
                onClick={() => setLogoSlug(item.slug)}
              >
                <img src={asset(brandLogoFile(item.slug, ink, 'svg'))} alt="" />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="brand-center__summary">
          <span
            className={`brand-center__badge text-size-small${official ? ' brand-center__badge--official' : ''}`}
          >
            {official ? 'Combinação oficial' : 'Combinação estendida'}
          </span>
          <div
            className={`brand-center__reading brand-center__reading--${reading.level}`}
            title={`Contraste ${ratio.toFixed(1).replace('.', ',')}:1`}
          >
            <span className="text-style-label text-color-secondary">Leitura</span>
            <span className="brand-center__meter" aria-hidden="true">
              {[1, 2, 3].map((bar) => (
                <span key={bar} className={bar <= reading.level ? 'is-on' : undefined} />
              ))}
            </span>
            <span className="text-size-small">{reading.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Amostra de cor com hex e CMYK; clicar copia o hex. */
function PaletteSwatch({color, note}: {color: BrandColor; note?: string}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(color.hex).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <button type="button" className="brand-palette__item" onClick={copy} title={`Copiar ${color.hex}`}>
      <span className="brand-palette__chip" style={{background: color.hex}} aria-hidden="true" />
      <span className="heading-style-h6">{color.name}</span>
      {note && <span className="text-style-label text-color-accent">{note}</span>}
      <span className="text-size-small text-color-secondary">
        {copied ? 'Copiado!' : color.hex}
        <br />
        CMYK {color.cmyk}
      </span>
    </button>
  );
}

export function CentralDaMarca() {
  return (
    <>
      <Seo
        title="Central da Marca"
        description="Logos oficiais da Desenhe em SVG e PNG, nas versões e cores do manual da marca, com as regras de uso e a paleta de cores."
        path="/central-da-marca"
        image="/images/og/og-central-da-marca.jpg"
        imageAlt="Configurador de logo da Central da Marca da Desenhe, com a logo branca sobre fundo laranja"
      />

      <section className="section brand-page">
        <div className="container">
          <LogoConfigurator />

          <div className="coworking-faq brand-page__accordions">
            <FaqItem question="Quando usar cada versão">
              <ul className="brand-page__uses">
                {BRAND_LOGOS.map((item) => (
                  <li key={item.slug}>
                    <img
                      className="brand-page__use-thumb"
                      src={asset(brandLogoFile(item.slug, 'branco', 'svg'))}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                    />
                    <div className="brand-page__use-copy">
                      <span className="heading-style-h6">{item.name}</span>
                      <p className="text-size-regular text-color-secondary">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </FaqItem>
            <FaqItem question="Paleta de cores">
              <div className="brand-palette">
                {BRAND_PALETTE.map((group) => (
                  <div key={group.title} className="brand-palette__group">
                    <h3 className="heading-style-h6">{group.title}</h3>
                    <p className="text-size-regular text-color-secondary">{group.description}</p>
                    <div
                      className="brand-palette__grid"
                      // Colunas que fecham as linhas: 4 cores numa linha, 6 e 9 em três.
                      style={{'--palette-columns': group.colors.length % 4 === 0 ? 4 : 3} as CSSProperties}
                    >
                      {group.colors.map(({id, note}) => (
                        <PaletteSwatch key={id} color={brandColor(id)} note={note} />
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-size-small text-color-secondary">
                  Valores CMYK de partida, sujeitos a prova de cor na gráfica.
                </p>
              </div>
            </FaqItem>
          </div>

          <div className="brand-page__intro">
            <h1 className="heading-style-h2">Central da Marca da Desenhe</h1>
            <p className="text-size-large text-color-secondary">
              Aqui você encontra os arquivos oficiais da marca para usar em apresentações,
              parcerias e materiais impressos ou digitais, sempre com a identidade da escola
              aplicada do jeito certo.
            </p>
            <p className="text-size-large text-color-secondary">
              Use o painel acima para escolher a versão da logo: selecione o fundo onde ela
              vai entrar, a cor da logo e a versão. Todas as cores do manual estão lá. As
              quatro combinações oficiais (branco sobre laranja, laranja ou preto sobre
              branco, branco sobre preto) são as do dia a dia; as demais seguem a mesma regra,
              nome escuro em fundo claro e nome claro em fundo escuro ou colorido, e só
              aparecem quando a logo continua legível.
            </p>

            <ul className="brand-page__rules">
              {RULES.map((rule) => (
                <li key={rule.text} className="text-size-large">
                  <span
                    className={`brand-page__rule-mark brand-page__rule-mark--${rule.ok ? 'ok' : 'no'}`}
                    aria-label={rule.ok ? 'Faça' : 'Não faça'}
                  >
                    {rule.ok ? '✓' : '✕'}
                  </span>
                  {rule.text}
                </li>
              ))}
            </ul>

            <p className="text-size-large text-color-secondary">
              As logos estão em PNG (uso digital rápido) e SVG (vetor, para qualquer
              tamanho), em quadrados de 1080x1080 e sempre com fundo transparente: o fundo do
              painel serve só para visualizar a combinação. Se precisar dele no arquivo, marque
              "Exportar com fundo" antes de baixar. Sempre que possível, prefira o SVG para
              impressos e grandes formatos.
            </p>
            <p className="text-size-large text-color-secondary">
              Precisa de outro formato ou ficou em dúvida?{' '}
              <a
                className="brand-page__link"
                href={whatsappLink(MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chame a gente no WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
