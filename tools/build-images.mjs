/**
 * Portret rasmining responsiv variantlarini yasaydi.
 *
 * Ishlatish:
 *   node tools/build-images.mjs
 *   node tools/build-images.mjs --source=portrait-v2-source.jpg --version=v2
 *
 * Natija: site/assets/portrait[-VERSION]-{560,900}.{avif,webp,jpg}
 *
 * O'lchamlar qayerdan olindi:
 *   desktop  — hero-grid ning .92fr ustuni => rasm ~393px CSS  => 2x uchun 900w
 *   mobil    — .portrait{max-width:290px}  => rasm ~264px CSS  => 2x uchun 560w
 *
 * MUHIM: netlify.toml da /assets/* bir yilga "immutable" keshlanadi.
 * Rasm mazmuni o'zgarsa, --version bilan YANGI nom bering va index.html dagi
 * yo'llarni yangilang. Aks holda tashrifchilar eski rasmni ko'rib turadi.
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'site', 'assets');
const WIDTHS = [560, 900];
const RATIO = 5 / 4; // balandlik / kenglik — CSS dagi aspect-ratio:4/5 ga mos

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};

const SOURCE = join(ROOT, 'tools', arg('source', 'portrait-source.jpg'));
const VERSION = arg('version', '');
const PREFIX = VERSION ? `portrait-${VERSION}` : 'portrait';

/**
 * Kesish maydoni — manba o'lchamiga nisbatan kasrlar bilan.
 *   cx, cy — kesish markazi (0..1)
 *   scale  — kesish kengligi, manba kengligiga nisbatan (0..1)
 * Balandlik avtomatik 4:5 nisbatda hisoblanadi.
 *
 * Yangi rasm qo'yganda shu uchta sonni sozlab, natijani ko'rib chiqing.
 * Manba allaqachon 4:5 bo'lsa, --crop bermang: kesish o'tkazib yuboriladi.
 */
const CROP = arg('crop', null); // "cx,cy,scale" masalan "0.62,0.42,0.70"

await mkdir(OUT, { recursive: true });

const meta = await sharp(SOURCE).metadata();
const srcRatio = meta.height / meta.width;
console.log(`Manba: ${arg('source', 'portrait-source.jpg')} — ${meta.width}x${meta.height} (${srcRatio.toFixed(3)} nisbat)`);

let pipeline = () => sharp(SOURCE);

if (CROP) {
  const [cx, cy, scale] = CROP.split(',').map(Number);
  if (![cx, cy, scale].every((n) => Number.isFinite(n) && n > 0 && n <= 1)) {
    console.error('--crop formati: "cx,cy,scale", har biri 0..1 oralig\'ida');
    process.exit(1);
  }
  const w = Math.round(meta.width * scale);
  const h = Math.round(w * RATIO);
  // markazdan hisoblab, rasm chegarasidan chiqmasligini ta'minlaymiz
  const left = Math.max(0, Math.min(meta.width - w, Math.round(meta.width * cx - w / 2)));
  const top = Math.max(0, Math.min(meta.height - h, Math.round(meta.height * cy - h / 2)));

  if (w > meta.width || h > meta.height) {
    console.error(`Kesish maydoni manbadan katta (${w}x${h} > ${meta.width}x${meta.height}). scale ni kichraytiring.`);
    process.exit(1);
  }
  console.log(`Kesish: ${w}x${h}, chapdan ${left}px, tepadan ${top}px`);
  pipeline = () => sharp(SOURCE).extract({ left, top, width: w, height: h });
} else if (Math.abs(srcRatio - RATIO) > 0.02) {
  console.log(`Ogohlantirish: manba 4:5 emas. --crop="cx,cy,scale" bering, aks holda cho'ziladi.`);
}

const rows = [];
for (const w of WIDTHS) {
  const base = pipeline().resize({ width: w, withoutEnlargement: true });

  const targets = [
    ['avif', (p) => p.avif({ quality: 55, effort: 6 })],
    ['webp', (p) => p.webp({ quality: 76, effort: 6 })],
    ['jpg', (p) => p.jpeg({ quality: 80, progressive: true, mozjpeg: true })],
  ];

  for (const [ext, encode] of targets) {
    const file = join(OUT, `${PREFIX}-${w}.${ext}`);
    try {
      const info = await encode(base.clone()).toFile(file);
      const { size } = await stat(file);
      rows.push([`${PREFIX}-${w}.${ext}`, `${info.width}x${info.height}`, `${(size / 1024).toFixed(1)} KB`]);
    } catch (err) {
      rows.push([`${PREFIX}-${w}.${ext}`, '—', `XATO: ${err.message.split('\n')[0]}`]);
    }
  }
}

console.log('');
for (const [name, dim, size] of rows) console.log(`  ${name.padEnd(24)} ${dim.padEnd(11)} ${size}`);

if (VERSION) {
  console.log(`\nEndi site/index.html dagi rasm yo'llarini "${PREFIX}-" ga o'zgartiring.`);
}
