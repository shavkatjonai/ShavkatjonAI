/**
 * Portret rasmining responsiv variantlarini yasaydi.
 *
 * Manba: tools/portrait-source.jpg (900x1125, index.html base64'idan chiqarilgan)
 * Natija: site/assets/portrait-{560,900}.{avif,webp,jpg}
 *
 * O'lchamlar qayerdan olindi:
 *   desktop  — hero-grid ning .92fr ustuni => rasm ~393px CSS  => 2x uchun 900w
 *   mobil    — .portrait{max-width:290px} => rasm ~264px CSS   => 2x uchun 560w
 *
 * Ishlatish:  node tools/build-images.mjs
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'tools', 'portrait-source.jpg');
const OUT = join(ROOT, 'site', 'assets');
const WIDTHS = [560, 900];

await mkdir(OUT, { recursive: true });

const meta = await sharp(SRC).metadata();
console.log(`Manba: ${meta.width}x${meta.height} ${meta.format}\n`);

const rows = [];
for (const w of WIDTHS) {
  const base = sharp(SRC).resize({ width: w, withoutEnlargement: true });

  const targets = [
    ['avif', () => base.clone().avif({ quality: 55, effort: 6 })],
    ['webp', () => base.clone().webp({ quality: 76, effort: 6 })],
    ['jpg', () => base.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true })],
  ];

  for (const [ext, make] of targets) {
    const file = join(OUT, `portrait-${w}.${ext}`);
    try {
      await make().toFile(file);
      const { size } = await stat(file);
      rows.push([`portrait-${w}.${ext}`, `${(size / 1024).toFixed(1)} KB`]);
    } catch (err) {
      rows.push([`portrait-${w}.${ext}`, `XATO: ${err.message.split('\n')[0]}`]);
    }
  }
}

for (const [name, size] of rows) console.log(`  ${name.padEnd(20)} ${size}`);
