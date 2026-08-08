# GitHub profilingiz bo'yicha topilganlar

Saytdan GitHub'ga havola bor, ya'ni profilingiz endi brendingizning bir qismi.
19 ta public repo tekshirildi. Muhimlik tartibida.

---

## 1. XAVFSIZLIK — darhol hal qilinishi kerak

### `resume` repozitoriysida `.env` fayli ochiq turibdi

`https://raw.githubusercontent.com/shavkatjonai/resume/HEAD/.env` — istalgan
odam ochib o'qiy oladi. Ichida `SECRET_KEY` va `DEBUG` bor (93 bayt).

Django `SECRET_KEY` sessiya imzolari, parol tiklash tokenlari va CSRF
himoyasini boshqaradi. U ochiq bo'lsa loyiha ishlab turgan joyda sessiya
qalbakilashtirish mumkin.

**Nima qilish kerak:**

```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from version control"
git push
```

Muhim: bu faqat keyingi holatni tuzatadi — **fayl git tarixida qoladi**.
Shuning uchun:

1. **`SECRET_KEY` ni almashtiring** (yangi generatsiya qilib, serverdagi
   `.env` ga yozing). Eski kalit ochiq deb hisoblanadi.
2. Tarixdan butunlay olib tashlash uchun `git filter-repo` yoki repoyi qayta
   yaratish kerak. Loyiha o'quv ishi bo'lsa, eng sodda yo'l — repoyi
   `private` qilish yoki o'chirish.

Shuningdek `resume` va `RedoxAI` da `db.sqlite3` commit qilingan — bazada
real ma'lumot bo'lsa u ham ochiq. `.gitignore` ga qo'shing.

---

## 2. `chatbot` repozitoriysida `venv/` papkasi commit qilingan

Repo hajmi 6.1 MB, sababi shu. Virtual muhitni commit qilish boshlovchi
belgisi hisoblanadi va ish beruvchi/hamkor buni birinchi ko'radi.

```bash
git rm -r --cached venv .idea
printf 'venv/\n.idea/\n__pycache__/\n*.pyc\n' >> .gitignore
git commit -m "Stop tracking venv and IDE files"
git push
```

`.idea/` papkasi `RedoxAI`, `resume`, `chatbot` da ham bor — hammasida
o'chirish kerak.

---

## 3. Profil README yo'q — eng katta yutuq shu

`github.com/shavkatjonai` ga kirgan odam hozir faqat 19 ta repo ro'yxatini
ko'radi, ularning ko'pi kurs mashqlari (`fourth_task`, `Third_task`, `J_N`,
`FN21_darsi`, `Narzikulov`). Kim ekanligingiz haqida bir og'iz so'z yo'q.

`Shavkatjon` nomli repoda "O'zim haqimda qisqacha" degan tavsif bor, lekin u
profilda **ko'rinmaydi** — GitHub profil README'ni faqat **foydalanuvchi nomi
bilan aynan bir xil** nomlangan repodan oladi.

**Nima qilish kerak:**

1. `shavkatjonai` nomli **yangi public repo** yarating (aynan shu nom).
2. Ichiga `README.md` qo'ying — tayyor matn: [`profil-README.md`](profil-README.md)
3. Saytni deploy qilgach README dagi `shavkatjonai.uz` havolasini tekshiring.

Bir vaqtda: profilda **Pin repositories** bosib `stt_interface`, `crm_bot`,
`promo_code`, `promo_code_front` ni tanlang. Shunda kurs mashqlari pastga
tushadi va birinchi ko'ringan narsa portfelingiz bo'ladi.

---

## 4. `stt_interface` README'sida clone havolasi xato

README yaxshi yozilgan, lekin o'rnatish bo'limida:

```
git clone https://github.com/shavkatjon622/stt_interface.git
```

`shavkatjon622` — boshqa foydalanuvchi nomi. Bu buyruqni ko'chirgan odamda
ishlamaydi. To'g'risi:

```
git clone https://github.com/shavkatjonai/stt_interface.git
```

Saytdagi "Kodni ko'rish" tugmasi shu repoga olib boradi, shuning uchun
buni tuzatish arziydi.

---

## 5. `crm_bot` nomlanishi xalqaro auditoriyada yomon o'qiladi

README sarlavhasi: **"SRM Bot — Sex boshqaruv tizimi"**, repoda
`sex_bot_TZ.md` fayli.

O'zbekcha "sex" — ishlab chiqarish sexi (ruscha *цех*). Lekin GitHub
auditoriyasi inglizcha o'qiydi va bu so'z butunlay boshqa ma'no beradi.
CLAUDE.md da "Xalqaro hamjamiyat ko'radi" deb yozgansiz — shuni hisobga olsa,
bu tuzatishga arzigulik.

Taklif:

| Hozir | Taklif |
|---|---|
| `SRM Bot — Sex boshqaruv tizimi` | `CRM Bot — Ishlab chiqarish sexi uchun boshqaruv tizimi` |
| `sex_bot_TZ.md` | `TEXNIK-TOPSHIRIQ.md` |
| README ichidagi "sex egasi" roli | "ishlab chiqarish rahbari" |

"SRM" ham ehtimol "CRM" ning terish xatosi. Saytda bu loyiha
"Ustaxona uchun CRM bot" deb turibdi — shu nomlanish yaxshiroq.

---

## 6. README yo'q repolar

12 ta repoda README yo'q:

`Badiy_tahlil` · `bankomat` · `chatbot` · `FN21_darsi` · `fourth_task` ·
`Full_stack_python` · `J_N` · `library_project` · `Narzikulov` ·
`news_project` · `RedoxAI` · `resume`

Bularning ko'pi kurs mashqlari — har biriga README yozish shart emas va
foyda ham bermaydi. **Ikki yo'l:**

- **Mashq repolari** (`fourth_task`, `Third_task`, `J_N`, `FN21_darsi`,
  `Narzikulov`, `bankomat`, `library_project`, `Badiy_tahlil`,
  `Full_stack_python`) — `private` qilib qo'ying yoki arxivlang. Profil
  tozalanadi, portfel ko'rinadi. Kod o'chmaydi.
- **Portfelga arzigulik ikkitasi** — `RedoxAI` (Django chat ilovasi) va
  `chatbot` — bularga README yozilsa foyda bor. Tayyor shablon:
  [`shablon-README.md`](shablon-README.md). Ichida nima borligini men bilmayman,
  shuning uchun to'qib yozmadim — shablonni to'ldirasiz.

`promo_code_front` da README bor, lekin u **Nuxt'ning tayyor shabloni**
("Nuxt Minimal Starter") — ya'ni loyiha haqida hech nima aytmaydi.
Tayyor almashtiruv: [`promo_code_front-README.md`](promo_code_front-README.md)

---

## Qisqa ro'yxat

- [ ] `resume` — `.env` ni olib tashlash, `SECRET_KEY` ni almashtirish
- [ ] `chatbot` — `venv/` va `.idea/` ni kuzatuvdan chiqarish
- [ ] `resume`, `RedoxAI` — `db.sqlite3` va `.idea/` ni chiqarish
- [ ] `shavkatjonai` repo yaratib profil README qo'yish
- [ ] Profilda 4 ta portfel reponi pin qilish
- [ ] Mashq repolarini private/arxiv qilish
- [ ] `stt_interface` — clone havolasidagi username'ni tuzatish
- [ ] `crm_bot` — nomlanishni o'zgartirish
- [ ] `promo_code_front` — README ni almashtirish
- [ ] `RedoxAI`, `chatbot` — README yozish (shablon bor)
