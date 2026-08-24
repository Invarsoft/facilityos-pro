# FacilityOS Pro

Multi-tenant Facility Management OS — service requests, technician dispatch,
assets, preventive maintenance, SLA enforcement, and analytics.

```
facilityos-pro/
├── frontend/     Next.js 15 (React 19, Tailwind, TanStack Query, Zustand)
└── backend/      FastAPI (SQLAlchemy async, Alembic, JWT, pytest)
```

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
copy .env.example .env          # Windows  (cp on macOS/Linux)
python -m scripts.seed          # demo data + users
uvicorn app.main:app --reload   # http://localhost:8000/docs
```

Demo credentials (after seeding):

| Role | Email | Password |
|---|---|---|
| Super admin | superadmin@facilityos.pro | Super@123 |
| Org admin | admin@woxsen.edu | Admin@123 |
| Manager | manager@woxsen.edu | Manager@123 |
| Worker | worker.plumbing@woxsen.edu | Worker@123 |
| Requester | student@woxsen.edu | User@123 |

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local    # points at http://localhost:8000
npm run dev                     # http://localhost:3000
```

Sign-in via **Authorised Email** tab authenticates against the real API.
When the backend is offline the login page falls back to demo mode.

## Architecture

**Backend** (`backend/app`) — layered:

- `api/v1/` routers: auth, tickets, users, organizations, assets (+SLA rules, PM schedules), notifications, audit-logs, analytics
- `services/` business logic: ticket **state machine** (`open → assigned → in_progress → awaiting_verification → closed/reopened/escalated`), SLA engine + periodic breach sweep (auto-escalation), worker skill-matching ("Facos Match"), emergency dispatch, OTP verification gate
- `repositories/` org-scoped data access — cross-tenant reads are structurally impossible
- `core/` JWT access+refresh (rotation + revocation), bcrypt, RBAC dependencies
- `models/` SQLAlchemy 2.0 async; SQLite now, Postgres-ready (swap URL)
- `alembic/` migrations · `tests/` pytest suite (auth, RBAC, lifecycle, tenancy isolation)

**Frontend** (`frontend/src/features/*`) — feature-based:
`auth · tickets · workers · assets · notifications · assistant`, each with
`api.ts` (TanStack Query hooks) and `components/`. Shared primitives live in
`src/shared/`. Route pages under `app/` stay thin; domain logic lives in features.

## Commands

```bash
# backend tests
cd backend && python -m pytest tests -q

# alembic migration after model changes
cd backend && alembic revision --autogenerate -m "msg" && alembic upgrade head

# frontend build
cd frontend && npm run build
```

## Docker

```bash
docker compose up --build
# frontend: :3000  backend: :8000  (Postgres config commented in docker-compose.yml)
```
