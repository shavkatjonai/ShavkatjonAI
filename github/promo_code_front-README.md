<!-- ============================================================
     `promo_code_front` repozitoriysidagi README.md ni SHU BILAN
     to'liq almashtiring. Hozirgisi Nuxt'ning tayyor shabloni
     ("Nuxt Minimal Starter") — loyiha haqida hech nima aytmaydi.

     TO'LDIRISH KERAK BO'LGAN JOYLAR [ ] bilan belgilangan:
     sahifalar ro'yxati va .env o'zgaruvchilarining aniq nomlari.
     Ularni men to'qib yozmadim.
     ============================================================ -->

# Promokod tizimi — frontend

[`promo_code`](https://github.com/shavkatjonai/promo_code) backendining veb
qismi: foydalanuvchi promokodlarni kategoriya va brend bo'yicha ko'radi,
qidiradi va nusxalaydi. Ma'lumot Django REST API orqali keladi.

Tizimning ikkinchi kirish nuqtasi — Telegram bot, u ham shu backendda.

## Texnologiyalar

- **Nuxt 3** (Vue 3, SSR)
- **TypeScript**
- **Tailwind CSS**
- Backend: [`promo_code`](https://github.com/shavkatjonai/promo_code) — Django REST Framework + PostgreSQL

## Talablar

- Node.js 20 yoki yuqori
- Ishlab turgan `promo_code` backend (odatda `http://localhost:8000`)

## O'rnatish

```bash
git clone https://github.com/shavkatjonai/promo_code_front.git
cd promo_code_front
npm install
```

## Muhit o'zgaruvchilari

Ildizda `.env` fayli yarating:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

<!-- [ ] TO'LDIRING: loyihada boshqa env o'zgaruvchilari bo'lsa
     (masalan analitika kaliti, media URL) shu yerga qo'shing. -->

> `.env` faylini **commit qilmang** — `.gitignore` da turishi kerak.

## Ishga tushirish

```bash
npm run dev
```

`http://localhost:3000` da ochiladi.

## Production uchun yig'ish

```bash
npm run build
npm run preview
```

## Sahifalar

<!-- [ ] TO'LDIRING: app/ papkasidagi haqiqiy sahifalarni yozing.
     Namuna: -->

| Yo'l | Vazifasi |
|---|---|
| `/` | Bosh sahifa — aktual promokodlar |
| `/brands/[slug]` | Brend bo'yicha promokodlar |
| `/categories/[slug]` | Kategoriya bo'yicha promokodlar |

## Loyiha tuzilishi

```
app/                Nuxt sahifalari va komponentlari
types/              TypeScript tiplari (API javoblari)
public/             statik fayllar
nuxt.config.ts      Nuxt konfiguratsiyasi
tailwind.config.js  dizayn tokenlari
```

## Bog'liq repozitoriylar

- [`promo_code`](https://github.com/shavkatjonai/promo_code) — backend, API va Telegram bot
