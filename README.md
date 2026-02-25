# Appointment Booking System

A full-stack application where an Admin publishes availability slots and Customers book or cancel them. Built with real-world concurrency safety and premium UI handling.

## Tech Stack
- **Backend**: Node.js, Express, Prisma, SQLite
- **Frontend**: React (Vite), Vanilla CSS, Tailwind, Lucide Icons
- **Auth**: JWT-based Authentication
- **Testing**: Jest, Supertest

## Key Design Decisions

### 1. Concurrency & Double Booking Prevention
We use **Prisma transactions** with an atomic update strategy. When a booking request comes in, we check the slot status within a database transaction. If the status is not `AVAILABLE`, the transaction fails, preventing two users from booking the same slot simultaneously. 
**Clean response**: Returns `409 Conflict` if the slot is already taken.

### 2. Slot Overlap Rules
Admin slot creation includes a backend check for temporal overlaps. A new slot is rejected if any existing (non-cancelled) slot for that admin exists such that:
`start_time < new_end` AND `end_time > new_start`. 
Boundary rules: `[start, end)` behavior is enforced.

### 3. State Machine & Cancellation
- **AVAILABLE** -> **BOOKED** (Successful booking)
- **BOOKED** -> **AVAILABLE** (Customer cancels their booking)
- **ANY** -> **CANCELLED** (Admin cancels the slot; associations are also marked cancelled)
We use status fields and timestamps (`cancelled_at`) rather than deleting rows to maintain audit trails.

### 4. URL-Synced Filters
The Customer Slots Listing page uses `URLSearchParams` to sync the date, time window, and sorting state. This allows for shareable links and a stable UX on browser refreshes.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. `cp .env.example .env`
4. `npx prisma migrate dev --name init`
5. `npm run dev` (Starts on port 3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Starts on port 5173)

### Seed Data
Run `ts-node src/seed.ts` inside `backend` to create an initial admin and customer.
- **Admin**: `admin@example.com` / `password123`
- **Customer**: `customer@example.com` / `password123`

## API Documentation

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Open | Create new account |
| POST | `/api/auth/login` | Open | Authenticate and get JWT |
| GET | `/api/slots` | Open | List available/all slots |
| POST | `/api/slots` | Admin | Create availability slot |
| PATCH | `/api/slots/:id/cancel`| Admin | Cancel a slot |
| POST | `/api/bookings` | Cust | Book a slot |
| GET | `/api/bookings/me` | Cust | View own bookings |
| PATCH | `/api/bookings/:id/cancel`| Cust | Cancel own booking |

## Testing
Run `npm test` inside `backend` to execute integration tests covering booking success, concurrency conflicts, and authorization.
