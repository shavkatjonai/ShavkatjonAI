# shavkatjonai.uz — loyiha konteksti

## 1. Men kimman

**Shavkatjon Vahobov** — Toshkentda AI va robototexnika yo'nalishida o'qiyman, dars beraman va real loyihalar quraman.

Rollarim: **AI Engineer • Educator • Builder**.

**Pozitsiyam (bir jumlada):** men o'zbek yoshlariga AI muhandisligini real loyihalar orqali ochiq ko'rsataman.

**Auditoriyam:** 16–30 yoshli o'zbek IT o'quvchilari, junior dasturchilar, hamda bot/CV tizimi buyurtma qiladigan kichik biznes egalari.

**Asosiy og'riqlari:** o'zbek tilida material yo'q, ingliz tili kuchsiz, qayerdan boshlashni bilmaydi, portfolio yo'q.

**Farqlovchi ustunligim:** o'zbek tili uchun AI (Whisper fine-tuning) — bu sohada raqobat deyarli yo'q.

**Shiorlarim:**
- `AI'ni faqat ishlatma. Uni tushun va yarat.` (asosiy)
- `O'rgan. Qur. Qo'lla.` (yakuniy)

---

## 2. Texnik stack va tajribam

| Yo'nalish | Texnologiyalar |
|---|---|
| Computer Vision | YOLOv11, ByteTrack, OpenCV, PyTorch |
| Nutq / NLP | Whisper fine-tuning, Hugging Face, Gradio |
| Backend | Django, Django REST Framework, PostgreSQL |
| Bot | Aiogram (Telegram) |
| Frontend | Nuxt, HTML/CSS/JS |
| Embedded | Arduino, ESP32, BLE, C++ |
| Deploy | VPS (Ubuntu), Nginx, Gunicorn, Certbot |

**Loyihalarim (portfolio uchun asos):**
1. `traffic-counter-pro` — yo'l harakatini turlarga ajratib sanash va kuzatish (YOLOv11 + ByteTrack)
2. `whisper-uzbek-stt` — o'zbek tili uchun nutqni matnga o'giruvchi model (**eng qadrli ish**)
3. `promokod-system` — promokod chiqarish/tekshirish tizimi (Django REST + Aiogram + Nuxt)
4. `workshop-crm-bot` — ustaxona uchun ko'p rolli CRM bot (buyurtma / usta / mijoz / rahbar)
5. `line-follower-robot`, `robosumo` — Arduino robotlari
6. `esp32-ble` — simsiz boshqaruv (ESP32 + BLE)

---

## 3. Brend tizimi (Canva dizaynimdan piksel darajasida olingan — o'zgartirilmasin)

```css
/* Kunduzgi */
--green:#0A6B61;  --green-2:#006B62;  --green-dark:#005049;
--mint:#9CC9C5;   --mint-soft:#E7F1F0;
--bg:#FAFBFC;     --card:#FFFFFF;
--text:#121F36;   --muted:#5D7078;    --line:#E1E7EA;
--block:#121F36;  /* to'q navy blok foni */

/* Tungi */
--green:#1E8F82;  --green-2:#39B3A4;  --green-dark:#146F65;
--mint:#5FB8AE;   --mint-soft:rgba(57,179,164,.13);
--bg:#0A1420;     --card:#101E2E;
--text:#E9EFF3;   --muted:#95A8B5;    --line:rgba(255,255,255,.1);
--block:#0D1A28;
```

**Shriftlar:** sarlavha — `Poppins` (600/700/800), matn — `Inter` (400/500/600).

**Takrorlanuvchi vizual elementlar:**
- chaqmoq belgili yashil pill-badge: `⚡ | SHAVKATJON AI`
- `01 / 02 / 03` raqamli markerlar (doira yoki yumaloq kvadrat ichida, mint chegara bilan)
- nuqtali panjara (dot grid) — burchaklarda, past opacity
- mint rangli qisqa tagchiziq (`.rule`, 64×4px)
- portret atrofida ikki qavat yumaloq ramka + chap tomonda vertikal chiziq va nuqta
- yumaloq (100px radius) tugmalar va pill'lar

---

## 4. Hozirgi holat

- Domen: **shavkatjonai.uz** (sotib olingan). VPS bor.
- Fayl: bitta `index.html` — Poppins/Inter, dark mode (localStorage + `prefers-color-scheme`, `<head>` da flash oldini oluvchi skript), IntersectionObserver bilan skroll animatsiyasi, mobil menyu, JSON-LD `Person` sxemasi.
- Bo'limlar tartibi: Hero (01) → Isbot raqamlari → Ishlarim (02) → Xizmatlar (03) → Telegram lead-magnit → Blog (04) → Aloqa (05) → Futer.
- Portret rasmi hozircha base64 sifatida HTML ichiga joylashtirilgan (900×1125, 87 KB).
- Ijtimoiy tarmoq nomim hamma joyda: **`shavkatjonai`**.
  - Ishlaydi: Telegram (`t.me/shavkatjonai`), GitHub, Instagram, YouTube (`@shavkatjonai`)
  - Hali ochilmagan (saytda "tez orada" deb, bosilmaydigan holatda): Hugging Face, LinkedIn, X, TikTok
- Lead-magnit: `t.me/shavkatjonai_bot` — "AI ni noldan o'rganish yo'l xaritasi" PDF (hali yaratilmagan).

**Saytning asosiy vazifasi:** tashrifchini Telegram obunachisiga aylantirish. Ikkilamchi: texnik ishonch (portfolio) va buyurtma uchun aloqa.

---

## 5. Bajarilishi kerak bo'lgan ishlar

**Tez:**
- [ ] Base64 rasmni `assets/shavkatjon.jpg` ga chiqarish + WebP/AVIF variant, `<picture>` bilan
- [ ] Loyiha kartalaridagi `href="#"` → real GitHub repo havolalari
- [ ] "Isbot" raqamlarini realiga moslash
- [ ] `[EMAIL]` ni to'ldirish
- [ ] `og-image.jpg` (1200×630) yasash — brend ranglarida
- [ ] `favicon` to'plami, `robots.txt`, `sitemap.xml`

**O'rta:**
- [ ] Loyihani **Astro** ga ko'chirish (blog Markdown'da yozilsin, SEO to'liq ishlasin)
- [ ] Har loyiha uchun alohida sahifa: muammo → yechim → natija → demo GIF → kod
- [ ] Blog: birinchi 4 maqola (Whisper fine-tune / YOLOv11 / Django VPS deploy / Telegram bot arxitekturasi)
- [ ] Lighthouse 95+ (performance, a11y, SEO), Core Web Vitals

**Keyin:**
- [ ] Whisper demo'ni saytga o'rnatish (Gradio embed yoki HF Spaces iframe)
- [ ] Aloqa formasi (backendsiz: Formspree yoki Telegram bot webhook)
- [ ] `hreflang` bilan uz/en versiyalari
- [ ] Deploy: Nginx + Gunicorn (kerak bo'lsa) + `certbot --nginx -d shavkatjonai.uz -d www.shavkatjonai.uz`, gzip/brotli, cache headerlari
- [ ] Plausible yoki GoatCounter (Google Analytics emas — tez va maxfiylikka hurmatli)

---

## 6. Ishlash qoidalari (Claude Code uchun)

1. **Brend ranglari va shriftlari o'zgartirilmaydi.** Yangi rang kerak bo'lsa, mavjud tokenlardan hosil qilinadi.
2. **Har bir yangi rang/o'lcham CSS o'zgaruvchisi orqali** — hardcode qilinmasin. Har qanday yangi komponent **ham kunduzgi, ham tungi** rejimda tekshirilsin.
3. **Matn o'zbek tilida**, sodda va foydalanuvchi tilida. Texnologiya nomi emas, **natija** birinchi o'rinda ("Real vaqtda video oqimidan hisobot", "Buyurtmalar hisobi to'liq avtomat").
4. **Bo'sh maqtov yo'q.** Har bir da'vo ortida ko'rsatiladigan ish bo'lsin. Raqamlarni o'ylab topmang — bilmasangiz mendan so'rang.
5. **Ishlamaydigan havola qo'yilmasin.** Akkaunt yo'q bo'lsa — "tez orada", bosilmaydigan holatda.
6. Semantik HTML, `alt` matnlari, klaviatura fokusi (`:focus-visible`), `prefers-reduced-motion` — majburiy.
7. Ortiqcha kutubxona qo'shilmasin. Sof HTML/CSS/JS yetarli bo'lsa, shundayligicha qolsin.
8. Katta o'zgarishdan oldin qisqa reja ko'rsating, keyin bajaring.
