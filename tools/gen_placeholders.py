# -*- coding: utf-8 -*-
"""
生成作品集用的抽象占位图（SVG）。
风格：极简、无圆角、黑 / 米白 / 草绿三色体系，与站点整体调性一致。
全部离线生成，不依赖网络。
"""
import os
import math
import random

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")
os.makedirs(OUT, exist_ok=True)

GRASS = "#A8E05F"
GRASS_D = "#7FB63C"
DARK = "#0B0B0B"
DARK2 = "#161616"
LIGHT = "#EAEAE7"
LIGHT2 = "#DCDCD7"
INK = "#121212"
MID = "#1C1C1C"
GREY = "#8C8C86"
WHITE = "#FFFFFF"

MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
SANS = "Helvetica Neue, Arial, sans-serif"


def wrap(w, h, body, bg):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="0 0 {w} {h}" fill="none">'
        f'<rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>'
    )


def txt(x, y, s, size, fill, family=MONO, weight="400", ls="0",
        anchor="start", op="1", style=""):
    op_attr = "" if op is None else f' opacity="{op}"'
    return (
        f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" letter-spacing="{ls}" '
        f'text-anchor="{anchor}"{op_attr}{style}>{s}</text>'
    )


# ---------------------------------------------------------------- 样式 A: 网格
def s_grid(w, h, r, dark=False):
    bg = DARK if dark else LIGHT
    line = "#242424" if dark else "#CFCFC9"
    ink = WHITE if dark else INK
    b = []
    step = w / 10.0
    n = 0
    x = step
    while x < w:
        b.append(f'<line x1="{x:.1f}" y1="0" x2="{x:.1f}" y2="{h}" stroke="{line}" stroke-width="1"/>')
        x += step
        n += 1
    stepy = h / 7.0
    y = stepy
    while y < h:
        b.append(f'<line x1="0" y1="{y:.1f}" x2="{w}" y2="{y:.1f}" stroke="{line}" stroke-width="1"/>')
        y += stepy
    # 一个实心方块 + 一个草绿方块
    bx = step * r.randint(1, 6)
    by = stepy * r.randint(1, 4)
    bs = step * r.choice([2, 3])
    b.append(f'<rect x="{bx:.1f}" y="{by:.1f}" width="{bs:.1f}" height="{bs:.1f}" fill="{ink}"/>')
    gx = step * r.randint(1, 7)
    gy = stepy * r.randint(1, 5)
    gs = step * 1
    b.append(f'<rect x="{gx:.1f}" y="{gy:.1f}" width="{gs:.1f}" height="{gs:.1f}" fill="{GRASS}"/>')
    b.append(txt(step * 0.4, h - stepy * 0.4, "GRID SYSTEM", step * 0.28, ink, op="0.55", ls="2"))
    b.append(txt(w - step * 0.4, h - stepy * 0.4, "CAPTURED", step * 0.28, ink, op="0.35",
                 ls="2", anchor="end"))
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 B: 圆弧
def s_arc(w, h, r, dark=True):
    bg = DARK if dark else LIGHT
    ink = WHITE if dark else INK
    b = []
    cx = w * r.uniform(0.25, 0.75)
    cy = h * r.uniform(1.0, 1.25)
    rad = w * r.uniform(0.45, 0.62)
    b.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" stroke="{GRASS}" stroke-width="{w*0.012:.1f}"/>')
    b.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad*0.72:.1f}" stroke="{ink}" stroke-width="1" opacity="0.25"/>')
    b.append(f'<circle cx="{cx:.1f}" cy="{cy - rad:.1f}" r="{w*0.018:.1f}" fill="{GRASS}"/>')
    b.append(txt(w * 0.05, h * 0.09, "ARC", w * 0.035, ink, family=SANS, weight="700", ls="-1"))
    b.append(txt(w * 0.05, h * 0.13, "GEOMETRY / 001", w * 0.016, ink, op="0.5", ls="2"))
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 C: 大字
def s_type(w, h, r, dark=False):
    bg = DARK if dark else LIGHT
    ink = WHITE if dark else INK
    chars = r.choice(["Aa", "01", "Xy", "07", "//", "{ }", "01"])
    size = h * 0.72
    b = [
        txt(w / 2, h * 0.5 + size * 0.34, chars, size, "none",
            family=SANS, weight="700", ls="-8", anchor="middle", op=None,
            style=f' stroke="{ink}" stroke-width="2" opacity="0.4"'),
        txt(w * 0.05, h * 0.9, "TYPOGRAPHY TEST", w * 0.018, GRASS, ls="3"),
        txt(w * 0.95, h * 0.9, f"№{r.randint(10,99)}", w * 0.018, ink, op="0.45", ls="2", anchor="end"),
    ]
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 D: 条形
def s_bars(w, h, r, dark=False):
    bg = DARK if dark else LIGHT
    ink = WHITE if dark else INK
    n = r.randint(9, 14)
    gap = w * 0.012
    bw = (w - gap * (n + 1)) / n
    b = []
    accent = r.randint(0, n - 1)
    for i in range(n):
        bh = h * r.uniform(0.18, 0.78)
        x = gap + i * (bw + gap)
        if i == accent:
            b.append(f'<rect x="{x:.1f}" y="{h*0.86-bh:.1f}" width="{bw:.1f}" height="{bh:.1f}" fill="{GRASS}"/>')
        else:
            op = r.choice(["0.10", "0.16", "0.24", "0.32"])
            b.append(f'<rect x="{x:.1f}" y="{h*0.86-bh:.1f}" width="{bw:.1f}" height="{bh:.1f}" fill="{ink}" opacity="{op}"/>')
    b.append(f'<line x1="0" y1="{h*0.86:.1f}" x2="{w}" y2="{h*0.86:.1f}" stroke="{ink}" stroke-width="1" opacity="0.3"/>')
    b.append(txt(w * 0.05, h * 0.1, "DATA / BARS", w * 0.018, ink, op="0.6", ls="3"))
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 E: 斜纹
def s_diag(w, h, r, dark=True):
    bg = DARK if dark else LIGHT
    ink = WHITE if dark else INK
    b = []
    step = w * 0.055
    i = -h
    sgn = r.choice([1, -1])
    idx = 0
    while i < w + h:
        op = r.choice(["0.06", "0.1", "0.14", "0.2"])
        col = GRASS if idx % 9 == 3 else ink
        if idx % 9 == 3:
            op = "0.55"
        if sgn == 1:
            b.append(f'<line x1="{i:.1f}" y1="0" x2="{i+h:.1f}" y2="{h}" stroke="{col}" stroke-width="{w*0.012:.1f}" opacity="{op}"/>')
        else:
            b.append(f'<line x1="{i:.1f}" y1="0" x2="{i-h:.1f}" y2="{h}" stroke="{col}" stroke-width="{w*0.012:.1f}" opacity="{op}"/>')
        i += step
        idx += 1
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 F: 同心圆
def s_rings(w, h, r, dark=True):
    bg = MID if dark else LIGHT2
    ink = WHITE if dark else INK
    cx = w * r.uniform(0.35, 0.65)
    cy = h * r.uniform(0.4, 0.6)
    b = []
    n = r.randint(6, 9)
    for i in range(n, 0, -1):
        rad = (min(w, h) * 0.62) * (i / n)
        op = 0.10 + 0.04 * (n - i)
        b.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" stroke="{ink}" stroke-width="1" opacity="{op:.2f}"/>')
    b.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{min(w,h)*0.05:.1f}" fill="{GRASS}"/>')
    b.append(txt(w * 0.05, h * 0.1, "CONCENTRIC", w * 0.018, ink, op="0.6", ls="3"))
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 G: 色块
def s_blocks(w, h, r, dark=True):
    bg = DARK if dark else LIGHT
    ink = WHITE if dark else INK
    b = []
    u = min(w, h) / 6.0
    cells = [(x, y) for x in range(int(w // u)) for y in range(int(h // u))]
    r.shuffle(cells)
    picks = cells[:r.randint(4, 7)]
    for i, (cx, cy) in enumerate(picks):
        cw = u * r.choice([1, 1, 2])
        ch = u * r.choice([1, 1, 2])
        col = GRASS if i == 0 else ink
        op = "1" if i == 0 else r.choice(["0.08", "0.14", "0.22", "0.9"])
        b.append(f'<rect x="{cx*u:.1f}" y="{cy*u:.1f}" width="{cw:.1f}" height="{ch:.1f}" fill="{col}" opacity="{op}"/>')
    b.append(txt(w * 0.04, h - u * 0.3, "MODULE / 8PT", u * 0.22, ink, op="0.5", ls="2"))
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 H: 点阵
def s_dots(w, h, r, dark=True):
    bg = DARK if dark else LIGHT
    ink = WHITE if dark else INK
    cols = 16
    rows = max(3, int(cols * h / w))
    gapx = w / cols
    gapy = h / rows
    b = []
    ph = r.uniform(0, 6.28)
    for iy in range(rows):
        for ix in range(cols):
            t = (ix / cols) * 6.28 + (iy / rows) * 1.4 + ph
            rad = gapx * (0.10 + 0.13 * (1 + math.sin(t)) / 2)
            is_g = (ix == int(cols * 0.72) and iy == int(rows * 0.42))
            col = GRASS if is_g else ink
            op = "1" if is_g else f"{0.18 + 0.5*((1+math.sin(t))/2):.2f}"
            b.append(f'<circle cx="{gapx*(ix+0.5):.1f}" cy="{gapy*(iy+0.5):.1f}" r="{rad:.1f}" fill="{col}" opacity="{op}"/>')
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 I: 内框
def s_frame(w, h, r, dark=False):
    bg = LIGHT if not dark else DARK
    ink = INK if not dark else WHITE
    m = min(w, h) * 0.09
    b = [
        f'<rect x="{m:.1f}" y="{m:.1f}" width="{w-m*2:.1f}" height="{h-m*2:.1f}" stroke="{ink}" stroke-width="1" opacity="0.55"/>',
        f'<rect x="{m*1.6:.1f}" y="{m*1.6:.1f}" width="{(w-m*2)*0.34:.1f}" height="{(h-m*2)*0.5:.1f}" fill="{GRASS}"/>',
        txt(w * 0.5, h * 0.62, "CASE STUDY", h * 0.095, ink, family=SANS, weight="700", ls="-1", anchor="middle"),
        txt(w * 0.5, h * 0.62 + h * 0.09, "PROCESS  ·  BUILD  ·  SHIP", h * 0.035, ink, op="0.5", ls="4", anchor="middle"),
        txt(m, h * 0.055, "FRAME / 01", h * 0.03, ink, op="0.45", ls="2"),
    ]
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 样式 J: 波形
def s_wave(w, h, r, dark=True):
    bg = DARK if dark else LIGHT
    ink = WHITE if dark else INK
    b = []
    lines = r.randint(5, 8)
    for k in range(lines):
        pts = []
        amp = h * r.uniform(0.04, 0.16)
        freq = r.uniform(1.2, 3.2)
        ph = r.uniform(0, 6.28)
        base = h * (0.18 + 0.68 * k / max(1, lines - 1))
        for i in range(0, 81):
            x = w * i / 80.0
            y = base + math.sin(ph + freq * 6.28 * i / 80.0) * amp
            pts.append(f"{x:.1f},{y:.1f}")
        col = GRASS if k == lines - 1 else ink
        op = "0.85" if k == lines - 1 else "0.16"
        b.append(f'<polyline points="{" ".join(pts)}" stroke="{col}" stroke-width="1.4" opacity="{op}"/>')
    b.append(txt(w * 0.05, h * 0.08, "SIGNAL", w * 0.02, ink, op="0.55", ls="3"))
    return wrap(w, h, "".join(b), bg)


# ---------------------------------------------------------------- 输出
def seed_of(name):
    """稳定的字符串种子（不依赖 PYTHONHASHSEED），保证重复生成结果一致。"""
    return sum((i + 1) * ord(c) for i, c in enumerate(name)) % 99991


PROJECTS = [
    ("p01", 1600, 1200, s_grid, False),
    ("p02", 1200, 1600, s_arc, True),
    ("p03", 1600, 1000, s_frame, False),
    ("p04", 1400, 1400, s_dots, True),
    ("p05", 1600, 1200, s_blocks, True),
    ("p06", 1200, 1600, s_rings, True),
    ("p07", 1600, 1000, s_bars, False),
    ("p08", 1400, 1400, s_type, False),
    ("p09", 1200, 1600, s_wave, True),
    ("p10", 1600, 1000, s_diag, True),
    ("p11", 1600, 1200, s_grid, True),
    ("p12", 1200, 1600, s_blocks, False),
]

HERO = [
    ("h01", 1080, 720, s_arc, True),
    ("h02", 1080, 720, s_blocks, False),
    ("h03", 1080, 720, s_rings, True),
    ("h04", 1080, 720, s_diag, True),
    ("h05", 1080, 720, s_dots, True),
    ("h06", 1080, 720, s_wave, True),
    ("h07", 1080, 720, s_type, False),
    ("h08", 1080, 720, s_bars, False),
]


def main():
    total = 0
    for name, w, h, fn, dark in PROJECTS:
        r = random.Random(seed_of(name))
        with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as f:
            f.write(fn(w, h, r, dark))
        total += 1

    for name, w, h, fn, dark in HERO:
        r = random.Random(seed_of(name))
        with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as f:
            f.write(fn(w, h, r, dark))
        total += 1

    # 关于页头像占位
    r = random.Random(7)
    with open(os.path.join(OUT, "portrait.svg"), "w", encoding="utf-8") as f:
        f.write(s_blocks(900, 1200, r, True))
    total += 1

    print(f"generated {total} files -> {OUT}")


if __name__ == "__main__":
    main()
