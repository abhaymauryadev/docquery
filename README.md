# DocQuery

> Ask your documents, get sentence-level answers with exact citations — no hallucinated guesses.

![Hero screenshot](docs/screenshots/hero.png)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  **Live demo →** set `NEXT_PUBLIC_APP_URL` after deploy and link it here.

## Features
- Upload PDFs, DOCX, and text files into a workspace
- Answers cite the exact source sentence, not just the document
- Background processing pipeline with live status polling
- Chat over one or many documents per workspace
- Email/password auth plus Google and GitHub OAuth, with email verification
- Role-based workspace access (owner / editor / viewer)
- Pluggable embeddings and chat models (Gemini, OpenAI, or Voyage)

## Tech Stack
Next.js · TypeScript · PostgreSQL + pgvector (Prisma) · Tailwind · Auth.js (NextAuth) · Gemini / OpenAI

## Quick Start
```bash
git clone <repo-url> && cd docquery
cp .env.example .env      # then fill in values
npm install
npx prisma db push
npm run dev                # http://localhost:3000
```

## Environment Variables
| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string with pgvector |
| `AUTH_SECRET` | Yes | NextAuth session secret (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | No | Google OAuth |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | No | GitHub OAuth |
| `GEMINI_API_KEY` | Yes* | Gemini chat and embeddings |
| `GEMINI_CHAT_MODEL` | No | Gemini chat model (default: `gemini-3.5-flash`) |
| `OPENAI_API_KEY` | Yes* | OpenAI chat and fallback embeddings |
| `VOYAGE_API_KEY` | No | Preferred embedding provider |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase Storage URL |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service key |
| `SUPABASE_STORAGE_BUCKET` | No | Storage bucket (default: `documents`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL for auth callbacks |
| `RESEND_API_KEY` | No | Sends signup verification emails; without it, the link is logged to the server console |
| `EMAIL_FROM` | No | Verification email sender (default: `DocQuery <onboarding@resend.dev>`) |

\* Configure either Gemini or OpenAI for chat. Gemini, Voyage, or OpenAI can provide embeddings.

## Architecture
Uploaded files are parsed, chunked, and embedded into pgvector; chat queries retrieve the nearest chunks and cite the matching sentence back to the user. See [docs/architecture.md](docs/architecture.md) for the full diagram.

## Testing
```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # Vitest unit tests
```

## Roadmap
- [ ] Multi-document comparison / cross-referencing queries
- [ ] Shared read-only workspace link
- [ ] Highlight-to-ask in document viewer
- [ ] OCR fallback for scanned PDFs
- [ ] Role-based workspace invite UI (EDITOR/VIEWER)

## Screenshots
Add product screenshots to `docs/screenshots/` covering upload, chat, and citation views.

## License
MIT — see [LICENSE](LICENSE).
