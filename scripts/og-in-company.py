"""
Gera as imagens de compartilhamento (og:image, JPEG 1200x630) de In Company:
o hub e as quatro páginas de serviço. É a mesma cena dos cards da página
/in-company (.ic-card-scene): fundo café com quadriculado de blueprint e os
objetos de cada serviço sobrepostos, tortos e apoiados na borda de baixo.
As posições, a altura (72% da cena) e os giros repetem o CSS e o
InCompanyFormatCard; os objetos e a escala de cada um são os primeiros
`relics` do serviço em src/data/inCompany.ts.

Uso (precisa de Pillow e NumPy):
    python3 scripts/og-in-company.py

Sem título na imagem: o WhatsApp e o Google já mostram o título da página
abaixo do preview. Ficam em public/images/og/. O WhatsApp não gera preview de
.webp, por isso JPEG.
"""
import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

IMAGES = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'images')
FONT_B = '/System/Library/Fonts/Supplemental/Courier New Bold.ttf'
W, H = 1200, 630
CREAM = (238, 224, 215)
CORP, BODY = np.array([107, 70, 48]), np.array([23, 19, 16])
CQW = W / 100  # 1cqw da cena, em px
TILTS = [-8, 5, -4, 7]  # SCENE_TILT do InCompanyFormatCard


def background():
    # Mesmo gradiente de 150deg e mesmo quadriculado (6% de creme) da cena.
    c1 = 0.92 * CORP + 0.08 * BODY
    c2 = 0.62 * CORP + 0.38 * BODY
    yy, xx = np.mgrid[0:H, 0:W]
    t = xx * math.cos(math.radians(60)) + yy * math.sin(math.radians(60))
    t = (t - t.min()) / (t.max() - t.min())
    img = c1[None, None, :] * (1 - t[..., None]) + c2[None, None, :] * t[..., None]
    cell = 48
    lines = (xx % cell == 0) | (yy % cell == 0)
    img[lines] = img[lines] * 0.94 + np.array(CREAM) * 0.06
    return Image.fromarray(img.astype(np.uint8), 'RGB').convert('RGBA')


def relic(name, height, translucent, tilt):
    im = Image.open(f'{IMAGES}/in-company/objeto-{name}.webp').convert('RGBA')
    im = im.resize((round(im.width * height / im.height), round(height)), Image.LANCZOS)
    if translucent:  # acetato: o fundo aparece através (ver .ic-deck__relic--translucent)
        a = np.asarray(im).copy()
        a[..., 3] = (a[..., 3] * 0.82).astype(np.uint8)
        im = Image.fromarray(a, 'RGBA')
    pad = 60
    canvas = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    canvas.alpha_composite(im, (pad, pad))
    # CSS gira no sentido horário; o PIL, no anti-horário.
    return canvas.rotate(-tilt, resample=Image.BICUBIC, expand=True)


def with_shadow(base, im, cx, bottom):
    x, y = round(cx - im.width / 2), round(bottom - im.height)
    shadow = Image.new('RGBA', im.size, (0, 0, 0, 0))
    shadow.putalpha(im.split()[3].point(lambda v: int(v * 0.55)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    base.alpha_composite(shadow, (x, y + 31))
    base.alpha_composite(im, (x, y))


def make(out, items):
    img = background()
    n = len(items)
    spacing = 19 if n > 3 else 25  # cqw entre os centros, como no card
    for i, (name, scale, translucent) in enumerate(items):
        height = 0.72 * H * scale
        im = relic(name, height, translucent, TILTS[i % len(TILTS)])
        # Objeto na cena: bottom -8%, e a imagem girada em torno do centro.
        cx = W / 2 + (i - (n - 1) / 2) * spacing * CQW
        bottom = H + 0.08 * H + (im.height - height) / 2
        with_shadow(img, im, cx, bottom)
    d = ImageDraw.Draw(img)
    label, font = 'DESENHE · IN COMPANY', ImageFont.truetype(FONT_B, 26)
    x = 48
    for ch in label:
        d.text((x, 40), ch, font=font, fill=(*CREAM, 215))
        x += d.textlength(ch, font=font) + 4
    img.convert('RGB').save(out, quality=86, optimize=True, progressive=True)


OUT = f'{IMAGES}/og'
make(f'{OUT}/in-company-palestra.jpg',
     [('criatividade-estojo', 1.0, False), ('criatividade-post-its', 0.65, False),
      ('criatividade-livro', 1.0, False), ('criatividade-votacao', 1.0, False)])
make(f'{OUT}/in-company-saude-mental.jpg',
     [('pausa-acetatos', 1.0, True), ('pausa-fita', 0.62, False),
      ('pausa-circulo', 0.9, False), ('pausa-ampulheta', 1.0, False)])
make(f'{OUT}/in-company-confraternizacao.jpg',
     [('retratos-placa', 1.0, False), ('retratos-marcadores', 0.9, False),
      ('retratos-envelope', 1.0, False), ('retratos-laco', 0.7, False)])
make(f'{OUT}/in-company-workshop.jpg',
     [('oficina-pinceis', 0.88, False), ('oficina-caderno', 0.9, False),
      ('oficina-paleta', 0.7, False), ('oficina-cavalete', 1.1, False)])
make(f'{OUT}/in-company.jpg',
     [('criatividade-livro', 1.0, False), ('pausa-ampulheta', 1.0, False),
      ('retratos-placa', 1.0, False), ('oficina-paleta', 0.8, False)])
print('ok')
