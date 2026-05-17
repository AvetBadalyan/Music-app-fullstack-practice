# Music App Frontend

This is the React frontend for the Music App.

For full project setup from a fresh clone, read the root README first.

Use this file only for frontend-specific commands once the backend is already configured.

## Stack

- React
- Vite
- TypeScript
- Redux Toolkit
- RTK Query
- React Router
- Sass

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

If you are starting from the project root, you can run the frontend with:

```bash
npm run dev:client
```

## Backend Connection

The frontend expects the backend to run on `http://localhost:3000`.

In development, Vite proxies `/api` requests to the backend, so frontend code calls endpoints like:

- `/api/songs`
- `/api/albums`
- `/api/artists/search?name=...`
- `/api/genres`

Make sure the backend is running before opening the frontend.

Normal local workflow:

1. Run `npm run dev` in the project root for the backend.
2. Run `npm run dev:client` in the project root, or `npm run dev` inside `client/`.
3. Open `http://localhost:5173`.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Frontend Structure

```text
src/
├── app/          # Redux store and hooks
├── components/   # layout and reusable UI
├── features/     # Redux slices
├── pages/        # route pages
├── services/     # RTK Query APIs
├── styles/       # global styles
└── types/        # shared frontend types
```
