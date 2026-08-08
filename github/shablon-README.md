<!-- ============================================================
     README YO'Q REPOLAR UCHUN SHABLON
     Asosan `RedoxAI` va `chatbot` uchun — ularning ichida nima
     borligini bilmayman, shuning uchun to'qib yozmadim.

     Ishlatish: shu faylni nusxalab, [KVADRAT QAVSDAGI] joylarni
     to'ldirasiz va kerak bo'lmagan bo'limlarni o'chirasiz.

     Bilganlarim (API dan):
       RedoxAI — Python/Django, chat_app/ + config/ papkalari,
                 Pipfile, Procfile (Heroku), db.sqlite3
       chatbot — Python, index.html + animasiya.html + python_data.py,
                 venv/ commit qilingan (olib tashlash kerak)
     ============================================================ -->

# [LOYIHA NOMI]

[Bir-ikki jumlada: bu nima qiladi va kim uchun. Texnologiya nomidan emas,
NATIJADAN boshlang. Yomon: "Django asosidagi ilova". Yaxshi: "Foydalanuvchi
savol yozadi, tizim bazadagi ma'lumotdan javob topib beradi."]

## Nima uchun yozilgan

[Qanday muammoni hal qiladi, yoki o'quv loyihasi bo'lsa nimani o'rganish
uchun yozilgan. Ikkinchisi ham normal — halol yozilgani yaxshi.]

## Imkoniyatlar

- [Foydalanuvchi nimani qila oladi]
- [...]
- [...]

## Texnologiyalar

- [Til va versiya, masalan: Python 3.11]
- [Freymvork, masalan: Django 5.0]
- [Baza, masalan: SQLite / PostgreSQL]
- [Qolganlari]

## Ekran surati yoki demo

<!-- Bu bo'lim README ning eng ko'p o'qiladigan joyi. Bitta ekran surati
     matnning hammasidan ko'proq ishonch beradi. Rasmni repoga
     docs/ papkasiga qo'yib shunday ulaysiz: -->

![Ekran surati](docs/screenshot.png)

## O'rnatish

```bash
git clone https://github.com/shavkatjonai/[REPO-NOMI].git
cd [REPO-NOMI]

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

## Muhit o'zgaruvchilari

Ildizda `.env` fayli yarating:

```env
SECRET_KEY=[o'zingiz generatsiya qilasiz]
DEBUG=True
```

> `.env` **hech qachon commit qilinmasin.** `.gitignore` ga qo'shing.
> Agar allaqachon commit qilingan bo'lsa, `SECRET_KEY` ni almashtiring —
> u ochiq hisoblanadi.

## Ishga tushirish

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

`http://localhost:8000` da ochiladi.

## Loyiha tuzilishi

```
[papka]/     [nima uchun javob beradi]
[papka]/     [...]
```

## Cheklovlar

[Halol bo'ling: nima ishlamaydi, nima tugallanmagan. Bu README ni
kuchsizlashtirmaydi — aksincha, yozgan odam o'z kodini tushunadi degan
belgi beradi.]

---

<!-- ============================================================
     HAR BIR REPO UCHUN TEKSHIRISH RO'YXATI

     [ ] .gitignore bor va ichida: .env, venv/, .idea/, __pycache__/,
         *.pyc, db.sqlite3
     [ ] .env, venv/, .idea/, db.sqlite3 kuzatuvdan chiqarilgan:
         git rm -r --cached .env venv .idea db.sqlite3
     [ ] clone havolasidagi username to'g'ri: shavkatjonai
     [ ] requirements.txt yoki Pipfile yangilangan
     [ ] Kamida bitta ekran surati bor
     [ ] Repo tavsifi (description) to'ldirilgan — GitHub'da repo
         nomi yonida chiqadi va qidiruvda ishlatiladi
     ============================================================ -->
