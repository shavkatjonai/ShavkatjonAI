/**
 * Ikonkalar va og-image yasaydi.
 *
 * Manbalar:  tools/brand-mark.svg   (chaqmoq belgisi, faqat path — shrift kerak emas)
 *            tools/og-image.html    (1200x630 kompozitsiya, self-host shriftlar bilan)
 *
 * Natija:    site/favicon.svg  favicon.ico  apple-touch-icon.png
 *            site/icon-192.png  icon-512.png  icon-maskable-512.png
 *            site/assets/og-image.jpg
 *
 * Ishlatish: node tools/build-icons.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile, copyFile, unlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const ROOT = join(import.meta.dirname, '..');
const SITE = join(ROOT, 'site');
const MARK = join(ROOT, 'tools', 'brand-mark.svg');

const GREEN = '#0A6B61';
// brand-mark.svg dagi chaqmoq path'i: bounding box 14x20 birlik (x 4.5..18.5, y 2..22)
const BOLT = 'M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z';

/**
 * Berilgan o'lchamda chaqmoq belgisini SVG matni sifatida qaytaradi.
 * @param size      kvadrat tomoni (px)
 * @param radius    burchak radiusi (0 = to'la to'ldirilgan kvadrat)
 * @param heightPct chaqmoq balandligi kvadrat tomoniga nisbatan (0..1)
 */
function markSvg(size, radius, heightPct) {
  const s = (size * heightPct) / 20;            // path 20 birlik balandlikda
  const tx = size / 2 - 7 * s;                  // gorizontal markaz (kenglik 14 birlik)
  const ty = size / 2 - 10 * s - 2 * s;         // y 2 dan boshlanadi, shuni hisobga olamiz
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
    + `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${GREEN}"/>`
    + `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${s.toFixed(4)})">`
    + `<path d="${BOLT}" fill="#FFFFFF"/></g></svg>`;
}

/** PNG-li .ico fayl yasaydi (sharp .ico chiqarmaydi, shuning uchun qo'lda). */
function buildIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);          // reserved
  header.writeUInt16LE(1, 2);          // type: 1 = ikonka
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  pngs.forEach(({ size, data }, i) => {
    const p = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, p);      // kenglik (0 => 256)
    dir.writeUInt8(size >= 256 ? 0 : size, p + 1);  // balandlik
    dir.writeUInt8(0, p + 2);                       // palitra rangi yo'q
    dir.writeUInt8(0, p + 3);                       // reserved
    dir.writeUInt16LE(1, p + 4);                    // planes
    dir.writeUInt16LE(32, p + 6);                   // bit/piksel
    dir.writeUInt32LE(data.length, p + 8);
    dir.writeUInt32LE(offset, p + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...pngs.map((p) => p.data)]);
}

const done = [];

// ---------- 1. favicon.svg ----------
await copyFile(MARK, join(SITE, 'favicon.svg'));
done.push(['favicon.svg', 'SVG (vektor)']);

// ---------- 2. favicon.ico: 16 / 32 / 48 ----------
const markSource = await readFile(MARK);
const icoPngs = [];
for (const size of [16, 32, 48]) {
  icoPngs.push({
    size,
    data: await sharp(markSource, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer(),
  });
}
const ico = buildIco(icoPngs);
await writeFile(join(SITE, 'favicon.ico'), ico);
done.push(['favicon.ico', `16+32+48 px, ${(ico.length / 1024).toFixed(1)} KB`]);

// ---------- 3. apple-touch-icon: to'la to'ldirilgan, iOS o'zi burchak qo'yadi ----------
await sharp(Buffer.from(markSvg(180, 0, 0.5)))
  .png({ compressionLevel: 9 })
  .toFile(join(SITE, 'apple-touch-icon.png'));
done.push(['apple-touch-icon.png', '180x180, to\'la to\'ldirilgan']);

// ---------- 4. PWA ikonkalari ----------
for (const size of [192, 512]) {
  await sharp(markSource, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(SITE, `icon-${size}.png`));
  done.push([`icon-${size}.png`, `${size}x${size}, yumaloq burchak`]);
}

// maskable: Android ikonkani kesib qo'yadi, shuning uchun fon to'la to'ldirilgan
// va chaqmoq markazdagi xavfsiz zonada (tomonning 40%) turadi.
await sharp(Buffer.from(markSvg(512, 0, 0.4)))
  .png({ compressionLevel: 9 })
  .toFile(join(SITE, 'icon-maskable-512.png'));
done.push(['icon-maskable-512.png', '512x512, xavfsiz zona 40%']);

// ---------- 5. og-image: headless Chrome bilan render ----------
const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('\nChrome topilmadi — og-image yasalmadi.');
} else {
  const tmp = join(ROOT, 'tools', 'og-image.png');
  // 2x masshtabda olamiz, so'ng 1200x630 ga tushiramiz: matn va nuqtalar silliq chiqadi
  const res = spawnSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=2',
      '--window-size=1200,630',
      `--screenshot=${tmp}`,
      `file:///${join(ROOT, 'tools', 'og-image.html').replace(/\\/g, '/')}`,
    ],
    { encoding: 'utf8', timeout: 90000 }
  );

  if (!existsSync(tmp)) {
    console.error('\nScreenshot chiqmadi:', res.stderr?.slice(0, 400));
  } else {
    const shot = await sharp(tmp).metadata();
    await sharp(tmp)
      .resize(1200, 630, { fit: 'cover', kernel: 'lanczos3' })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(join(SITE, 'assets', 'og-image.jpg'));
    await unlink(tmp);
    done.push(['assets/og-image.jpg', `${shot.width}x${shot.height} -> 1200x630`]);
  }
}

console.log('');
for (const [name, note] of done) console.log(`  ${name.padEnd(26)} ${note}`);
