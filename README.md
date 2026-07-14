# Chee Gadgets

> This project is for buying and selling of gadgets and it is for gadget dealers.

## Overview

Chee Gadgets is a marketplace that connects gadget resellers directly with verified dealers, nationwide and internationally. Dealers list stock (new and tokunbo devices) with clear condition ratings and pricing; resellers browse and order without needing an existing dealer network. Built-in dealer verification and transaction history aim to rebuild the trust that's often missing in informal online gadget trading, and lower the barrier for anyone looking to start reselling.

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