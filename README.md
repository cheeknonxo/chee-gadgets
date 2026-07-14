# [Capstone Project Name]

> One-line description of what this project does and who it's for.

## Overview

Brief description of the problem this project solves and the core idea behind it.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** NestJS
- **Database / Auth:** Supabase (PostgreSQL)
- **Other:** _(add as needed — e.g. Groq API, FastAPI/TensorFlow ML service)_

## Project Structure

```
.
├── frontend/       # React app
├── backend/        # NestJS API
├── ml-server/       # (optional) FastAPI/TensorFlow service
└── docs/            # Design notes, diagrams, etc.
```

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn
- Supabase account / project

### Setup

```bash
# clone
git clone <repo-url>
cd <repo-folder>

# install frontend deps
cd frontend && npm install

# install backend deps
cd ../backend && npm install
```

### Environment Variables

Copy `.env.example` to `.env` in each service directory and fill in your Supabase URL/keys and any other secrets.

### Running Locally

```bash
# backend
cd backend && npm run start:dev

# frontend
cd frontend && npm run dev
```

## Status

🚧 In progress — capstone project for FlyRank.ai internship.

## License

MIT — see [LICENSE](./LICENSE).
