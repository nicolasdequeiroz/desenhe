import {useId} from 'react';

/**
 * Selo da Exposição colaborativa de fim de ano (2026), desenhado no Figma
 * (arquivo Social Media, "Group 3"): disco escuro com borda laranja, fio
 * interno, a marca DSN no centro e "EXPO DE FIM DE ANO" correndo em volta.
 *
 * Só o anel de texto gira, devagar e sem parar; o disco e a marca ficam
 * parados. O texto é texto de verdade num caminho circular (Courier Prime,
 * a fonte de títulos do site), não o contorno exportado do Figma, que
 * pesava 45 KB. Com "reduzir movimento" ligado, o anel fica parado.
 *
 * Use sempre que a exposição aparecer no site: no card do destaque da home
 * e no pop-up da exposição. O tamanho vem do CSS de quem usa (largura).
 */
export function ExpoSeal({className}: {className?: string}) {
  // Id único por instância: o card e o pop-up podem estar na tela juntos.
  const ring = `expo-seal-ring-${useId().replace(/:/g, '')}`;

  return (
    <svg
      className={['expo-seal', className].filter(Boolean).join(' ')}
      viewBox="0 0 294 294"
      role="img"
      aria-label="Selo da exposição de fim de ano da Desenhe"
    >
      <circle cx="147" cy="147" r="125" fill="#1e1e1e" stroke="#f67800" strokeWidth="10" />
      <circle cx="147" cy="147" r="75.14" fill="none" stroke="#f67800" strokeWidth="2" />
      <defs>
        {/* Círculo do texto, no sentido horário a partir do alto. */}
        <path id={ring} d="M147 57a90 90 0 1 1 0 180a90 90 0 1 1 0 -180" />
      </defs>
      <g className="expo-seal__ring">
        <text className="expo-seal__text">
          <textPath href={`#${ring}`} textLength="565" lengthAdjust="spacing">
            EXPO DE FIM DE ANO · EXPO DE FIM DE ANO ·
          </textPath>
        </text>
      </g>
      {/* Marca DSN, como no Figma (já inclinada). */}
      <g fill="#fff4e0">
        <path d="M105.51 167.93C104.75 167.72 104.29 166.94 104.5 166.17L119.81 109.02C120.02 108.26 120.8 107.81 121.57 108.01L125.64 109.1C134.26 111.41 137.16 115.74 130.02 142.39C122.86 169.11 118.2 171.33 109.74 169.06L105.51 167.93ZM123.7 140.69C129.82 117.83 128.8 115.95 124.85 114.89C124.81 114.88 124.76 114.9 124.75 114.95L111.71 163.59C111.7 163.64 111.73 163.68 111.77 163.69C115.73 164.75 117.55 163.63 123.7 140.69Z" />
        <path d="M153.74 116.21C158.56 117.5 161.04 121.55 157.77 133.77L157.02 136.56C156.81 137.32 156.03 137.78 155.26 137.57L152.5 136.83C151.73 136.63 151.28 135.84 151.48 135.08L152.15 132.6C154.26 124.71 153.95 121.76 152.45 121.36C151.26 121.04 149.66 122.89 148.84 125.97C144.76 141.18 152.98 152.26 148.67 168.34C147.13 174.1 143.33 178.49 137.87 177.02C133.05 175.73 130.49 171.67 133.77 159.44L134.28 157.52C134.49 156.75 135.27 156.3 136.04 156.51L138.8 157.25C139.57 157.45 140.02 158.24 139.82 159L139.37 160.69C137.27 168.5 137.56 171.53 139.14 171.96C140.65 172.36 142.02 169.77 142.74 167.09C146.6 152.66 138.36 141.66 142.9 124.71C144.53 118.64 148.92 114.92 153.74 116.21Z" />
        <path d="M176.93 122.85C177.63 123.03 178.08 123.71 177.98 124.43L171.55 170.92L171.54 171C171.5 171.49 172.21 171.61 172.34 171.13L183.65 126.15C183.85 125.38 184.64 124.91 185.41 125.12L188.31 125.9C189.08 126.1 189.53 126.89 189.33 127.65L174.02 184.8C173.81 185.57 173.02 186.02 172.26 185.81L166.25 184.21C165.55 184.02 165.1 183.34 165.2 182.62L171.61 136.21L171.61 136.1C171.62 135.63 170.94 135.54 170.82 136L159.53 180.9C159.33 181.67 158.54 182.14 157.77 181.93L154.87 181.16C154.1 180.95 153.65 180.16 153.85 179.4L169.16 122.25C169.37 121.48 170.16 121.03 170.92 121.24L176.93 122.85Z" />
      </g>
    </svg>
  );
}
