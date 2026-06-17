# MamaCare Node.js Backend Starter - Phase 44B

This backend is designed for the current MamaCare React web app.

It uses Node.js, Express.js, Prisma ORM, SQLite, JWT authentication, bcrypt password hashing, and CORS.

## Folder setup

```text
D:\mamacare
  ├── mamacare-app        # React frontend
  └── mamacare-backend    # This Node backend
```

## Install

```bash
cd D:\mamacare
mkdir mamacare-backend
cd mamacare-backend
```

Extract/copy this backend starter into `mamacare-backend`.

Then run:

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open:

```text
http://localhost:5000/api/health
```

Expected:

```json
{
  "status": "ok",
  "service": "MamaCare API"
}
```

Your React app is not connected yet. It still uses localStorage. The next phase adds the frontend API service layer.
