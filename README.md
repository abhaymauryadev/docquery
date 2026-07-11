# DocQuery

**Ask your documents, get sentence-level answers.**

Upload PDFs, DOCX, or text files and get answers with exact citations — down to the sentence. No hallucinated guesses.

## Live demo

Set `NEXT_PUBLIC_APP_URL` after deploy and link it here.

## Screenshots

Add product screenshots to `docs/screenshots/` after first deploy.

## Quick start

```bash
git clone <repo-url>
cd docquery
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string with pgvector |
| `AUTH_SECRET` | Yes | NextAuth session secret (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | No | Google OAuth |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | No | GitHub OAuth |
| `OPENAI_API_KEY` | Yes* | LLM + fallback embeddings |
| `VOYAGE_API_KEY` | No | Preferred embedding provider |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase Storage URL |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service key |
| `SUPABASE_STORAGE_BUCKET` | No | Storage bucket (default: `documents`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL for auth callbacks |

\* Required unless only using Voyage for embeddings and another LLM is configured.

## Architecture

See [docs/architecture.md](docs/architecture.md).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest unit tests |
| `npm run db:push` | Push schema to database |

## Roadmap

- Multi-document comparison / cross-referencing queries
- Shared read-only workspace link
- Highlight-to-ask in document viewer
- OCR fallback for scanned PDFs
- Role-based workspace invite UI (EDITOR/VIEWER)

## License

MIT — see [LICENSE](LICENSE).
