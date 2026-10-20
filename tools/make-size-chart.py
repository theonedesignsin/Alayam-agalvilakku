#!/usr/bin/env python3
"""
Generate size-chart images (product name + diya drawing + width/height arrows)
in the site's dark & gold style.

  1. Put each product's real size in tools/size-charts.json  (slug -> width/height in cm)
  2. Run:  python3 tools/make-size-chart.py            (needs: pip install pillow numpy)
  3. Images are written to src/assets/size-charts/<slug>.webp and the product page
     shows them automatically as the 2nd picture.

Prefer your own artwork (like a photo with measurements)? Skip this script and just
save your image as src/assets/size-charts/<slug>.webp  (or .png / .jpg).
Product names are read from src/data/products.js.
"""
import json, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'assets', 'size-charts')
S = 2240  # drawn at 2x, saved at 1120
GOLD = (0xD4, 0xB8, 0x5A)

def font(bold=True, serif=False, size=100):
    names = (['DejaVuSerif-Bold.ttf', 'LiberationSerif-Bold.ttf'] if serif
             else ['DejaVuSans-Bold.ttf', 'LiberationSans-Bold.ttf', 'Arial Bold.ttf'])
    dirs = ['/usr/share/fonts/truetype/dejavu', '/usr/share/fonts/truetype/liberation',
            '/Library/Fonts', 'C:/Windows/Fonts', '/System/Library/Fonts/Supplemental']
    for d in dirs:
        for n in names:
            p = os.path.join(d, n)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def background():
    y, x = np.mgrid[0:S, 0:S].astype(np.float32)
    d = np.sqrt(((x - S * .5) / S) ** 2 + ((y - S * .52) / S) ** 2)
    t = np.clip(d / .75, 0, 1)[..., None]
    c0 = np.array([0x40, 0x28, 0x10], np.float32); c1 = np.array([0x0d, 0x08, 0x04], np.float32)
    return Image.fromarray((c0 * (1 - t) ** 1.4 + c1 * (1 - (1 - t) ** 1.4)).astype(np.uint8))

def gold_gradient(w, h):
    g = np.linspace(0, 1, w, dtype=np.float32)
    stops = [(0, (0x8a, 0x62, 0x1c)), (.3, (0xd9, 0xaa, 0x3e)), (.5, (0xfb, 0xe3, 0x94)),
             (.72, (0xc9, 0xa8, 0x4c)), (1, (0x6e, 0x4a, 0x12))]
    ch = [np.interp(g, [s[0] for s in stops], [s[1][i] for s in stops]) for i in range(3)]
    return Image.fromarray(np.tile(np.stack(ch, -1)[None], (h, 1, 1)).astype(np.uint8))

def draw_diya(img, left, top, w, h):
    m = Image.new('L', (S, S), 0); d = ImageDraw.Draw(m)
    cx = left + w * .46
    body_w = w * .84
    rim_h = h * .46
    # body (tapers to a smaller foot)
    d.polygon([(cx - body_w / 2, top + rim_h * .5), (cx + body_w / 2, top + rim_h * .5),
               (cx + body_w * .30, top + h), (cx - body_w * .30, top + h)], fill=255)
    d.ellipse((cx - body_w * .30, top + h - h * .10, cx + body_w * .30, top + h + h * .02), fill=255)
    # rim + spout
    d.ellipse((cx - body_w / 2, top, cx + body_w / 2, top + rim_h), fill=255)
    d.polygon([(cx + body_w / 2 - w * .05, top + rim_h * .15), (left + w, top + rim_h * .02),
               (left + w - w * .02, top + rim_h * .55), (cx + body_w / 2 - w * .05, top + rim_h * .7)], fill=255)
    fill = Image.new('RGB', (S, S)); fill.paste(gold_gradient(int(w), int(h * 1.1)), (int(left), int(top)))
    sh = m.filter(ImageFilter.GaussianBlur(S * .012)).point(lambda v: int(v * .6))
    img.paste(Image.new('RGB', (S, S), (4, 2, 1)), (int(S * .008), int(S * .014)), sh)
    img.paste(fill, (0, 0), m)
    # dark oil well inside the rim
    well = Image.new('L', (S, S), 0); wd = ImageDraw.Draw(well)
    wd.ellipse((cx - body_w * .40, top + rim_h * .12, cx + body_w * .40, top + rim_h * .84), fill=255)
    img.paste(Image.new('RGB', (S, S), (58, 34, 12)), (0, 0), well.filter(ImageFilter.GaussianBlur(4)))
    ring = Image.new('L', (S, S), 0); rd = ImageDraw.Draw(ring)
    rd.ellipse((cx - body_w * .40, top + rim_h * .12, cx + body_w * .40, top + rim_h * .84), outline=255, width=int(S * .004))
    img.paste(Image.new('RGB', (S, S), (251, 227, 148)), (0, 0), ring.point(lambda v: int(v * .55)))

def arrow(d, p0, p1, width=10, head=42):
    d.line([p0, p1], fill=GOLD, width=width)
    import math
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    for (px, py), a in ((p1, ang), (p0, ang + math.pi)):
        pts = [(px, py), (px - head * math.cos(a - .42), py - head * math.sin(a - .42)),
               (px - head * math.cos(a + .42), py - head * math.sin(a + .42))]
        d.polygon(pts, fill=GOLD)

def fmt(v):
    return ('%g' % v)

def centered(d, xy, text, f, fill):
    box = d.textbbox((0, 0), text, font=f)
    d.text((xy[0] - (box[2] - box[0]) / 2 - box[0], xy[1] - (box[3] - box[1]) / 2 - box[1]), text, font=f, fill=fill)

def fit_title(d, text, maxw):
    size = 96
    while size > 48:
        f = font(serif=True, size=size)
        if d.textbbox((0, 0), text, font=f)[2] <= maxw:
            return f
        size -= 4
    return font(serif=True, size=48)

def make(slug, name, wcm, hcm):
    img = background(); d = ImageDraw.Draw(img)
    # title
    f = fit_title(d, name, S * .84)
    centered(d, (S / 2, 230), name, f, (245, 240, 232))
    d.line([(S / 2 - 130, 330), (S / 2 + 130, 330)], fill=GOLD, width=5)
    # diya box (aspect follows the real size, longest side fixed)
    box_w = 1160.0
    box_h = max(380.0, min(900.0, box_w * hcm / wcm))
    left, top = 330, 640 + (700 - box_h) / 2
    draw_diya(img, left, top, box_w, box_h)
    d = ImageDraw.Draw(img)
    right, bottom = left + box_w, top + box_h
    # width arrow
    ay = bottom + 150
    for x in (left, right):
        d.line([(x, bottom + 85), (x, ay + 40)], fill=GOLD, width=5)
    arrow(d, (left, ay), (right, ay))
    centered(d, ((left + right) / 2, ay + 140), f'{fmt(wcm)} CM', font(size=124), (245, 240, 232))
    # height arrow
    ax = right + 190
    for y in (top, bottom):
        d.line([(right + 70, y), (ax + 40, y)], fill=GOLD, width=5)
    arrow(d, (ax, top), (ax, bottom))
    centered(d, (ax + 190, (top + bottom) / 2), f'{fmt(hcm)}\nCM'.replace('\n', ' '), font(size=0), (0, 0, 0)) if False else None
    tf = font(size=124)
    t1, t2 = f'{fmt(hcm)}', 'CM'
    centered(d, (ax + 175, (top + bottom) / 2 - 70), t1, tf, (245, 240, 232))
    centered(d, (ax + 175, (top + bottom) / 2 + 70), t2, tf, (245, 240, 232))
    centered(d, (S / 2, S - 230), 'SIZE CHART  \u2022  APPROXIMATE, HANDCRAFTED', font(size=56), (176, 141, 87))
    os.makedirs(OUT, exist_ok=True)
    img.resize((1120, 1120), Image.LANCZOS).save(os.path.join(OUT, f'{slug}.webp'), quality=86, method=6)

def product_names():
    src = open(os.path.join(ROOT, 'src', 'data', 'products.js'), encoding='utf-8').read()
    return dict((m.group(2), m.group(1)) for m in re.finditer(r"name: '([^']+)',\s*slug: '([^']+)'", src))

if __name__ == '__main__':
    names = product_names()
    sizes = json.load(open(os.path.join(ROOT, 'tools', 'size-charts.json')))
    only = sys.argv[1:]
    for slug, v in sizes.items():
        if slug.startswith('_') or (only and slug not in only):
            continue
        if slug not in names:
            print('skip (no such product):', slug); continue
        make(slug, names[slug], float(v['width']), float(v['height']))
        print('written', slug)
