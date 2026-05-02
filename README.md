# Online napló alkalmazás

Ez a projekt egy egyszerű webalkalmazás, amelyben a felhasználók privát jegyzeteket hozhatnak létre, listázhatnak és szerkeszthetnek.

Az alkalmazás célja egy könnyen használható online napló biztosítása, ahol a jegyzetek relációs adatbázisban kerülnek tárolásra.

## Fő funkciók

- Jegyzetek létrehozása
- Jegyzetek listázása
- Jegyzetek szerkesztése
- Bemeneti adatok validálása
- Reszponzív kliensoldali felület
- REST API alapú kommunikáció frontend és backend között

## Alkalmazott technológiák

### Backend

- Node.js
- Express.js
- Prisma ORM
- SQLite adatbázis

### Frontend

- HTML
- CSS
- JavaScript

### Tesztelés

- Jest
- Supertest

### Konténerizáció

- Docker
- Docker Compose

## Projekt felépítése

```text
.
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   ├── src
│   │   ├── db.js
│   │   └── server.js
│   ├── tests
│   │   └── notes.test.js
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── database
│   └── init.sql
├── frontend
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Backend felépítése

A backend egy Express.js alapú REST API.  
Az adatbázis-kapcsolatot a Prisma ORM kezeli, amely SQLite adatbázist használ.

A fő backend fájlok:

- `backend/src/server.js` - Express szerver és API végpontok
- `backend/src/db.js` - Prisma kliens inicializálása
- `backend/prisma/schema.prisma` - adatmodell leírása
- `backend/prisma/migrations` - Prisma adatbázis migrációk
- `backend/tests/notes.test.js` - automatikus API tesztek

## Adatbázis felépítése

Az alkalmazás egy `Note` nevű adattáblát használ.

A jegyzet mezői:

| Mező | Típus | Leírás |
|---|---|---|
| id | Integer | Egyedi azonosító |
| title | String | Jegyzet címe |
| content | String | Jegyzet tartalma |
| createdAt | DateTime | Létrehozás időpontja |
| updatedAt | DateTime | Utolsó módosítás időpontja |

A Prisma modell:

```prisma
model Note {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

A `database/init.sql` fájl tartalmazza az adatbázis SQL alapú inicializáló scriptjét is.

## Telepítés lokális futtatáshoz

### 1. Repository klónozása

```bash
git clone <repository-url>
cd <repository-mappa>
```

### 2. Backend függőségek telepítése

```bash
cd backend
npm install
```

### 3. Környezeti változók beállítása

A backend mappában található `.env.example` fájl alapján létre kell hozni a `.env` fájlt:

```bash
cp .env.example .env
```

A `.env` tartalma:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Adatbázis létrehozása Prisma migrációval

```bash
npx prisma migrate dev
```

### 5. Backend indítása

```bash
npm run dev
```

A backend alapértelmezetten ezen a címen fut:

```text
http://localhost:3000
```

## Frontend futtatása lokálisan

Egy másik terminálban, a projekt gyökeréből:

```bash
cd frontend
python3 -m http.server 5500
```

Ezután a frontend itt érhető el:

```text
http://localhost:5500
```

## Dockeres futtatás

A projekt Docker Compose segítségével is futtatható.

A projekt gyökerében:

```bash
docker compose up --build
```

Ez elindítja:

- a backend konténert a `3000` porton
- a frontend konténert az `5500` porton

Elérési címek:

```text
Frontend: http://localhost:5500
Backend:  http://localhost:3000
```

Leállítás:

```bash
docker compose down
```

## API végpontok

### Health check

```http
GET /api/health
```

Ellenőrzi, hogy a backend működik-e.

Példa válasz:

```json
{
  "status": "ok"
}
```

### Jegyzetek listázása

```http
GET /api/notes
```

Visszaadja az összes jegyzetet módosítási idő szerint rendezve.

Példa válasz:

```json
[
  {
    "id": 1,
    "title": "Első jegyzet",
    "content": "Ez egy teszt jegyzet.",
    "createdAt": "2026-05-02T12:56:09.509Z",
    "updatedAt": "2026-05-02T12:56:09.509Z"
  }
]
```

### Új jegyzet létrehozása

```http
POST /api/notes
```

Kötelező mezők:

| Mező | Típus | Leírás |
|---|---|---|
| title | string | A jegyzet címe |
| content | string | A jegyzet tartalma |

Példa kérés:

```json
{
  "title": "Új jegyzet",
  "content": "Ez az új jegyzet tartalma."
}
```

Sikeres válasz esetén a státuszkód:

```text
201 Created
```

Példa válasz:

```json
{
  "id": 1,
  "title": "Új jegyzet",
  "content": "Ez az új jegyzet tartalma.",
  "createdAt": "2026-05-02T12:56:09.509Z",
  "updatedAt": "2026-05-02T12:56:09.509Z"
}
```

Hibás kérés esetén:

```json
{
  "error": "A cím és a tartalom megadása kötelező."
}
```

### Jegyzet szerkesztése

```http
PUT /api/notes/:id
```

A megadott azonosítójú jegyzetet módosítja.

Útvonal paraméter:

| Paraméter | Leírás |
|---|---|
| id | A módosítandó jegyzet azonosítója |

Példa kérés:

```json
{
  "title": "Módosított jegyzet",
  "content": "Ez már a módosított jegyzet tartalma."
}
```

Példa válasz:

```json
{
  "id": 1,
  "title": "Módosított jegyzet",
  "content": "Ez már a módosított jegyzet tartalma.",
  "createdAt": "2026-05-02T12:56:09.509Z",
  "updatedAt": "2026-05-02T12:58:10.105Z"
}
```

Lehetséges hibák:

```json
{
  "error": "Érvénytelen jegyzet azonosító."
}
```

```json
{
  "error": "A megadott jegyzet nem található."
}
```

## Tesztek futtatása

A backend mappában:

```bash
cd backend
npm test
```

A projektben 2 API validációs teszt található:

- `POST /api/notes` hibát ad üres cím és tartalom esetén
- `PUT /api/notes/:id` hibát ad érvénytelen azonosító esetén

Sikeres tesztfutás esetén:

```text
Test Suites: 1 passed
Tests: 2 passed
```

## Választott opcionális kiegészítő funkciók

A projektben az alábbi opcionális elemek kerültek megvalósításra:

### 1. Konténerizáció

Az alkalmazás Dockerrel és Docker Compose-zal futtatható.  
A backend és a frontend külön konténerben indul el.

### 2. ORM használata

Az alkalmazás Prisma ORM-et használ az SQLite adatbázis kezelésére.  
A Prisma végzi az adatmodell kezelését, a migrációkat és az adatbázis-műveleteket.

## Verziókezelés

A projekt Git verziókezelést használ.  
A fejlesztés több, jól elkülönített commitban készült, például:

- projektstruktúra létrehozása
- Express backend alap létrehozása
- Prisma SQLite adatmodell hozzáadása
- API végpontok megvalósítása
- frontend elkészítése
- tesztek hozzáadása
- Docker beállítás
- dokumentáció elkészítése

## Összegzés

Az alkalmazás egy egyszerű online napló, amely teljesíti a megadott alapkövetelményeket:

- rendelkezik több REST API végponttal
- relációs adatbázist használ
- reszponzív kliensoldali felülettel rendelkezik
- automatizált teszteket tartalmaz
- Git verziókezelést használ
- Markdown dokumentációval rendelkezik
- Dockerrel konténerizálható
- ORM-et használ az adatbázis kezelésére
