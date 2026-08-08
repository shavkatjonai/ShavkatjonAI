/**
 * Saytning butunligini tekshiradi — joylashdan oldin yurgiziladi.
 *
 *   node tools/verify.mjs
 *
 * Tekshiradi: har bir lokal fayl yo'li mavjudligini, manifest ikonkalarini,
 * HTML tuzilmasini (yopilmagan teg, takroriy id, bitta h1) va href="#" yo'qligini.
 * Xato bo'lsa 1 kod bilan chiqadi.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SITE = join(ROOT, 'site');
const PAGES = ['index.html', '404.html'];
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);

let fail = 0;
const bad = (msg) => { console.log(`  XATO: ${msg}`); fail++; };

// ---------- 1. Lokal fayl yo'llari ----------
console.log('=== Lokal fayl yo\'llari ===');
let checked = 0;
for (const page of PAGES) {
  // Izohlar tashlanadi: ular kelajakda tiklash uchun namuna yo'llar saqlaydi
  // (masalan hali yaratilmagan bot havolasi) — bular jonli havola emas.
  const html = readFileSync(join(SITE, page), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g))
    m[1].split(',').forEach((s) => refs.add(s.trim().split(/\s+/)[0]));
  for (const m of html.matchAll(/url\(([^)]+)\)/g)) refs.add(m[1].replace(/['"]/g, ''));

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;
    checked++;
    // ildizdan boshlanmasa, sahifaga nisbatan hisoblanadi
    const target = ref.startsWith('/')
      ? join(SITE, ref.slice(1))
      : join(SITE, dirname(page), ref);
    if (!existsSync(target)) bad(`${page} -> ${ref} fayli yo'q`);
  }
}
console.log(`  ${checked} ta yo'l tekshirildi`);

// ---------- 2. Manifest ikonkalari ----------
console.log('\n=== Manifest ikonkalari ===');
const manifest = JSON.parse(readFileSync(join(SITE, 'site.webmanifest'), 'utf8'));
for (const icon of manifest.icons) {
  if (!existsSync(join(SITE, icon.src.replace(/^\//, '')))) bad(`manifest -> ${icon.src} yo'q`);
}
console.log(`  ${manifest.icons.length} ta ikonka tekshirildi`);

// ---------- 3. HTML tuzilmasi ----------
console.log('\n=== HTML tuzilmasi ===');
for (const page of PAGES) {
  const raw = readFileSync(join(SITE, page), 'utf8');
  const stripped = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');

  const stack = [];
  let mismatch = 0;
  for (const m of stripped.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g)) {
    const [, closing, tag, selfClosed] = m;
    const t = tag.toLowerCase();
    if (VOID.has(t) || selfClosed) continue;
    if (closing) { if (stack.pop() !== t) mismatch++; }
    else stack.push(t);
  }

  const ids = [...raw.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
  const h1s = (raw.match(/<h1[\s>]/g) || []).length;
  const emptyHrefs = (raw.match(/href="#?"/g) || []).length;

  console.log(`  ${page}: yopilmagan=${stack.length} nomuvofiq=${mismatch} takroriy-id=${dupes.length} h1=${h1s} bo'sh-href=${emptyHrefs}`);
  if (stack.length) bad(`${page}: yopilmagan teglar -> ${stack.join(', ')}`);
  if (mismatch) bad(`${page}: ${mismatch} ta nomuvofiq yopilish`);
  if (dupes.length) bad(`${page}: takroriy id -> ${dupes.join(', ')}`);
  if (h1s !== 1) bad(`${page}: h1 soni ${h1s}, 1 bo'lishi kerak`);
  if (emptyHrefs) bad(`${page}: ${emptyHrefs} ta bo'sh href="#"`);
}

// ---------- 4. Sarlavha ierarxiyasi ----------
console.log('\n=== Sarlavha ierarxiyasi ===');
for (const page of PAGES) {
  const raw = readFileSync(join(SITE, page), 'utf8');
  const levels = [...raw.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  let prev = 0, skips = 0;
  for (const lvl of levels) {
    if (prev && lvl > prev + 1) skips++;
    prev = lvl;
  }
  console.log(`  ${page}: ${levels.length} sarlavha, sakrash=${skips}`);
  if (skips) bad(`${page}: ${skips} ta sarlavha darajasi sakrab ketgan`);
}

console.log(fail ? `\n>>> ${fail} XATO TOPILDI` : '\n>>> HAMMASI O\'TDI');
process.exit(fail ? 1 : 0);
