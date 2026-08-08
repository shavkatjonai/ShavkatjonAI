# shavkatjonai.uz

Shavkatjon Vahobovning shaxsiy brend landing page'i. **Sof statik sayt** — build qadami yo'q,
freymvork yo'q, tashqi so'rov yo'q. `site/` papkasini qanday bo'lsa shundayligicha
har qanday statik hostingga qo'yish mumkin.

Loyiha konteksti, brend tokenlari va ishlash qoidalari — [CLAUDE.md](CLAUDE.md) da.

---

## Struktura

```
.
├── site/                      ← Netlify shu papkani tarqatadi
│   ├── index.html             butun sayt: HTML + CSS + JS bitta faylda
│   ├── 404.html               brend uslubidagi xatolik sahifasi
│   ├── robots.txt  sitemap.xml  site.webmanifest
│   ├── favicon.ico  favicon.svg  apple-touch-icon.png
│   ├── icon-192.png  icon-512.png  icon-maskable-512.png
│   └── assets/
│       ├── fonts/             Poppins + Inter (self-host, woff2)
│       ├── portrait-v2-{560,900}.{avif,webp,jpg}
│       └── og-image.jpg       1200x630, ijtimoiy tarmoqlar uchun
│
├── tools/                     ← saytga KIRMAYDI, faqat generatorlar
│   ├── portrait-v2-source.jpg portret asli, 4000x6000 (git'ga kirmaydi, 13 MB)
│   ├── portrait-source.jpg    oldingi portret (endi ishlatilmaydi)
│   ├── brand-mark.svg         chaqmoq belgisi — ikonkalar manbasi
│   ├── og-image.html          og-image kompozitsiyasi
│   ├── fetch-fonts.mjs        shriftlarni yuklab oladi
│   ├── build-images.mjs       portret variantlarini yasaydi
│   └── build-icons.mjs        ikonkalar + og-image yasaydi
│
├── github/                    ← GitHub profilingiz uchun tayyor materiallar
│   ├── 00-BAJARILADIGAN-ISHLAR.md   topilgan muammolar (xavfsizlik birinchi)
│   ├── profil-README.md             `shavkatjonai` repo uchun
│   ├── promo_code_front-README.md   Nuxt shablonini almashtirish uchun
│   └── shablon-README.md            qolgan repolar uchun
│
├── legacy/index-original.html  asl bitta faylli versiya (etalon)
├── netlify.toml               publish papkasi, kesh va xavfsizlik sarlavhalari
└── CLAUDE.md                  loyiha konteksti
```

**Nega CSS va JS HTML ichida?** Sayt bitta sahifadan iborat. Alohida `.css` fayl
qo'shimcha so'rov va render blokirovkasi degani; bitta sahifa uchun inline CSS
o'lchamdan qat'i nazar tezroq. Blog paydo bo'lib, sahifalar soni ortganda
ajratish ma'noga ega bo'ladi.

---

## Netlify'ga joylash

### Variant A — GitHub orqali (tavsiya etiladi)

Har `git push` dan keyin sayt avtomatik yangilanadi.

1. GitHub'da bo'sh repo yarating (masalan `shavkatjonai.uz`), so'ng:

```bash
git remote add origin https://github.com/shavkatjonai/shavkatjonai.uz.git && git push -u origin main
```

2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → GitHub → repoyingizni tanlang.
3. Netlify `netlify.toml` ni o'zi o'qiydi. Sozlamalar shunday ko'rinishi kerak:
   - **Build command** — bo'sh
   - **Publish directory** — `site`

   Agar Netlify o'zidan build buyrug'i taklif qilsa, uni **o'chirib tashlang**.
4. **Deploy site**. 10–20 sekundda `random-nom-123.netlify.app` manzilida ochiladi.

### Variant B — papkani tashlab yuborish

Tezkor sinov uchun: [app.netlify.com/drop](https://app.netlify.com/drop) ga **`site` papkasini**
sichqoncha bilan tashlang. Bu holda `netlify.toml` o'qilmaydi — kesh va xavfsizlik
sarlavhalari qo'llanmaydi, shuning uchun doimiy ishlatish uchun Variant A yaxshiroq.

---

## shavkatjonai.uz domenini ulash

Netlify panelida: **Domain management** → **Add a domain** → `shavkatjonai.uz`.

So'ng ikki yo'ldan birini tanlaysiz:

**1. Netlify DNS (soddaroq va ishonchliroq).** Netlify sizga 4 ta nameserver beradi
(`dns1.p0X.nzone.net` ko'rinishida). Ularni domen registratoringiz panelida
(`.uz` uchun odatda cctld.uz / uzinfocom orqali) mavjud nameserverlar o'rniga
yozasiz. Netlify apex domen uchun ALIAS yozuvini o'zi boshqaradi — qattiq IP
yozib qo'yishga hojat yo'q.

**2. Tashqi DNS'ni saqlab qolish.** Registrator panelida:

| Tur | Nom | Qiymat |
|---|---|---|
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `<sayt-nomi>.netlify.app` |

Nameserver o'zgarishi 1–24 soat ichida tarqaladi. Keyin Netlify Let's Encrypt
sertifikatini avtomatik oladi — **Domain management → HTTPS** bo'limida
"Verify DNS configuration" tugmasi bilan tezlashtirish mumkin.

Ikkala holatda ham Netlify panelida **Primary domain** ni `shavkatjonai.uz`
qilib belgilang — `www` varianti unga avtomatik yo'naltiriladi.

---

## Saytni tahrirlash

**Matn, havola, raqamlar** — `site/index.html` ni oching va to'g'ridan-to'g'ri
tahrirlang. Boshqa hech narsa qilish kerak emas.

**Portret rasmini almashtirish.** Skript istalgan nisbatdagi rasmni 4:5 ga
kesib beradi. `--crop="cx,cy,scale"` — kesish markazi va kengligi, manba
o'lchamiga nisbatan kasrlar bilan:

```bash
node tools/build-images.mjs --source=portrait-v3-source.jpg --version=v3 --crop="0.62,0.34,0.44"
```

`cx,cy` — yuz markazi qayerda (0.5 = o'rtada), `scale` — kesim kengligi manba
kengligining qanchasi. Natijani `site/assets/` da ko'rib, sonlarni sozlab qayta
yurgizasiz. So'ng `index.html` dagi 6 ta rasm yo'lini yangi versiyaga o'zgartirasiz.

> `netlify.toml` da rasmlar bir yilga `immutable` keshlanadi. Shu sababli
> **fayl nomini o'zgartirmasdan mazmunini almashtirmang** — eski tashrifchilar
> yangi rasmni hech qachon ko'rmaydi. `--version` shuning uchun bor.

**og-image matnini o'zgartirish:**

```bash
node tools/build-icons.mjs
```

Undan oldin `tools/og-image.html` ichidagi `.line1` / `.line2` matnlarini tahrirlang.

**Ikonkani o'zgartirish:** `tools/brand-mark.svg` ni tahrirlab, yuqoridagi
`build-icons.mjs` ni qayta yurgizing.

> Generator skriptlar `sharp` paketiga bog'liq. Birinchi marta:
> `cd tools && npm install`

---

## Keyingi ishlar

Bajarilishi kerak bo'lganlar ro'yxati [CLAUDE.md](CLAUDE.md) ning 5-bo'limida.
Eng birinchi navbatdagilari:

1. **GitHub profilini tartibga solish** — batafsil ro'yxat va tayyor matnlar
   [`github/00-BAJARILADIGAN-ISHLAR.md`](github/00-BAJARILADIGAN-ISHLAR.md) da.
   Eng shoshilinchi: `resume` repozitoriysida `.env` fayli ochiq turibdi.
2. **Telegram botni yaratish.** `@shavkatjonai_bot` Telegram'da hali ro'yxatdan
   o'tmagan — tekshirildi (mavjud bo'lmagan username sahifasi bilan bir xil javob
   qaytaradi). Shu sababli magnit blokidagi tugma hozir **bosilmaydigan** holatda
   ("PDF tez orada"). @BotFather orqali bot yaratib, lead-magnit PDF'ini ulagach
   `index.html` dagi izohda ko'rsatilganidek `<span class="btn btn--soon">` ni
   `<a class="btn btn--light" href="...">` ga almashtiring.
3. **Traffic counter, robot va ESP32 loyihalarini GitHub'ga qo'yish** — saytda
   ular "Kod tez orada" deb turgan, repo paydo bo'lgach `<article>` ni `<a href>` ga
   almashtirasiz (`index.html` da qo'shni kartalar namuna).
4. **Domen ulanmaguncha** `og:image` va JSON-LD absolyut
   `https://shavkatjonai.uz/...` manzillarni ko'rsatadi. `*.netlify.app` da sinab
   ko'rganda ijtimoiy tarmoq previewi rasmni topmaydi — bu normal, domen
   ulangach o'zi tuzaladi.
5. **`sitemap.xml` dagi `lastmod`** qo'lda yozilgan. Saytga sezilarli o'zgarish
   kiritsangiz sanani yangilang.
