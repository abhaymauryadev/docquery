# Architecture

DocQuery is a Next.js App Router application with workspace-scoped RAG over user-uploaded documents.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, design tokens from `design-system.md`
- **Auth:** Auth.js (credentials + Google/GitHub OAuth), Argon2id password hashing
- **Database:** PostgreSQL + pgvector via Prisma 7
- **Storage:** Supabase Storage (production) or local `./uploads` (development)
- **Embeddings:** Voyage AI `voyage-3` (preferred) or OpenAI `text-embedding-3-small`
- **LLM:** OpenAI `gpt-4o-mini` for answers and follow-up suggestions

## Route groups

| Group | Path | Purpose |
|---|---|---|
| Marketing | `/`, `/features`, `/pricing`, `/docs/*` | Public, indexed |
| Auth | `/login`, `/signup`, `/verify` | Sign-in flows |
| App | `/app/*`, `/workspace/*` | Authenticated product (`noindex`) |
| API | `/api/*` | REST endpoints |

## Data model

Workspaces isolate documents, conversations, and audit logs. `Chunk` records store `charStart`/`charEnd` for sentence-level citation tracing. `Message.citations` is JSON with chunk/doc/page/sentence bounds.

## RAG pipeline

1. **Ingest:** upload → parse (PDF/DOCX/TXT) → sentence-boundary chunking (~500 tokens, ~50 overlap) → embed → pgvector
2. **Query:** embed question → workspace-scoped cosine search (top-8) → LLM with chunk-ID citation prompt → sentence mapping → confidence badge
3. **Confidence:** derived from avg top-3 retrieval similarity (≥0.78 High, 0.60–0.78 Medium, <0.60 Not found)

## Security

- RBAC enforced server-side (`OWNER` / `EDITOR` / `VIEWER`)
- Email verification required before writes
- Rate limits on auth, upload, and query endpoints
- App routes emit `noindex, nofollow`

## Trade-offs

- Concurrent workspace rename: last-write-wins (documented, not solved)
- `EDITOR`/`VIEWER` roles exist in schema; invite UI is post-MVP
