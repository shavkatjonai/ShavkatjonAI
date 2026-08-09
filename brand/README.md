# Brend to'plami — Shavkatjon AI

Logotip, ijtimoiy tarmoq grafikalari va Canva brend-kit sozlamalari.
Barchasi bitta vizual tizim: SV monogramma + brend ranglari + Poppins/Inter.

---

## Logotip — `brand/logo/`

Barcha fayllar **haqiqiy vektor** (SVG). Harflar Poppins ExtraBold glif konturidan
olingan — istalgan o'lchamda toza, dizayn dasturlarida ham ishlaydi.

| Fayl | Ishlatish |
|---|---|
| `logo-mark.svg` | SV monogramma (yashil kvadrat) — asosiy belgi, avatar, favicon |
| `logo-mark-32-optimized.svg` | Kichik o'lcham (16–32px) uchun kattaroq harfli variant |
| `logo-horizontal-light.svg` | To'liq logotip (belgi + "Shavkatjon Vahobov" + tagline) — **oq/och fon** |
| `logo-horizontal-dark.svg` | Xuddi shu — **to'q fon** uchun (oq matn, mint tagline) |
| `logo-wordmark-light/dark.svg` | Faqat matn qismi (belgisiz) |

**Qayta yasash / o'zgartirish:** `node tools/build-logo.mjs`
(matn yoki o'lchamni `tools/build-logo.mjs` ichida sozlang).

Sayt ikonkalari (`site/favicon.svg`, `.ico`, `apple-touch`, `icon-192/512`,
`maskable`) ham shu skript orqali SV belgisidan yasaladi.

---

## Ijtimoiy tarmoq grafikalari — `brand/social/`

Yuklashga tayyor PNG, aniq brend ranglarida. Har birining o'lchami platformaga
mos, matn xavfsiz zonalar ichida.

| Fayl | O'lcham | Qayerga |
|---|---|---|
| `youtube-banner.png` | 2560×1440 | YouTube kanal banneri (kontent markazdagi xavfsiz zonada) |
| `youtube-thumbnail.png` | 1280×720 | YouTube video muqovasi (shablon) |
| `linkedin-banner.png` | 1584×396 | LinkedIn profil fon rasmi |
| `x-header.png` | 1500×500 | X (Twitter) header (avatar joyi bo'sh qoldirilgan) |
| `instagram-post.png` | 1080×1350 | Instagram post |
| `instagram-story.png` | 1080×1920 | Instagram Story |
| `square-post.png` | 1080×1080 | LinkedIn / Facebook / kvadrat post |

**Qayta yasash:** `node tools/build-social.mjs`
(matn/joylashuvni `tools/build-social.mjs` ichida sozlang; matn self-host
Poppins woff2 bilan headless Chrome orqali chiziladi).

---

## Canva (Education akkaunt)

**Papka:** https://www.canva.com/folder/FAHRwAjtQ08

Tahrirlanadigan shablonlar (yangi post/story yozganda matnni almashtirasiz):

- **Instagram post** — https://www.canva.com/d/WUOSU1wFGdJ701i
- **Instagram Story** — https://www.canva.com/d/mh97NaixMRyvy_N

> Canva'da matn hozircha standart shriftda. Brand Kit'ga Poppins/Inter
> qo'shsangiz (pastda), yoki matnni tanlab shriftni **Poppins** qilsangiz,
> brendga to'liq mos bo'ladi.

YouTube / LinkedIn / X uchun tayyor PNG'lar `brand/social/` da — to'g'ridan-to'g'ri
yuklanadi. Ularning tahrirlanadigan Canva versiyasi kerak bo'lsa, ayting.

---

## Brand Kit'ni qo'lda sozlash (Canva)

Canva API brend kit yarata olmaydi — buni bir marta qo'lda qilasiz:

**Canva bosh sahifa → Brand → Brand Kit**

**1. Ranglar** (hex bilan qo'shing):

| Rol | Hex |
|---|---|
| Asosiy yashil | `#0A6B61` |
| Mint | `#9CC9C5` |
| Navy (matn/fon) | `#121F36` |
| Yordamchi | `#006B62` · `#E7F1F0` · `#5D7078` · `#FAFBFC` · `#E1E7EA` |

**2. Shriftlar:** Sarlavha — **Poppins** (600/700/800). Matn — **Inter** (400/500/600).

**3. Logotip:** `brand/logo/logo-mark.svg` yoki `site/icon-512.png` ni yuklang.
To'liq logotip kerak bo'lsa `logo-horizontal-light.svg` / `-dark.svg`.

---

## Ranglar (to'liq token jadvali)

```
--green      #0A6B61   asosiy yashil (tugma, belgi foni)
--green-2    #006B62   urg'u yashil (havola, sarlavha urg'u)
--green-dark #005049   bosilgan holat
--mint       #9CC9C5   ochiq aksent (tagchiziq, nuqta panjara)
--mint-soft  #E7F1F0   juda och fon
--navy       #121F36   asosiy matn, to'q blok foni
--muted      #5D7078   ikkilamchi matn
--bg         #FAFBFC   sahifa foni
--card       #FFFFFF   karta foni
--line       #E1E7EA   chiziq/chegara
```

Tungi rejim variantlari va to'liq brend qoidalari — loyiha ildizidagi
[`CLAUDE.md`](../CLAUDE.md) da.
