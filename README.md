<div align="center">

# Amara Hotel & Residences

**A full-stack hotel booking & management platform**
Karen, Nairobi · Next.js · TypeScript · PostgreSQL · M-Pesa

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](./LICENSE)

</div>

---

Booking engine, guest dashboard, and staff console for a five-star Nairobi hotel — built to
feel like a real commercial product, not a demo. M-Pesa STK Push and card payments ship with a
realistic mock mode so the entire flow works out of the box.

## Features

- **Booking** — live availability search, promo codes, transaction-safe double-booking prevention
- **Payments** — M-Pesa STK Push (Daraja) and card checkout, both mock-first for zero-config testing
- **Guest area** — bookings, payment history, wishlist, notifications, reviews
- **Staff console** — rooms, bookings lifecycle, staff & departments, housekeeping, restaurant orders, review moderation, revenue reports
- **Auth** — JWT sessions, bcrypt hashing, role-based access control (guest → receptionist → manager → administrator)
- **Media** — Cloudinary-backed gallery and per-room photo uploads

## Stack

| | |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Next.js Route Handlers, Prisma ORM, PostgreSQL |
| Auth | JWT (httpOnly cookie) + bcrypt + RBAC |
| Payments | M-Pesa Daraja, card (mock-first, pluggable) |
| Media | Cloudinary |
| Charts | Recharts |

## Getting started

```bash
npm install
cp .env.example .env      # set DATABASE_URL, JWT_SECRET, etc.
npm run db:migrate
npm run db:seed
npm run dev
```

Visit `localhost:3000`. Staff console at `/admin`, guest account at `/dashboard`.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@amarahotel.co.ke` | `Password123!` |
| Manager | `manager@amarahotel.co.ke` | `Password123!` |
| Housekeeping | `housekeeping@amarahotel.co.ke` | `Password123!` |
| Guest | `guest@example.com` | `Password123!` |

## Project structure

```
app/
├── (marketing)         landing page, search, room detail, checkout
├── dashboard/           guest area — bookings, payments, wishlist, profile
├── admin/               staff console — rooms, bookings, staff, housekeeping, reports
└── api/                 route handlers for everything above
components/              ui primitives, layout, booking, dashboard, admin
lib/                     auth, validation, availability, payments, cloudinary
prisma/                  schema.prisma + seed.ts
```

## Payments & media

M-Pesa and card payments run in **mock mode** by default — no Safaricom or processor
credentials required to test the full booking → payment → confirmation flow. Add real
credentials to `.env` to go live; see `lib/payments.ts` for the integration points.

Image uploads go through a signed Cloudinary pipeline — add your Cloudinary keys to `.env` to
enable them for the gallery (`/admin/gallery`) and room photos (`/admin/rooms`).

## License

MIT
