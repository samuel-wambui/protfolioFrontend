# Samuel Portfolio Frontend

Next.js, React, TypeScript, and Tailwind CSS portfolio frontend.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend API

The frontend reads portfolio content from the Spring Boot API:

```bash
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_API_BASE_URL=https://portfoliobackend-ltak.onrender.com/api
```

Expected endpoints:

- `GET /projects`
- `GET /projects/{slug}`
- `GET /skills`
- `GET /experience`
- `GET /education`
- `GET /certifications`
- `GET /blog`
- `GET /blog/{slug}`
- `POST /contact`

Responses use this shape:

```ts
type ApiResponse<T> = {
  message: string;
  code: string;
  data: T;
  timestamp?: string;
};
```

Portfolio records are database-owned. Seed SQL lives in the backend project at:

```text
/home/samuel/NgarisamuelDev/portfolioBackend/database
```
