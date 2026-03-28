<div align="center">
  <img src="./tenant/public/logo.svg" alt="Dwellio Logo" height="60" />
  <h1>Dwellio</h1>
  <p><strong>Full-stack rental management platform with dual portals for tenants and property owners</strong></p>

  <p>
    <a href="https://dwellio-five.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Tenant%20Portal-Live-brightgreen?style=for-the-badge&logo=vercel" />
    </a>
    <a href="https://dwellio-owner-dashboard.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Owner%20Dashboard-Live-blue?style=for-the-badge&logo=vercel" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-Raw%20SQL-4169E1?style=flat-square&logo=postgresql" />
    <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/Redis-Cache%20%2B%20OTP-DC382D?style=flat-square&logo=redis" />
    <img src="https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?style=flat-square&logo=cloudinary" />
  </p>
</div>

---

## Overview

Dwellio is a production-grade rental management system built with the PERN stack. It features two separate frontends — a tenant portal for browsing and renting properties, and an owner dashboard for managing listings, agreements and payments.

The system handles complex real-world flows including atomic payment processing with refund safety, idempotency-protected transactions, role-based access, and cron-driven automation. Email queueing via Redis is part of the intended architecture but is not enabled in this release.

---

## Architecture

```
dwellio/
├── backend/          # Express.js REST API
├── tenant/           # Vite + React — Tenant portal
├── owner/            # Vite + React — Owner dashboard
└── docker-compose.yaml
```

### Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Backend     | Node.js, Express.js                          |
| Database    | PostgreSQL (raw SQL, no ORM)                 |
| Frontend    | React 18, Vite, Redux Toolkit                |
| Styling     | Tailwind CSS v4, shadcn/ui, Motion           |
| Auth        | JWT (access + refresh tokens in cookies)     |
| Cache / OTP | Redis                                        |
| Media       | Cloudinary                                   |
| Email       | Nodemailer (Redis queue planned, not active) |
| Payments    | Simulated gateway with refund logic          |
| Scheduling  | node-cron                                    |

---

## Key Features

### Backend

* **No ORM** — raw SQL with a clean model abstraction layer
* **Atomic transactions** — all critical flows wrapped in `BEGIN / COMMIT / ROLLBACK`
* **Idempotency** — payment and renewal endpoints are idempotency-key protected
* **Refund safety** — if DB fails after gateway success, refund triggers automatically
* **Row-level locking** — `FOR UPDATE` on property rows prevents race conditions during booking
* **Redis OTP** — short-lived OTPs with automatic expiry for password reset
* **Cron jobs** — monthly payment generation, overdue reminders, expired rental termination
* **Role-based access** — `tenant` and `owner` roles with middleware protection

### Rental Flow

```
Tenant books property
  → Security deposit payment (atomic)
  → Gateway processes payment
  → On success: rental activated + property availability updated
  → On failure: rental stays pending, retry available
  → Monthly payment record auto-created for current month
  → Cron generates monthly records on 1st of each month
  → Owner can schedule termination with notice period
  → Cron auto-terminates on effective date
  → Tenant can renew terminated rentals
```

### Frontend

* **Dual portal** — separate Vite apps for tenant and owner
* **Redux Toolkit** — slices, async thunks, optimistic updates
* **Skeleton loading** — modular skeleton components for every page
* **Confirm modal** — all destructive actions require confirmation
* **Design system** — custom Tailwind tokens (brown/beige palette), Montserrat font, shadcn/ui overrides

---

## API Overview

| Module     | Endpoints                                             |
| ---------- | ----------------------------------------------------- |
| Auth       | Register, Login, Logout, Refresh, OTP, Reset Password |
| Users      | Get me, Update profile, Update image, Delete account  |
| Properties | CRUD, Filter by city/price, Owner listings            |
| Rentals    | Create, Cancel, Terminate, Renew, Get by tenant/owner |
| Payments   | Create, Get by tenant/owner/agreement, Delete failed  |

---

## Local Setup

> The backend is already deployed on a VPS and running in production. Local setup is only required if you want to run or modify the project locally.

### Prerequisites

* Node.js 18+
* PostgreSQL 14+
* Redis

### Backend

```bash
cd backend
npm install
touch .env   # fill in your values
npm run dev
```

**.env required keys:**

```env
PORT=8000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173,https://dwellio-five.vercel.app,https://dwellio-owner-dashboard.vercel.app

# PostgreSQL
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=house_rent
POSTGRES_PORT=5432
HOST=postgres

DATABASE_URL=postgresql://user:password@postgres:5432/house_rent
TEST_DATABASE_URL=postgresql://user:password@postgres:5432/house_rent_test

# JWT
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=20d

# Password Reset
RESET_TOKEN_SECRET=your_reset_secret
RESET_TOKEN_EXPIRY=5m

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
SENDER_EMAIL=your_email@gmail.com
APP_PASSWORD=your_app_password

# Redis (used for OTP; mail queue planned for future)
REDIS_URL=redis://redis:6379
```

### Tenant Frontend

```bash
cd tenant
npm install
# API base URL is currently hardcoded in the frontend
npm run dev
```

### Owner Frontend

```bash
cd owner
npm install
# API base URL is currently hardcoded in the frontend
npm run dev
```

### Docker (PostgreSQL + Redis only)

```bash
docker-compose up -d --build
```

---

> Notes:
> - PostgreSQL, Redis, Backend, and pgAdmin are all containerized and connected via a shared Docker network.
> - The backend uses the internal Docker hostname `postgres` (not localhost) as defined in `DATABASE_URL`.
> - pgAdmin is available at http://localhost:5050
>   - Email: admin@dwellio.com
>   - Password: admin123
> - Make sure your `.env` has `HOST=postgres` when running via Docker.
> - 
## Design Decisions Worth Noting

**Why no ORM?**
Raw SQL gives full control over query optimization, locking strategies (`FOR UPDATE`), and complex joins. ORMs abstract away exactly the things that matter in a transactional system.

**Why two separate frontends?**
Clean separation of concerns — the owner dashboard has completely different UX patterns, navigation, and data requirements from the tenant portal. Sharing a codebase would create unnecessary coupling.

**Why Redis for mail (future)?**
Email delivery can take 1–3 seconds. Queuing via Redis `brPop` allows the API response to return immediately while emails are processed in a background worker. This pattern is planned for future releases.

**Why idempotency keys on payments?**
Network retries can cause duplicate charges. The frontend generates a UUID per payment attempt and the backend deduplicates via `ON CONFLICT` — same pattern used by Stripe.

---

## Project Structure (Backend)

```
backend/src/
├── config/          # DB, Redis, Cloudinary
├── controllers/     # Thin controllers (req/res only)
├── middlewares/     # Auth, rate limiter, error handler, multer
├── models/          # Raw SQL query functions
├── routes/          # Express routers
├── services/        # Business logic layer
├── templates/       # HTML email templates
└── utils/           # ApiError, ApiResponse, asyncHandler, tokens
```

---

## Live Demo

| Portal | URL                                                                                      | Credentials            |
| ------ | ---------------------------------------------------------------------------------------- | ---------------------- |
| Tenant | [https://dwellio-five.vercel.app](https://dwellio-five.vercel.app)                       | Register a new account |
| Owner  | [https://dwellio-owner-dashboard.vercel.app](https://dwellio-owner-dashboard.vercel.app) | Register a new account |

> Note: Backend is deployed on a VPS. All core flows are functional in production.

---

## Author

**Dipanjan Das**
Built as a full-stack portfolio project demonstrating production-grade patterns in a PERN stack application.
