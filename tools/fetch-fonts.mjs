/**
 * Google Fonts'dan Poppins + Inter woff2 subsetlarini yuklab oladi va
 * @font-face CSS'ini local yo'llar bilan chiqaradi.
 *
 * Faqat `latin` va `latin-ext` subsetlari olinadi. Ikkalasi ham qo'shiladi,
 * lekin brauzer unicode-range asosida faqat kerakli faylni yuklaydi —
 * o'zbek matni ASCII bo'lgani uchun amalda faqat `latin` tortiladi.
 *
 * Ishlatish:  node tools/fetch-fonts.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_DIR = join(import.meta.dirname, '..', 'site', 'assets', 'fonts');
const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const KEEP = new Set(['latin', 'latin-ext']);

const css = await fetch(CSS_URL, { headers: { 'User-Agent': UA } }).then((r) => r.text());

// CSS'ni /* subset-nomi */ izohlari bo'yicha bo'laklarga ajratamiz
const blocks = [];
const re = /\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
for (const m of css.matchAll(re)) {
  const [, subset, face] = m;
  if (!KEEP.has(subset)) continue;
  blocks.push({
    subset,
    family: /font-family:\s*'([^']+)'/.exec(face)[1],
    weight: /font-weight:\s*(\d+)/.exec(face)[1],
    style: (/font-style:\s*(\w+)/.exec(face) || [, 'normal'])[1],
    range: /unicode-range:\s*([^;]+);/.exec(face)[1].trim(),
    url: /url\((https:[^)]+)\)/.exec(face)[1],
  });
}

await mkdir(OUT_DIR, { recursive: true });

// Inter o'zgaruvchan (variable) shrift: 400/500/600 uchun URL bir xil.
// Shu sababli faylni URL bo'yicha bir marta saqlaymiz.
const savedByUrl = new Map();
const lines = [];
let totalBytes = 0;

for (const b of blocks) {
  let file = savedByUrl.get(b.url);
  if (!file) {
    const isVariable = blocks.filter((x) => x.url === b.url).length > 1;
    file = `${b.family.toLowerCase()}-${isVariable ? 'var' : b.weight}-${b.subset}.woff2`;
    const buf = Buffer.from(await fetch(b.url).then((r) => r.arrayBuffer()));
    await writeFile(join(OUT_DIR, file), buf);
    savedByUrl.set(b.url, file);
    totalBytes += buf.length;
    console.log(`  ${file.padEnd(32)} ${(buf.length / 1024).toFixed(1)} KB`);
  }
  lines.push(
    `@font-face{font-family:'${b.family}';font-style:${b.style};font-weight:${b.weight};` +
      `font-display:swap;src:url(assets/fonts/${file}) format('woff2');` +
      `unicode-range:${b.range}}`
  );
}

await writeFile(join(import.meta.dirname, 'font-face.css'), lines.join('\n') + '\n');
console.log(`\nJami: ${savedByUrl.size} fayl, ${(totalBytes / 1024).toFixed(1)} KB`);
console.log(`@font-face qoidalari: ${lines.length} ta -> tools/font-face.css`);
