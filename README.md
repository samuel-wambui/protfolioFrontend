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
- `GET /portfolio-agent/snapshot`
- `GET /portfolio-agent/facts`
- `GET /portfolio-agent/chunks`
- `GET /portfolio-agent/context`
- `POST /portfolio-agent`
- `POST /portfolio-agent/ask`
- `POST /portfolio-agent/reindex`
- `POST /portfolio-agent/search`
- `GET /openai-credentials`
- `POST /openai-credentials`
- `PATCH /openai-credentials/{id}/activate`
- `PATCH /openai-credentials/{id}/expire`
- `DELETE /openai-credentials/{id}`

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

## n8n Portfolio Agent

The frontend displays the portfolio agent UI and calls the Java backend. The backend forwards visitor questions and knowledge updates to n8n. n8n can then call the Java backend portfolio-agent data endpoints. Because the Java backend is connected to Neon, the n8n workflow does not need a Postgres node or direct Neon credentials.

The backend defaults to these deployed n8n webhooks:

```bash
N8N_PORTFOLIO_AGENT_ASK_WEBHOOK_URL=https://n8n.digitalbank365.com/webhook/portfolio-agent-ask
N8N_PORTFOLIO_AGENT_REINDEX_WEBHOOK_URL=https://n8n.digitalbank365.com/webhook/portfolio-agent-reindex
```

In n8n, read the webhook body fields:

- `question`
- `portfolioId`

Then fetch prompt data from the Java backend. The active local n8n workflow can use the deployed snapshot endpoint:

```text
GET /portfolio-agent/snapshot?portfolioId=PORT001&maxChars=16000
```

After the backend is deployed with the newer context endpoint, the n8n process can set:

```text
PORTFOLIO_AGENT_DATA_URL=https://portfoliobackend-ltak.onrender.com/api/portfolio-agent/context
```

That endpoint returns `facts`, `chunks`, and a ready `context` string for the AI prompt.

For Neon pgvector semantic search, the backend exposes:

```text
POST /portfolio-agent/reindex
POST /portfolio-agent/search
```

Embedding credentials are managed from Admin -> AI Settings. The browser only receives masked keys; the backend uses the active non-expired credential for embeddings.
