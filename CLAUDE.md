# CLAUDE.md

Guidance for Claude Code (and any AI pair-programming tool) working in this repo.

## Project

Capstone project for FlyRank.ai internship. It connects gadget resellers to gadget dealers both nationwide and internationally. It is for those interested in venturing into gadget business.

## Tech Stack

- **Frontend:** React + Vite, TypeScript
- **Backend:** NestJS (TypeScript)
- **Database / Auth:** Supabase (PostgreSQL)
- **Package manager:** npm
- **(Optional) ML service:** FastAPI + TensorFlow, if added later

## Project Structure

```
frontend/    # React app (Vite)
backend/     # NestJS API
docs/        # Notes, diagrams
```

## Conventions

- **Language:** TypeScript everywhere in frontend/backend — avoid plain `.js` files.
- **Formatting:** Prettier + ESLint defaults; run `npm run lint` before committing.
- **Commits:** Conventional commits style, e.g. `feat: add login flow`, `fix: correct supabase query`.
- **Branches:** `main` is protected; work in feature branches (`feature/<short-name>`), open a PR to merge.
- **Env vars:** Never commit `.env` files. Keep a `.env.example` with placeholder keys up to date whenever a new variable is introduced.
- **API layer:** NestJS controllers stay thin — business logic goes in services.
- **Database access:** All Supabase queries go through a dedicated service/repository layer, not directly in controllers or React components.

## Commands

```bash
# backend
cd backend
npm install
npm run start:dev      # dev server
npm run test           # unit tests
npm run lint

# frontend
cd frontend
npm install
npm run dev             # dev server
npm run build
npm run lint
```

## Notes for Claude Code

- Prefer editing existing files over creating new ones unless a new module/component is genuinely needed.
- When adding a new Supabase table, also note the schema change in `docs/` and add/update relevant TypeScript types.
- Ask before running destructive commands (migrations, `git push --force`, deleting files).
- Keep PR-sized diffs — avoid sprawling, multi-concern changes in a single session unless asked.
