/**
 * Shavkatjon Vahobov brend logotip tizimini yasaydi — HAQIQIY vektor.
 *
 * Monogramma (SV) va wordmark harflari Poppins ExtraBold/SemiBold TTF'idan
 * glif konturi (path) sifatida olinadi — shrift o'rnatilmagan muhitda ham
 * (favicon rasterizatsiyasi, boshqa dizayn dasturlari) aynan bir xil chiqadi.
 *
 * Natija:
 *   brand/logo/*.svg                 — standalone logo fayllar (barcha variant)
 *   site/favicon.svg                 — SV monogramma (brauzer tab ikonkasi)
 *   site/favicon.ico, apple-touch,   — rasterlangan ikonka to'plami
 *     icon-192/512/maskable
 *
 * Ishlatish:  node tools/build-logo.mjs
 */
import opentype from 'opentype.js';
import sharp from 'sharp';
import { writeFile, mkdir, copyFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const TTF = (w) => join(ROOT, 'tools', 'ttf', `Poppins-${w}.ttf`);
const LOGO_DIR = join(ROOT, 'brand', 'logo');
const SITE = join(ROOT, 'site');

const C = {
  green: '#0A6B61', mint: '#9CC9C5', navy: '#121F36',
  muted: '#5D7078', bg: '#FAFBFC', white: '#FFFFFF',
};

const loadFont = (w) => opentype.parse(readFileSync(TTF(w)).buffer);
const F = { extra: loadFont('ExtraBold'), semi: loadFont('SemiBold') };

/** Matnni glif konturlariga o'giradi (baseline y=0 da). tracking = em ulushi. */
function layout(font, text, fs, tracking = 0) {
  const scale = fs / font.unitsPerEm;
  let x = 0;
  const parts = [];
  const glyphs = font.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    const d = g.getPath(x, 0, fs).toPathData(2);
    if (d && d !== 'Z') parts.push(d);
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) {
      x += font.getKerningValue(g, glyphs[i + 1]) * scale + tracking * fs;
    }
  });
  return { d: parts.join(' '), width: x };
}

/** Matnning haqiqiy bbox'i (tracking bilan). */
function bbox(font, text, fs, tracking = 0) {
  const scale = fs / font.unitsPerEm;
  let x = 0, x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  const glyphs = font.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    const bb = g.getPath(x, 0, fs).getBoundingBox();
    x1 = Math.min(x1, bb.x1); y1 = Math.min(y1, bb.y1);
    x2 = Math.max(x2, bb.x2); y2 = Math.max(y2, bb.y2);
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) x += tracking * fs;
  });
  return { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1 };
}

/** SV monogramma guruhi (kvadrat + harflar), (ox,oy) ga siljitilgan. */
function markGroup(size, ox, oy, { square = C.green, glyph = C.white, heightFrac = 0.46, radiusFrac = 0.235, drawSquare = true } = {}) {
  const fs = 1000;
  const bb = bbox(F.extra, 'SV', fs);
  const s = (size * heightFrac) / bb.h;
  const tx = ox + size / 2 - (bb.x1 + bb.w / 2) * s;
  const ty = oy + size / 2 - (bb.y1 + bb.h / 2) * s;
  const { d } = layout(F.extra, 'SV', fs);
  const r = (size * radiusFrac).toFixed(1);
  const sq = drawSquare
    ? `<rect x="${ox}" y="${oy}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${square}"/>`
    : '';
  return sq + `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${s.toFixed(5)})"><path d="${d}" fill="${glyph}"/></g>`;
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${+w.toFixed(1)} ${+h.toFixed(1)}">${body}</svg>`;

/** Standalone monogramma markasi. */
function markSVG(opts = {}) {
  const size = 512;
  return svg(size, size, markGroup(size, 0, 0, opts));
}

/**
 * Gorizontal lockup: SV markasi + "Shavkatjon Vahobov" + tagline.
 * @param textColor  wordmark asosiy rangi (light foD navy, dark fon uchun white)
 * @param subColor   tagline rangi
 */
function lockupSVG({ textColor = C.navy, subColor = C.muted, square = C.green, glyph = C.white } = {}) {
  const M = 132;                 // marka o'lchami
  const gap = 40;                // marka va matn orasi
  const padY = 6;
  const line1fs = 74;            // "Shavkatjon Vahobov"
  const line2fs = 22.5;          // tagline
  const lineGap = 20;

  const l1 = layout(F.extra, 'Shavkatjon Vahobov', line1fs, -0.02);
  const l2 = layout(F.semi, 'AI ENGINEER • EDUCATOR • BUILDER', line2fs, 0.135);

  const textW = Math.max(l1.width, l2.width);
  const W = M + gap + textW + 4;
  const H = M + padY * 2;

  // matn bloki vertikal markazda: line1 cap + gap + line2 cap
  const cap1 = line1fs * 0.72, cap2 = line2fs * 0.72;
  const blockH = cap1 + lineGap + cap2;
  const top = (H - blockH) / 2;
  const x = M + gap;
  const y1 = top + cap1;                    // line1 baseline
  const y2 = y1 + lineGap + cap2;           // line2 baseline

  const body =
    markGroup(M, 0, padY, { square, glyph }) +
    `<g transform="translate(${x.toFixed(2)},${y1.toFixed(2)})"><path d="${l1.d}" fill="${textColor}"/></g>` +
    `<g transform="translate(${x.toFixed(2)},${y2.toFixed(2)})"><path d="${l2.d}" fill="${subColor}"/></g>`;
  return svg(W, H, body);
}

/** Kvadratsiz SV glifi, currentColor bilan — sayt header'iga inline qo'yish uchun.
 *  Tight viewBox, markazlashtirilgan. */
function glyphSVG() {
  const fs = 1000;
  const bb = bbox(F.extra, 'SV', fs);
  const { d } = layout(F.extra, 'SV', fs);
  // path'ni bbox boshiga siljitamiz
  const tx = -bb.x1, ty = -bb.y1;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bb.w.toFixed(1)} ${bb.h.toFixed(1)}" fill="currentColor" aria-hidden="true"><path transform="translate(${tx.toFixed(2)},${ty.toFixed(2)})" d="${d}"/></svg>`;
}

/** Faqat wordmark (markasiz), light fon uchun. */
function wordmarkSVG({ textColor = C.navy, subColor = C.muted } = {}) {
  const line1fs = 74, line2fs = 22.5, lineGap = 20, pad = 8;
  const l1 = layout(F.extra, 'Shavkatjon Vahobov', line1fs, -0.02);
  const l2 = layout(F.semi, 'AI ENGINEER • EDUCATOR • BUILDER', line2fs, 0.135);
  const cap1 = line1fs * 0.72, cap2 = line2fs * 0.72;
  const W = Math.max(l1.width, l2.width) + pad * 2;
  const H = cap1 + lineGap + cap2 + pad * 2;
  const y1 = pad + cap1, y2 = y1 + lineGap + cap2;
  const body =
    `<g transform="translate(${pad},${y1.toFixed(2)})"><path d="${l1.d}" fill="${textColor}"/></g>` +
    `<g transform="translate(${pad},${y2.toFixed(2)})"><path d="${l2.d}" fill="${subColor}"/></g>`;
  return svg(W, H, body);
}

// ---------- Ikonka rasterizatsiyasi ----------
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + 16 * pngs.length;
  pngs.forEach(({ size, data }, i) => {
    const p = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, p);
    dir.writeUInt8(size >= 256 ? 0 : size, p + 1);
    dir.writeUInt16LE(1, p + 4); dir.writeUInt16LE(32, p + 6);
    dir.writeUInt32LE(data.length, p + 8); dir.writeUInt32LE(offset, p + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.data)]);
}

// ---------- Yozish ----------
await mkdir(LOGO_DIR, { recursive: true });

const files = {
  'logo-mark.svg': markSVG(),
  'logo-mark-32-optimized.svg': markSVG({ heightFrac: 0.5 }),   // kichik o'lcham uchun kattaroq harf
  'logo-horizontal-light.svg': lockupSVG({ textColor: C.navy, subColor: C.muted }),
  'logo-horizontal-dark.svg': lockupSVG({ textColor: C.white, subColor: C.mint }),
  'logo-wordmark-light.svg': wordmarkSVG({ textColor: C.navy, subColor: C.muted }),
  'logo-wordmark-dark.svg': wordmarkSVG({ textColor: C.white, subColor: C.mint }),
  '_header-glyph.svg': glyphSVG(),
};
for (const [name, content] of Object.entries(files)) {
  await writeFile(join(LOGO_DIR, name), content + '\n');
}

// site favicon.svg = monogramma
const markSrc = markSVG();
await writeFile(join(SITE, 'favicon.svg'), markSrc + '\n');

// favicon.ico (16/32/48) — kichik o'lchamda kattaroq harfli variant
const markSmall = Buffer.from(markSVG({ heightFrac: 0.5 }));
const icoPngs = [];
for (const size of [16, 32, 48]) {
  icoPngs.push({ size, data: await sharp(markSmall, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer() });
}
await writeFile(join(SITE, 'favicon.ico'), buildIco(icoPngs));

// apple-touch (to'la to'ldirilgan, iOS burchakni o'zi qo'yadi)
const markFull = Buffer.from(markSVG({ radiusFrac: 0.0001 }));
await sharp(markFull, { density: 384 }).resize(180, 180).png({ compressionLevel: 9 }).toFile(join(SITE, 'apple-touch-icon.png'));

// PWA ikonkalari
for (const size of [192, 512]) {
  await sharp(Buffer.from(markSrc), { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toFile(join(SITE, `icon-${size}.png`));
}
// maskable — xavfsiz zona uchun kichikroq harf, to'la to'ldirilgan fon
await sharp(Buffer.from(markSVG({ radiusFrac: 0.0001, heightFrac: 0.4 })), { density: 384 }).resize(512, 512).png({ compressionLevel: 9 }).toFile(join(SITE, 'icon-maskable-512.png'));

console.log('Logo fayllar -> brand/logo/');
for (const n of Object.keys(files)) console.log('  ' + n);
console.log('Ikonka to\'plami -> site/  (favicon.svg .ico, apple-touch, icon-192/512/maskable)');
