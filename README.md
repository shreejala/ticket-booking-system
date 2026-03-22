# Ticket Booking System

A full-stack ticket booking application — React + TypeScript frontend with a containerised Node.js + PostgreSQL backend.

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| shadcn/ui + Tailwind CSS | Component library and styling |
| React Router v6 | Client-side routing |
| TanStack React Query | Server state and caching |
| Axios | HTTP client |
| React Hook Form | Form management |

---

### Backend
| Tool | Purpose |
|---|---|
| Node.js 20 | API runtime |
| PostgreSQL | Primary database |
| pgAdmin 4 | Database management UI |
| Docker + Docker Compose | Container orchestration |

---

## Prerequisites

| Requirement | Version | Verify |
|---|---|---| 
| Node.js for Frontend| 22.x | `node -v` |
| Node.js for Backend| 20.x | `node -v` |

---

## Repository Structure

```
├── backend/                   # Node.js API
│   ├── src/
│   ├── Dockerfile
│   ├── .env
│   └── package.json
│
├── ticket-booking-web-app/                  # React + Vite app
│   ├── src/
│   └── package.json
│
├── db_volume/                 # Auto-created by Docker on first run
│   ├── pg/                    # PostgreSQL data
│   └── pgadmin/               # pgAdmin config
│
├── docker-compose.yml
└── .env                       # Root env vars consumed by docker-compose
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

---

### 2. Set Up Environment Variables

There are **two** env files you need to create.

#### Root `.env` — consumed by `docker-compose.yml`

Create `.env` in the project root (same level as `docker-compose.yml`):

```env
# .env

# PostgreSQL
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# Backend DB connection (DB_HOST must match the service name in docker-compose)
DB_HOST=

# pgAdmin
PGADMIN_EMAIL=
PGADMIN_PASSWORD=
```

> Docker Compose automatically reads `.env` from the project root and injects these values into the containers.

#### Frontend

```
VITE_API_BASE_URL=http://localhost:3000
```

---

### 3. Start the Backend (Docker)

From the project root:

```bash
docker compose up -d
```

This builds and starts three containers:

| Container | Service | Host URL |
|---|---|---|
| `backend` | Node.js API | `http://localhost:3000` |
| `postgres` | PostgreSQL 15 | `localhost:5433` ← mapped from 5432 |
| `pgadmin_1` | pgAdmin 4 | `http://localhost:8080` |

> **Note:** PostgreSQL is exposed on host port **5433** (not the default 5432) as defined in `docker-compose.yml`. Keep this in mind when connecting from tools outside Docker.

**Verify all containers are running:**

```bash
docker compose ps
```

All three should show `running`. If any show `Exit`, check logs immediately:

```bash
docker compose logs <service-name>
# e.g.
docker compose logs backend
docker compose logs postgres
```

---

### 4. Access pgAdmin

Open `http://localhost:8080` in your browser.

**Login:**
```
Email:       ← value of PGADMIN_EMAIL in .env
Password:    ← value of PGADMIN_PASSWORD in .env
```

**Register the PostgreSQL server in pgAdmin:**

1. Right-click **Servers** in the left panel → **Register → Server**
2. **General** tab → Name: `dbName` (any label you prefer)
3. **Connection** tab:

| Field | Value | Note |
|---|---|---|
| Host | `hostname` | Docker service name — not `localhost` |
| Port | `5432` | Internal container port — not `5433` |
| Maintenance database | `dbName` | Value of `POSTGRES_DB` |
| Username | `username` | Value of `POSTGRES_USER` |
| Password | `password` | Value of `POSTGRES_PASSWORD` |

4. Click **Save**

> **Why `postgres` as the host and `5432` as the port?**
> pgAdmin runs inside the Docker network where containers talk to each other using their **service names** and **internal ports**. The `5433:5432` mapping in `docker-compose.yml` only applies when connecting from your host machine — not between containers.

---

### 5. Run migration

```bash
cd backend
npm run migration:run
```

### 6. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 7. Start the Frontend Dev Server

```bash
cd frontend
npm run dev
```

The app is available at `http://localhost:5173`.

---

## Running the Full Stack

```bash
# Terminal 1 — start all backend containers
docker compose up

# Terminal 2 — start frontend dev server
cd frontend && npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| pgAdmin | http://localhost:8080 |
| PostgreSQL (external tools) | localhost:**5433** |

---

## Docker Commands Reference

```bash
# Start all containers in the background
docker compose up -d

# Stop containers (data volumes preserved)
docker compose stop

# Stop and remove containers (data volumes preserved)
docker compose down

# Restart a single service
docker compose restart backend

# Rebuild the backend image after Dockerfile or dependency changes
docker compose up -d --build backend
```

---

## Frontend Scripts

Run from the `frontend/` directory:

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build
```

---