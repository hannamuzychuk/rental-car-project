# RentalCar — frontend (GoIT)

Frontend for **RentalCar**, a car rental company web app. Built with **Next.js (App Router)** and **TypeScript**, following the FS homework specification.

## Features

- **`/`** — Home page with a hero section and a call-to-action to open the catalog.
- **`/catalog`** — Car list from the GoIT API, **server-side filters** (brand, hourly price, mileage from/to), **“Load more”** pagination via **`useInfiniteQuery`** (TanStack Query). Each card opens the detail page in a **new browser tab** (“Read more”).
- **`/catalog/[carId]`** — Car details (**GET /cars/{id}**), photo, specifications, rental conditions, and a **booking form** (name, email, booking date, comment).
- **`/favorites`** — Saved cars stored in the browser (`localStorage`).

## API

Base URL (default): **`https://car-rental-api.goit.study`**

Override with **`NEXT_PUBLIC_API_URL`** in `.env.local` if needed.

| Method | Endpoint | Used for |
|--------|----------|----------|
| `GET` | `/cars` | Catalog list (`brand`, `price`, `minMileage`, `maxMileage`, `page`, `perPage`) |
| `GET` | `/cars/filters` | Filter metadata (brands, price range) |
| `GET` | `/cars/{id}` | Car detail page |
| `POST` | `/cars/{carId}/booking-requests` | Rental form submission |

Request body for booking:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "comment": "I would like to rent this car next weekend."
}
```

The form validates **booking date** in the UI; the API has no separate `bookingDate` field, so the chosen date is appended to `comment` (e.g. `Preferred booking date: 2026-05-20`).

API client code lives in `lib/api/cars.ts`. Responses are normalized in `lib/normalize-car.ts` (supports both `location` object and legacy `address` string).

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL for `metadataBase` and Open Graph (default locally: `http://localhost:3000`). On Vercel without this variable, `VERCEL_URL` is used automatically. |
| `NEXT_PUBLIC_API_URL` | Base URL for the cars API (default: `https://car-rental-api.goit.study`). |

Copy `env.example` to `.env.local` for local development.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- TanStack Query (`@tanstack/react-query`)
- Formik + Yup (booking form validation)
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

The app can be deployed to **Vercel** or **Netlify** (per homework requirements).

### Vercel environment variables

In the Vercel project: **Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|--------|----------------|
| `NEXT_PUBLIC_SITE_URL` | `https://rental-car-project.vercel.app` | Production (and Preview if you want the same OG URL on preview builds) |

Redeploy after saving so metadata picks up the new value. Without it, Vercel still sets `VERCEL_URL` at build time as a fallback, but an explicit `NEXT_PUBLIC_SITE_URL` keeps Open Graph and canonical links stable (especially if you add a custom domain later).

Set `NEXT_PUBLIC_API_URL` only if you use a custom API host.

**Live demo:** [https://rental-car-project.vercel.app/](https://rental-car-project.vercel.app/)

## Author

**Hanna Muzychuk** — [GitHub](https://github.com/hannamuzychuk)

## Known limitations

- **Favorites** are stored only in the browser (`localStorage`). They do not sync across devices or browsers and are lost if the user clears site data.
- **Booking date** is validated in the UI but sent inside the `comment` field, because the GoIT API has no separate `bookingDate` property.
- **Car images** are loaded from the GoIT CDN (`ac.goit.global`); if that host is unavailable, photos will not display.
- **Offline / slow network**: catalog and detail pages depend on the live API; there is no offline cache of the full car list.