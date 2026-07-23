<<<<<<< HEAD
# 🛍️ Ecom-Sentinel-Store

The high-conversion, premium storefront for the Ecom-Sentinel ecosystem. Designed with a focus on speed, aesthetics, and a seamless user shopping journey.

---

## ✨ UI/UX Highlights

* **Sentinel Design System**: Built with **Shadcn/UI** for a consistent and professional aesthetic.
* **Fluid Motion**: Immersive user experience powered by **Framer Motion** animations.
* **Type-Safe Frontend**: Developed in **TypeScript** to eliminate runtime UI errors.
* **Ultra-Responsive**: Mobile-first design using **Tailwind CSS** for all screen sizes.
* **Instant State**: Global cart and user session management with **Redux Toolkit**.

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## 📂 Architecture

- **/components**: Modular UI elements like Hero, Product Grid, and Cart.
- **/hooks**: Custom React hooks for interacting with the Sentinel Backend.
- **/store**: Redux slices for managing local shop state.

---
**Developed by Mirza Usama | Full Stack Engineer**
=======
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
>>>>>>> 354135939b36ea470be415c85dc6fbf28940a399
