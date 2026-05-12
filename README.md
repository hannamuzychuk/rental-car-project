# RentalCar — frontend (GoIT)

Frontend for **RentalCar**, a car rental company web app. Built with **Next.js (App Router)** and **TypeScript**, following the FS homework specification.

## Features

- **`/`** — Home page with a hero section and a call-to-action to open the catalog (e.g. “View Catalog”).
- **`/catalog`** — Car list from **GET** [`car-rental-api.goit.global`](https://car-rental-api.goit.global), **server-side filters** (brand, price, mileage from/to), **“Load more”** pagination via **`useInfiniteQuery`** (TanStack Query), cards with **“Read more”** opening the detail page in a **new browser tab**.
- **`/catalog/[carId]`** — Car details (**GET /cars/{id}**), photo, description, rental conditions, **rental booking form**.

## API and rental form

- **List, details, brands** — GoIT public API: `https://car-rental-api.goit.global` (e.g. `GET /cars`, `GET /cars/{id}`, `GET /brands`). Override the base URL with **`NEXT_PUBLIC_API_URL`** if needed.
- **Rental form** — submits **`POST /api/rental`** to the same Next.js app (**Route Handler** in `app/api/rental/route.ts`).  
  If the course API docs do not expose a dedicated rental **POST** on the GoIT host, this route acts as the **app backend** (BFF pattern).

### Optional upstream proxy

On the server (e.g. Vercel → Settings → Environment Variables) you can set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL for the cars API (default: `https://car-rental-api.goit.global`). |
| `RENTAL_UPSTREAM_URL` | **Server-only** (no `NEXT_PUBLIC_` prefix). When set, `POST /api/rental` forwards the JSON body with **POST** to this URL (e.g. your own backend or MockAPI). When unset, the handler returns a simple JSON success (`{ ok: true, ... }`). |

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript  
- TanStack Query (`@tanstack/react-query`)  
- CSS Modules (+ Tailwind as configured in the project)

## Install and run

**Node.js** (LTS) is required.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Deploy

The app can be deployed to **Vercel** or **Netlify** (per homework requirements). After deployment, configure environment variables in the hosting dashboard (see table above).

**Live demo URL (add after deploy):** _paste your URL here_

## Author

**Name:** _your full name_  
**Contact (optional):** _e.g. GitHub / email_

---

Source repository + deployed app — as required for submission.
