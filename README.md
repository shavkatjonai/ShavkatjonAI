======= HEAD
# Hi, I'm Shavkatjon 👋

AI Engineer · Educator · Builder from Uzbekistan.

I build Uzbek speech-recognition, computer-vision and backend systems,
then explain what I learn in Uzbek.

> AI’ni faqat ishlatma — uni tushun va yarat.

Currently focused on:
- Uzbek Speech-to-Text
- Computer Vision
- AI education
- Django, FastAPI and Telegram systems

Uzbek technical learning resources are still growing — I’m helping build that layer.

---

## What I'm focused on

**Speech recognition for Uzbek.** Open ASR models barely support Uzbek, so I
fine-tune Whisper on Uzbek audio and ship the model with a browser demo. This is
the work I care about most — there is very little competition here, which is
exactly why it matters. It was also the subject of my Bachelor's thesis (see
[stt_interface](https://github.com/shavkatjonai/stt_interface) below).

**Computer vision.** Object detection and tracking with YOLOv11 and ByteTrack,
tuned to hold real-time frame rates on real video streams — the foundation for
a traffic-counting system currently in progress (see "More coming" below).

**Backends and Telegram systems.** Django REST and FastAPI services, plus
multi-role Aiogram bots, for order intake, CRM and promo-code distribution —
from schema design to VPS deployment.

**Foundations, not just tools.** Machine Learning, Deep Learning and Data
Science as a discipline — I care about understanding the math and logic behind
an algorithm, not only calling a library that implements it.

**Teaching.** I teach AI and robotics to teenagers and to working
professionals who are not developers. Same rule both ways: show the result
first, explain the mechanism second.

---

## Education

- 🎓 **B.Sc. in Artificial Intelligence** — graduated with Honors (Uzbekistan's
  "red diploma"). My thesis project was **stt_interface**, the Uzbek
  speech-to-text system listed below.
- 🎓 **M.Sc. — application submitted.** Awarded the **Beruniy Scholarship**
  (a state scholarship named after the medieval scholar Al-Biruni). The
  admission decision itself is still pending.

---

## Selected projects

| Project | What it does | Stack |
|---|---|---|
| [**stt_interface**](https://github.com/shavkatjonai/stt_interface) | Uzbek speech-to-text web app — Whisper fine-tuned on an Uzbek dataset, runs on CPU. My Bachelor's thesis (BMI) project | PyTorch · Transformers · Gradio · Librosa |
| [**crm_bot**](https://github.com/shavkatjonai/crm_bot) | Multi-role management system for a production workshop: courier orders, accounting, stock reservations, automatic deadlines | Django · DRF · Aiogram 3 · PostgreSQL · APScheduler |
| [**promo_code**](https://github.com/shavkatjonai/promo_code) | Promo-code distribution platform — web and Telegram bot sharing one API and database | Django REST · Aiogram 3 · PostgreSQL |
| [**promo_code_front**](https://github.com/shavkatjonai/promo_code_front) | Frontend for the promo-code platform | Nuxt 4 · TypeScript · Tailwind |

More coming: a traffic-counting pipeline, Arduino competition robots
(line follower, sumo) and ESP32 BLE control.

---

## Tools I work with

**AI / ML** — Machine Learning · Deep Learning · Data Science · algorithms and their mathematical foundations · PyTorch · Transformers · Hugging Face · Whisper fine-tuning · YOLOv11 · ByteTrack · OpenCV · Gradio

**Backend** — Python · Django · Django REST Framework · FastAPI · PostgreSQL · Aiogram 3

**Frontend** — Nuxt · Vue · TypeScript · Tailwind · HTML/CSS/JS

**Embedded** — Arduino · ESP32 · BLE · C++

**Ops** — Ubuntu VPS · Nginx · Gunicorn · Certbot

---

## Where to find me

- 🌐 **[shavkatjonai.uz](https://shavkatjonai.uz)** — projects, services, writing
- 💬 **[Telegram](https://t.me/shavkatjonai)** — where I post daily, in Uzbek
- 📺 **[YouTube](https://www.youtube.com/@shavkatjonai)** — longer walkthroughs
- 📸 **[Instagram](https://www.instagram.com/shavkatjonai)** — short clips
- ✉️ **shavkatjonvahhobov@gmail.com** — project work and collaboration

---

<sub>**O'rgan. Qur. Qo'lla.** — *Learn. Build. Apply.*</sub>
=======
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
│       ├── portrait-{560,900}.{avif,webp,jpg}
│       └── og-image.jpg       1200x630, ijtimoiy tarmoqlar uchun
│
├── tools/                     ← saytga KIRMAYDI, faqat generatorlar
│   ├── portrait-source.jpg    portretning asl nusxasi (900x1125)
│   ├── brand-mark.svg         chaqmoq belgisi — ikonkalar manbasi
│   ├── og-image.html          og-image kompozitsiyasi
│   ├── fetch-fonts.mjs        shriftlarni yuklab oladi
│   ├── build-images.mjs       portret variantlarini yasaydi
│   └── build-icons.mjs        ikonkalar + og-image yasaydi
│
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

**Portret rasmini almashtirish:**

```bash
cp yangi-rasm.jpg tools/portrait-source.jpg && node tools/build-images.mjs
```

Rasm 4:5 nisbatda va kamida 900px kenglikda bo'lsin. `netlify.toml` da rasmlar
bir yilga keshlanadi — rasm o'zgarsa fayl nomiga versiya qo'shing
(`portrait-900-v2.avif`) va `index.html` dagi yo'llarni yangilang.

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

1. **GitHub repolariga README yozish.** Saytdan `crm_bot`, `promo_code`,
   `stt_interface` repolariga havola bor, lekin ularda README yo'q — tashrifchi
   ochganda bo'sh sahifa ko'radi. Bu ishonchni saytdagi hamma narsadan
   ko'proq buzadi.
2. **Email manzilini qo'shish.** Hozir aloqa ro'yxatida "tez orada" holatida.
   `index.html` dagi izohda qanday almashtirish yozilgan.
3. **Lead-magnit PDF'ini yasash** — `t.me/shavkatjonai_bot` uni yubormaydi hozircha.
4. **Traffic counter, robot va ESP32 loyihalarini GitHub'ga qo'yish** — saytda
   ular "Kod tez orada" deb turgan, repo paydo bo'lgach `<article>` ni `<a href>` ga
   almashtirasiz (`index.html` da qo'shni kartalar namuna).
>>>>>>> 13de67b (Saytni statik, build qadamisiz strukturaga o'tkazish)
