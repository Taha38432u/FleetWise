# FleetWise Frontend

Next.js App Router client for **FleetWise** — a multi-role fleet operations platform (dispatch, drivers, mechanics, maintenance, fuel, costs, reports, and billing).

Companion API: [FleetWise-Backend](https://github.com/Taha38432u/FleetWise-Backend)

---

## What this app does

FleetWise replaces spreadsheet / WhatsApp fleet ops with role workspaces:

| Role | What you do in the UI |
|------|------------------------|
| **Admin** | Vehicles, drivers, staff, maintenance, routes, fuel, finance, reports, billing |
| **Dispatcher** | Routes, live tracking, drivers, vehicles, maintenance queue |
| **Driver** | Attendance, assigned routes, GPS streaming |
| **Mechanic** | Workshop backlog — start / complete jobs, log cost |
| **Super Admin** | SaaS owner console (`/owner`) |

Public landing + **read-only demo accounts** (`@demo.com`) let visitors browse without writing data.

---

## Architecture

```
Browser (Next.js)
  ├── App Router pages (public + protected)
  ├── AuthProvider (JWT in localStorage, refresh via API)
  ├── TanStack Query hooks → api/* clients → NestJS /api
  ├── Role menu + path guards (lib/access.ts)
  ├── Leaflet maps (routes / live tracking)
  └── Mantine + Tailwind design system
```

### Folder map

| Path | Role |
|------|------|
| `app/` | Routes: `/`, `/login`, `/signup`, `(protected)/*` |
| `components/` | Feature UIs (vehicles, routes, mechanic, finance, …) |
| `api/` | HTTP wrappers (`makeApiCall`) |
| `hooks/` | React Query hooks |
| `lib/access.ts` | RBAC menus + plan feature gates |
| `lib/demoAccounts.ts` | Public demo credentials (read-only) |

### Auth & tenancy (frontend)

1. Login / register against backend  
2. Store `accessToken` + `refreshToken`  
3. Protected layout redirects unauthenticated users  
4. `canAccessPath(role, pathname)` filters sidebar + soft-blocks routes  
5. Plan features can lock `/live-tracking` and `/reports`  

Demo emails ending in `@demo.com` disable write buttons in UI (`useDemoReadOnly`); the API also returns **403** on mutating methods.

---

## Stack

- **Next.js 16** (App Router) · **React 19**  
- **Mantine 8** · **Tailwind CSS 4** · **Outfit** font  
- **TanStack Query / Table** · **Formik + Yup**  
- **Leaflet** · **Socket.IO client** (live tracking)  
- **Axios** via shared `api/api.ts`

---

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend base including `/api` (e.g. `http://localhost:5000/api`) |

Backend must be running (default `http://localhost:5000`).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright |

---

## Demo accounts (read-only)

Requires backend seed (`npm run prisma:seed` in FleetWise-Backend).

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `DemoRead1!` |
| Driver | `driver@demo.com` | `DemoRead1!` |
| Mechanic | `mechanic@demo.com` | `DemoRead1!` |

Writes are blocked in UI and API. Signup cannot use `@demo.com`.

---

## Main screens

| Route | Users |
|-------|--------|
| `/` | Public landing |
| `/login`, `/signup` | Auth |
| `/dashboard` | Role command center |
| `/vehicles`, `/drivers`, `/staff` | Ops |
| `/routes`, `/my-routes`, `/live-tracking` | Dispatch / driver |
| `/maintenance`, `/mechanics` | Workshop |
| `/fuel`, `/finance`, `/reports` | Cost & analytics |
| `/billing`, `/settings` | Plan & profile |
| `/owner` | Super admin |

---

## Related

- API + Prisma schema + Swagger: [FleetWise-Backend](https://github.com/Taha38432u/FleetWise-Backend)  
- Swagger (local): `http://localhost:5000/api/docs`
