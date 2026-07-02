# MediPulse

## Overview
**MediPulse** is a web application that helps users manage medicines and upcoming reminders, with a dashboard and lightweight analytics.  
It consists of:
- a **FastAPI backend** providing authentication, CRUD APIs for medicines/reminders, and dashboard/analytics/statistics endpoints
- a **React frontend** that renders an authenticated app shell, dashboard, and management pages, including **browser desktop notifications** for near-term reminders.

---

## Key Features
- **Authentication (JWT-based)**
  - Login, registration, and authenticated profile management.
  - Frontend stores and sends tokens via an Axios `Authorization: Bearer <token>` header.
- **Medicine management**
  - Create, update, list, and delete medicines.
  - Supports scheduling metadata (frequency, start/end dates, reminder time, category/status, notes).
  - Frontend search and filtering by name/category/status.
- **Reminder management**
  - Create, update, list, and delete reminders linked to medicines.
  - Reminder scheduling supports **daily/weekly/monthly** schedule types.
  - Reminder status fields such as pending/sent/dismissed and completion support.
- **Dashboard + Analytics**
  - Dashboard loads aggregated metrics (e.g., today’s medicines, upcoming reminders).
  - Analytics includes chart-ready datasets for weekly and monthly summaries.
- **Desktop notifications**
  - A React hook (`useNotifications`) requests permission and polls for reminders scheduled in the **next 5 minutes**.
  - Sends notifications once per reminder (tracked in-memory to avoid repeats).
- **Operational health checks**
  - Backend exposes simple readiness endpoints (`/` and `/health`).

---

## Tech Stack

### Backend (Python / FastAPI)
- **FastAPI** (web/API framework)
- **Uvicorn** (ASGI server)
- **Pydantic + pydantic-settings** (validation and configuration)
- **SQLAlchemy** (ORM)
- **psycopg2-binary** (PostgreSQL connectivity)
- **python-jose[cryptography]** (JWT handling)
- **passlib[bcrypt] + bcrypt** (password hashing)
- **python-multipart** (multipart/form-data support)
- **email-validator** (email validation)

### Frontend (React / TypeScript)
- **React** + **React Router**
- **Vite** (dev/build tooling)
- **Axios** (HTTP client)
- **framer-motion** (UI/animations)
- **lucide-react** (icons)
- **clsx** (class name utilities)
- **date-fns** (date formatting)
- **Tailwind CSS** + PostCSS + Autoprefixer

---

## Project Architecture

### Backend structure (high-level)
- **Entrypoint:** `backend/app/main.py`
  - Initializes the FastAPI application with a configurable title.
  - Creates database tables on startup via `Base.metadata.create_all`.
  - Configures **CORS** using allowed origins from settings.
  - Registers the main API router (`api_router`).
  - Provides:
    - `GET /` — running-status message
    - `GET /health` — health-check response (`ok`)

- **Data/API contracts (frontend-facing)**
  - The frontend expects API endpoints grouped by services:
    - auth: register/login/profile/update profile
    - medicines: list/create/update/remove
    - reminders: list/create/update/remove
    - analytics: dashboard/analytics/statistics

### Frontend structure (high-level)
- **HTTP + API layer:** `frontend/src/services/api.ts`
  - Creates a shared **Axios instance** with:
    - `baseURL = VITE_API_URL` (fallback: `http://127.0.0.1:8000/api`)
    - JSON requests
  - Provides helpers:
    - `setAuthToken(token)` to set/remove the Authorization header
  - Exports service groups:
    - `authService`, `medicineService`, `reminderService`, `analyticsService`

- **Domain typing:** `frontend/src/lib/types.ts`
  - Provides TypeScript interfaces for:
    - `User`
    - `AuthResponse` (tokens + authenticated user)
    - `Medicine`
    - `Reminder`
    - `DashboardData`
    - `AnalyticsData`
    - `StatisticsData`

- **Utilities:** `frontend/src/lib/utils.ts`
  - `formatDateTime(value)` and `formatDate(value)` for localized display
  - `classNames(...)` helper for conditional CSS classes

- **Authenticated app shell:** `frontend/src/components/AppLayout.tsx`
  - Sidebar navigation (Dashboard, Medicines, Reminders, Profile)
  - Uses `useAuth` for user display
  - Provides logout action
  - Uses React Router `<Outlet />` for page rendering

- **Key pages**
  - `LoginPage.tsx`
    - Collects email/password and calls `login(...)`
    - Redirects to `/app/dashboard` on success
  - `DashboardPage.tsx`
    - Fetches dashboard metrics, analytics, statistics, and reminder lists
    - Shows loading placeholder until data is ready
    - Triggers `useNotifications` using fetched reminders + user notification setting
    - Displays stat cards, chart components, missed reminders/streak/totals, plus today’s medicines and upcoming reminders (next 24 hours)
  - `MedicinesPage.tsx`
    - Loads medicines on mount via `medicineService.list()`
    - Provides search + status/category filtering
    - Uses `MedicineForm` for create/edit
    - Updates/deletes via `medicineService.update/remove` and refreshes list

- **Reminder notifications hook:** `frontend/src/hooks/useNotifications.ts`
  - If enabled:
    - requests Notification permission if needed
    - starts a 1-minute interval
    - scans reminders scheduled within the next 5 minutes
    - sends notifications (“Medicine Reminder”) once per reminder id (tracked in `shownRef`)

- **Form components**
  - `MedicineForm.tsx`
    - Create/edit medicine details
    - Converts empty `end_date`/`notes` to `null` on submit
    - Calls `onSubmit(payload)`
  - `ReminderForm.tsx`
    - Create/edit reminders for a chosen medicine
    - Converts `datetime-local` to ISO timestamp on submit
    - Handles create-mode reset behavior after successful creation

---

## Installation / Usage (Placeholders)

### Prerequisites
- **Backend**
  - Python 3.x
  - PostgreSQL (or compatible setup for `psycopg2-binary`)
- **Frontend**
  - Node.js (with npm/yarn/pnpm)

### Local Development
1. **Backend**
   - Create/activate a virtual environment.
   - Install dependencies from `backend/requirements.txt`.
   - Configure environment variables required by the backend (CORS allowed origins, DB URL, JWT settings, etc.).
   - Start the FastAPI server (entrypoint: `backend/app/main.py`).

2. **Frontend**
   - Install dependencies from `frontend/package.json`.
   - Configure `VITE_API_URL` (default is `http://127.0.0.1:8000/api`).
   - Run the dev server using the `dev` script.

### Production Build
- **Frontend**
  - Build the TypeScript + bundle via the `build` script.
  - Preview the production build via `preview`.

> Note: Exact run commands and required environment variables are not specified in the provided repository summaries. If you share your `.env.example` (or equivalent) and the backend/frontend directory layout, I can replace the placeholders with precise commands.

---
*This README was generated with [PresentMe](https://www.presentmeapp.xyz/). View the full presentation [here](https://www.presentmeapp.xyz/p/a80843ee-b76f-412f-81b1-fbb0ea545f45).*
