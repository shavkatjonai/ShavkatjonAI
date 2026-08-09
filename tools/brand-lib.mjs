/**
 * Brend vizual kutubxonasi — logo va social grafikalar uchun umumiy qismlar.
 * Barcha matn Poppins glif konturi sifatida chiziladi (shriftsiz muhitda ham aynan bir xil).
 */
import opentype from 'opentype.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TTF = (w) => join(import.meta.dirname, 'ttf', `Poppins-${w}.ttf`);
const load = (w) => opentype.parse(readFileSync(TTF(w)).buffer);

export const F = { extra: load('ExtraBold'), bold: load('Bold'), semi: load('SemiBold') };

export const C = {
  green: '#0A6B61', green2: '#006B62', greenDark: '#005049',
  mint: '#9CC9C5', mintSoft: '#E7F1F0',
  navy: '#121F36', block: '#121F36', muted: '#5D7078',
  bg: '#FAFBFC', card: '#FFFFFF', line: '#E1E7EA', white: '#FFFFFF',
};

/**
 * Matnni bitta glif konturi (opentype.Path) ga yig'adi, tracking bilan.
 * MUHIM: har glif ORIGIN'da (x=0) olinadi va koordinatalari qo'lda siljitiladi.
 * opentype'ning glyph.getPath(x,...) ni nolmas x bilan chaqirish ba'zi
 * gliflarda NaN koordinata beradi (stringToGlyphs bilan) — librsvg o'shanda
 * path'ni yarim chizib to'xtaydi. Origin + qo'lda offset bu bug'ni chetlab o'tadi.
 */
function buildPath(font, text, fs, tracking = 0) {
  const k = fs / font.unitsPerEm;
  const path = new opentype.Path();
  let x = 0;
  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  // MUHIM: getPath(x,...) o'rniga glifning BARQAROR xom konturidan (glyph.path,
  // font birligida, y-yuqoriga) foydalanamiz. opentype'ning getPath'i ketma-ket
  // chaqirilganda ichki holatni buzib NaN koordinata beradi. Xom kontur barqaror.
  // Bu yerda o'zimiz masshtablaymiz (k) va y'ni SVG uchun ag'daramiz (-y).
  glyphs.forEach((g, i) => {
    for (const c of g.path.commands) {
      const c2 = { type: c.type };
      if (c.x !== undefined) { c2.x = c.x * k + x; c2.y = -c.y * k; }
      if (c.x1 !== undefined) { c2.x1 = c.x1 * k + x; c2.y1 = -c.y1 * k; }
      if (c.x2 !== undefined) { c2.x2 = c.x2 * k + x; c2.y2 = -c.y2 * k; }
      path.commands.push(c2);
    }
    x += g.advanceWidth * k;
    if (i < glyphs.length - 1) x += font.getKerningValue(g, glyphs[i + 1]) * k + tracking * fs;
  });
  return { path, width: x };
}

/** Matnni glif konturlariga o'giradi (baseline y=0). tracking = em ulushi. */
export function layout(font, text, fs, tracking = 0) {
  const { path, width } = buildPath(font, text, fs, tracking);
  const d = path.toPathData(2);
  if (d.includes('NaN')) throw new Error(`Glif NaN berdi: "${text}" (fs=${fs})`);
  return { d, width };
}

export function bbox(font, text, fs, tracking = 0) {
  const { path } = buildPath(font, text, fs, tracking);
  const bb = path.getBoundingBox();
  return { x1: bb.x1, y1: bb.y1, x2: bb.x2, y2: bb.y2, w: bb.x2 - bb.x1, h: bb.y2 - bb.y1 };
}

/** Matn bloki. anchor: 'start'|'middle'|'end' (x ga nisbatan). y = baseline. */
export function text(font, str, x, y, fs, color, { tracking = 0, anchor = 'start' } = {}) {
  const { d, width } = layout(font, str, fs, tracking);
  let dx = x;
  if (anchor === 'middle') dx = x - width / 2;
  else if (anchor === 'end') dx = x - width;
  return { svg: `<g transform="translate(${dx.toFixed(2)},${y.toFixed(2)})"><path d="${d}" fill="${color}"/></g>`, width };
}

/** SV monogramma markasi: yumaloq kvadrat + oq harflar. */
export function markSquare(size, x, y, { square = C.green, glyph = C.white, radiusFrac = 0.235, heightFrac = 0.46 } = {}) {
  const fs = 1000;
  const bb = bbox(F.extra, 'SV', fs);
  const s = (size * heightFrac) / bb.h;
  const tx = x + size / 2 - (bb.x1 + bb.w / 2) * s;
  const ty = y + size / 2 - (bb.y1 + bb.h / 2) * s;
  const { d } = layout(F.extra, 'SV', fs);
  const r = (size * radiusFrac).toFixed(1);
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${square}"/>`
    + `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${s.toFixed(5)})"><path d="${d}" fill="${glyph}"/></g>`;
}

/** Nuqtali panjara (dot grid). */
export function dotGrid(x, y, cols, rows, step, r, color, opacity = 0.4) {
  let d = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const cx = x + i * step, cy = y + j * step;
    d += `M${(cx - r).toFixed(1)} ${cy.toFixed(1)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  }
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

/** Mint tagchiziq. */
export function rule(x, y, w, h, color = C.mint) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${(h / 2).toFixed(1)}" fill="${color}"/>`;
}

/** Dekorativ halqa (faqat chegara). */
export function ring(cx, cy, r, stroke, weight = 1.5) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${weight}"/>`;
}

/** Chaqmoqli pill-badge: [⚡] | SHAVKATJON AI  — brend aksent motivi. */
export function badge(x, y, { fs = 26, green = C.green } = {}) {
  const padX = fs * 0.7, padY = fs * 0.55, gap = fs * 0.5, iconW = fs * 0.62;
  const label = layout(F.semi, 'SHAVKATJON AI', fs, 0.14);
  const h = fs + padY * 2;
  const boltH = fs * 1.05, boltScale = boltH / 24;
  const contentW = iconW + gap * 0.7 + 2 + gap * 0.7 + label.width;
  const w = contentW + padX * 2;
  const cy = y + h / 2;
  const boltPath = 'M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z';
  let cx = x + padX;
  const bolt = `<g transform="translate(${cx.toFixed(1)},${(cy - boltH / 2).toFixed(1)}) scale(${boltScale.toFixed(3)})"><path d="${boltPath}" fill="${C.white}"/></g>`;
  cx += iconW + gap * 0.7;
  const divider = `<rect x="${cx.toFixed(1)}" y="${(cy - fs * 0.5).toFixed(1)}" width="2" height="${fs.toFixed(0)}" fill="rgba(255,255,255,.45)"/>`;
  cx += 2 + gap * 0.7;
  const lbl = text(F.semi, 'SHAVKATJON AI', cx, cy + fs * 0.35, fs, C.white, { tracking: 0.14 }).svg;
  return `<rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(h / 2).toFixed(1)}" fill="${green}"/>${bolt}${divider}${lbl}`;
}

export const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;
