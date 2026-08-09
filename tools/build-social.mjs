/**
 * Barcha ijtimoiy tarmoqlar uchun brend-aniq grafikalar (PNG).
 *
 * Matn self-host Poppins (woff2) bilan headless Chrome orqali chiziladi —
 * bu har doim to'g'ri va piksel-aniq (opentype.js glif konturlari ba'zi
 * matnlarda NaN berardi). SV markasi yashil kvadratda "SV" harfi sifatida.
 *
 *   node tools/build-social.mjs
 *
 * Natija -> brand/social/*.png
 */
import sharp from 'sharp';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'brand', 'social');
const TMP = join(ROOT, 'tools', '.social-tmp');
const FONTS = join(ROOT, 'site', 'assets', 'fonts');
await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].find((p) => existsSync(p));
if (!CHROME) { console.error('Chrome topilmadi'); process.exit(1); }

const fileUrl = (p) => 'file:///' + p.replace(/\\/g, '/');
const FONT_CSS = `
@font-face{font-family:Poppins;font-weight:600;src:url('${fileUrl(join(FONTS, 'poppins-600-latin.woff2'))}') format('woff2')}
@font-face{font-family:Poppins;font-weight:700;src:url('${fileUrl(join(FONTS, 'poppins-700-latin.woff2'))}') format('woff2')}
@font-face{font-family:Poppins;font-weight:800;src:url('${fileUrl(join(FONTS, 'poppins-800-latin.woff2'))}') format('woff2')}`;

const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--navy:#121F36;--mint:#9CC9C5;--green:#0A6B61;--muted:rgba(255,255,255,.72)}
html,body{margin:0}
.stage{position:relative;overflow:hidden;background:var(--navy);font-family:Poppins,sans-serif;color:#fff}
.mark{background:var(--green);border-radius:23.5%;display:flex;align-items:center;justify-content:center;
      color:#fff;font-weight:800;line-height:1;letter-spacing:-.04em;font-feature-settings:normal}
.mark span{transform:translateY(-2%)}
.dots{position:absolute;background-image:radial-gradient(var(--mint) 3px,transparent 3.2px);pointer-events:none}
.ring{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.10);pointer-events:none}
.slogan{font-weight:800;letter-spacing:-.02em;line-height:1.06}
.slogan .l1{color:#fff}
.slogan .l2{color:var(--mint)}
.rule{background:var(--mint);border-radius:3px}
.tag{font-weight:600;color:var(--muted)}
.url{font-weight:600;color:var(--mint)}
.name{font-weight:800;letter-spacing:-.02em;color:#fff}
.badge{display:inline-flex;align-items:center;gap:.5em;background:var(--green);color:#fff;border-radius:100px;
       font-weight:600;text-transform:uppercase;letter-spacing:.14em}
.badge .bolt{width:.7em;height:1.05em}
.badge .div{width:2px;height:1em;background:rgba(255,255,255,.45)}
`;

const mark = (size, fs = null) =>
  `<div class="mark" style="width:${size}px;height:${size}px;font-size:${fs ?? Math.round(size * 0.54)}px"><span>SV</span></div>`;

const dots = (x, y, w, h, step = 34, op = 0.28) =>
  `<div class="dots" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background-size:${step}px ${step}px;opacity:${op}"></div>`;

const ring = (cx, cy, r) =>
  `<div class="ring" style="left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px"></div>`;

const slogan2 = (fs) =>
  `<div class="slogan" style="font-size:${fs}px"><div class="l1">AI'ni faqat ishlatma.</div><div class="l2">Uni tushun va yarat.</div></div>`;

const badge = (fs) =>
  `<div class="badge" style="font-size:${fs}px;padding:${fs * 0.5}px ${fs * 0.85}px">`
  + `<svg class="bolt" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z"/></svg>`
  + `<span class="div"></span>SHAVKATJON AI</div>`;

// ---- format ta'riflari: {w,h, body} ----
const F = {};

F['youtube-banner'] = (W = 2560, H = 1440) => `
<div class="stage" style="width:${W}px;height:${H}px">
  ${dots(W - 360, 150, 250, 160)}${dots(120, H - 320, 250, 160)}
  ${ring(W - 120, H - 120, 360)}${ring(180, 200, 300)}
  <div style="position:absolute;left:0;top:${H / 2}px;transform:translateY(-50%);width:100%;
       display:flex;flex-direction:column;align-items:center;text-align:center">
    ${mark(150)}
    <div class="rule" style="width:92px;height:8px;margin:44px 0 30px"></div>
    ${slogan2(92)}
    <div class="tag" style="font-size:30px;letter-spacing:.18em;margin-top:34px">AI ENGINEER&nbsp;&nbsp;•&nbsp;&nbsp;EDUCATOR&nbsp;&nbsp;•&nbsp;&nbsp;BUILDER</div>
    <div class="url" style="font-size:34px;margin-top:26px">shavkatjonai.uz</div>
  </div>
</div>`;

F['youtube-thumbnail'] = (W = 1280, H = 720) => `
<div class="stage" style="width:${W}px;height:${H}px;padding:70px 80px;display:flex;flex-direction:column;justify-content:space-between">
  ${dots(W - 300, 60, 210, 150, 34)}${ring(W - 20, H - 20, 300)}
  <div>${badge(28)}</div>
  <div style="margin-top:auto">
    <div class="slogan" style="font-size:118px"><div class="l1">AI'ni faqat</div><div class="l1">ishlatma.</div><div class="l2" style="font-size:70px;margin-top:6px">Uni tushun va yarat.</div></div>
    <div class="rule" style="width:96px;height:8px;margin:26px 0 18px"></div>
    <div class="url" style="font-size:34px;color:rgba(255,255,255,.75)">shavkatjonai.uz</div>
  </div>
</div>`;

F['linkedin-banner'] = (W = 1584, H = 396) => `
<div class="stage" style="width:${W}px;height:${H}px;display:flex;align-items:center;padding:0 90px">
  ${dots(W - 300, 60, 210, 150, 32)}${ring(W - 90, H / 2, 250)}
  ${mark(108)}
  <div style="margin-left:40px">
    <div class="name" style="font-size:64px">Shavkatjon Vahobov</div>
    <div class="tag" style="font-size:24px;letter-spacing:.16em;color:var(--mint);margin-top:8px">AI ENGINEER&nbsp;&nbsp;•&nbsp;&nbsp;EDUCATOR&nbsp;&nbsp;•&nbsp;&nbsp;BUILDER</div>
    <div class="rule" style="width:80px;height:6px;margin:22px 0 20px"></div>
    <div style="font-size:29px;color:var(--muted);font-weight:600">AI'ni faqat ishlatma. Uni tushun va yarat.</div>
    <div class="url" style="font-size:25px;color:rgba(255,255,255,.6);margin-top:10px">shavkatjonai.uz</div>
  </div>
</div>`;

F['x-header'] = (W = 1500, H = 500) => `
<div class="stage" style="width:${W}px;height:${H}px">
  ${dots(W - 300, 56, 210, 150, 32)}${ring(W - 70, H / 2, 240)}
  <div style="position:absolute;right:90px;top:${H / 2}px;transform:translateY(-50%);text-align:right;display:flex;flex-direction:column;align-items:flex-end">
    ${mark(84)}
    <div class="name" style="font-size:60px;margin-top:22px">Shavkatjon Vahobov</div>
    <div class="tag" style="font-size:23px;letter-spacing:.16em;color:var(--mint);margin-top:8px">AI ENGINEER&nbsp;&nbsp;•&nbsp;&nbsp;EDUCATOR&nbsp;&nbsp;•&nbsp;&nbsp;BUILDER</div>
    <div class="rule" style="width:76px;height:6px;margin:20px 0 16px"></div>
    <div class="url" style="font-size:28px;color:rgba(255,255,255,.7)">shavkatjonai.uz</div>
  </div>
</div>`;

const centeredQuote = (W, H, markSize, sfs) => `
<div class="stage" style="width:${W}px;height:${H}px">
  ${dots(W - 250, 70, 190, 170, 30)}${ring(W - 40, H - 260, 300)}
  <div style="position:absolute;left:0;top:${H / 2}px;transform:translateY(-50%);width:100%;
       display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 70px">
    ${mark(markSize)}
    <div style="height:${Math.round(markSize * 0.5)}px"></div>
    ${slogan2(sfs)}
    <div class="rule" style="width:96px;height:8px;margin:${Math.round(sfs * 0.5)}px 0 ${Math.round(sfs * 0.34)}px"></div>
    <div class="tag" style="font-size:${Math.round(sfs * 0.3)}px;letter-spacing:.14em">AI ENGINEER • EDUCATOR • BUILDER</div>
    <div class="url" style="font-size:${Math.round(sfs * 0.4)}px;margin-top:${Math.round(sfs * 0.7)}px">shavkatjonai.uz</div>
  </div>
</div>`;

F['instagram-post'] = () => centeredQuote(1080, 1350, 150, 88);
F['instagram-story'] = () => centeredQuote(1080, 1920, 160, 92);
F['square-post'] = () => centeredQuote(1080, 1080, 140, 84);

// ---- render ----
function shoot(name, w, h, html) {
  const htmlPath = join(TMP, `${name}.html`);
  const pngPath = join(TMP, `${name}.png`);
  return writeFile(htmlPath, `<!doctype html><meta charset="utf-8"><style>${FONT_CSS}${BASE_CSS}</style>${html}`)
    .then(() => {
      const res = spawnSync(CHROME, [
        '--headless=new', '--disable-gpu', '--hide-scrollbars',
        '--force-device-scale-factor=2', `--window-size=${w},${h}`,
        `--screenshot=${pngPath}`, '--default-background-color=00000000',
        fileUrl(htmlPath),
      ], { encoding: 'utf8', timeout: 90000 });
      if (!existsSync(pngPath)) throw new Error(`${name}: screenshot chiqmadi. ${res.stderr?.slice(0, 300)}`);
      return sharp(pngPath).resize(w, h, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(join(OUT, `${name}.png`));
    });
}

const dims = {
  'youtube-banner': [2560, 1440], 'youtube-thumbnail': [1280, 720],
  'linkedin-banner': [1584, 396], 'x-header': [1500, 500],
  'instagram-post': [1080, 1350], 'instagram-story': [1080, 1920], 'square-post': [1080, 1080],
};

for (const [name, [w, h]] of Object.entries(dims)) {
  await shoot(name, w, h, F[name](w, h));
  console.log(`  ${name}.png`.padEnd(30) + `${w}x${h}`);
}
await rm(TMP, { recursive: true, force: true });
console.log('Tayyor -> brand/social/');
