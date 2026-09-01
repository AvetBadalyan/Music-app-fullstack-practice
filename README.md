# Music App

A full-stack music library application with a global audio player, admin content management, and a fully responsive dark UI.

**Live demo (Vercel):** https://music-app-fullstack-practice.vercel.app/
**Live demo (AWS Amplify):** https://main.d3kojl89wftd85.amplifyapp.com/

---

## Screenshots

### Home — hero slider + recent songs

![Home](screenshots/Screenshot%202026-06-01%20224827.png)

### Albums

![Albums](screenshots/Screenshot%202026-06-01%20212647.png)

### Artists

![Artists](screenshots/Screenshot%202026-06-01%20212618.png)

### Songs

![Songs](screenshots/Screenshot%202026-06-01%20220257.png)

### Song detail — dominant-color hero, play button

![Song detail](screenshots/Screenshot%202026-06-01%20212627.png)

### Genres

![Genres](screenshots/Screenshot%202026-06-01%20212653.png)

### Artist detail — dominant-color hero, discography, tracklist

![Artist detail](screenshots/Screenshot%202026-06-01%20212637.png)

### Album detail — dominant-color hero, tracklist

![Album detail](screenshots/Screenshot%202026-06-02%20004739.png)

### Genre detail — filtered song list

![Genre detail](screenshots/Screenshot%202026-06-02%20004716.png)

### Admin view — create-song form + song list

![Admin create song](screenshots/Screenshot%202026-06-01%20212802.png)

### Mobile — home page

![Mobile home](screenshots/Screenshot%202026-06-01%20212705.png)

### Mobile — navigation drawer

![Mobile navigation](screenshots/Screenshot%202026-06-01%20212712.png)

### Player — desktop (progress bar, shuffle, repeat, volume)

![Player desktop](screenshots/Screenshot%202026-06-01%20234128.png)

### Player — mobile (stacked layout)

![Player mobile](screenshots/Screenshot%202026-06-01%20234203.png)

### Confirm dialog — delete with cascade warning

![Confirm dialog](screenshots/Screenshot%202026-06-01%20234309.png)

---

## Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express, TypeORM, PostgreSQL, Supabase Auth, Supabase Storage, Multer, music-metadata, class-validator, TypeScript |
| **Frontend** | React 19, Vite, Redux Toolkit + RTK Query, React Router v7, Supabase Auth client, Sass, react-toastify, lucide-react, TypeScript |
| **Tooling** | ESLint, nodemon, ts-node |

---

## Features

### Backend
- REST API for songs, artists, albums, and genres (list, get by id, create, delete).
- Request validation via class-validator DTOs and a `validateRequest` middleware.
- UUID path-parameter validation middleware.
- File uploads via Multer (memory storage) with MIME filtering:
  - Songs: audio only, up to 500 MB.
  - Artists / Albums: images only, up to 10 MB.
- Audio duration extracted automatically with `music-metadata` — never sent by the client.
- Media files uploaded to Supabase Storage; public URLs persisted in PostgreSQL.
- Supabase JWT verification for all write/delete routes (`requireAdmin` middleware).
- Centralized typed error handler (`ValidationError`, `NotFoundError`, `DatabaseError`, etc.).
- Debounced search endpoints for songs (by title) and artists (by name).
- Seed script with sample genres, artists, albums, real mp3 files and cover art.

### Frontend
- Single-page app with 11 routes and a shared persistent layout.
- Supabase Auth login — admin-only create/delete, public browsing/playback for visitors.
- Hero slider on the home page with auto-advance, pause-on-hover, keyboard-accessible dot/arrow controls.
- Global persistent audio player (Redux Toolkit slice + listener middleware):
  - Play / pause / skip / previous, shuffle, and three repeat modes (off / all / one).
  - Keyboard shortcuts: Space, Arrow keys, M (mute), N (next), P (previous), S (shuffle), R (repeat).
  - Seeking and volume control with accessible range inputs.
  - Player auto-closes when the playing song, album, or artist is deleted.
- RTK Query API slices per resource with automatic caching and tag-based cache invalidation.
- Dominant-color extraction hook — samples album/artist cover art via `<canvas>` to theme detail page heroes.
- Debounced search bar, skeleton loaders, empty states, confirm dialog for destructive actions (focus-trapped, accessible).
- Forms for creating songs, artists, albums, and genres including file pickers.
- Toast notifications via `react-toastify`.
- Fully responsive layout — mobile off-canvas sidebar, tablet/desktop static sidebar.
- Sass with CSS custom properties for all design tokens (colors, spacing, typography, shadows).

---

## Prerequisites

- **Node.js** ≥22.12 (Vite 8's minimum; Node 20 is end-of-life and no longer offered as a Vercel runtime)
- **PostgreSQL** (local instance or a cloud service)
- **Supabase project** (for Auth and Storage — free tier works)

---

## Local development

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-username/music-app.git
cd music-app

# Backend
npm install

# Frontend
cd client && npm install && cd ..
```

### 2. Configure environment variables

**Backend** — copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection URL (or use individual `DB_*` vars) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase **service-role** key (kept server-side only) |
| `SUPABASE_SONGS_BUCKET` | Supabase Storage bucket name for audio files |
| `SUPABASE_ALBUM_COVERS_BUCKET` | Supabase Storage bucket name for album covers |
| `SUPABASE_ARTIST_IMAGES_BUCKET` | Supabase Storage bucket name for artist images |
| `ADMIN_EMAIL` | Email address that receives admin write access |
| `CLIENT_URL` | Frontend origin for CORS, e.g. `http://localhost:5173` |

**Frontend** — copy `client/.env.example` to `client/.env`:

```bash
cp client/.env.example client/.env
```

Key variables:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase **anon / publishable** key |
| `VITE_ADMIN_EMAIL` | Same email as `ADMIN_EMAIL` — controls UI visibility |

### 3. Run the app

Open two terminals:

```bash
# Terminal 1 — backend (http://localhost:3000)
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
npm run dev:client
```

The Vite dev server proxies all `/api/*` requests to the backend automatically.

### 4. (Optional) Seed sample data

```bash
npm run seed
```

This loads genres, artists, albums, and real mp3 tracks into your database and uploads the media files to Supabase Storage.

---

## Project structure

```
music-app/
├── src/                    # Express + TypeORM backend
│   ├── controllers/        # Route handlers
│   ├── services/           # Business logic
│   ├── entities/           # TypeORM entity classes
│   ├── dto/                # class-validator DTOs
│   ├── middlewares/        # auth, validation, error handler, file upload
│   ├── routes/             # Express routers
│   └── seed/               # Seed script + assets
└── client/                 # React + Vite frontend
    └── src/
        ├── app/            # Redux store, hooks, env, utilities
        ├── components/     # Shared UI (layout, player, forms, common)
        ├── features/       # Auth slice, player slice + listener
        ├── pages/          # Route-level page components
        ├── services/       # RTK Query API slices
        ├── styles/         # Global CSS tokens and resets
        └── types/          # Shared TypeScript interfaces
```

---

## Deployment notes

- **`DB_SYNCHRONIZE`** must be `false` in production. Use TypeORM migrations instead:
  ```bash
  npx typeorm-ts-node-commonjs migration:generate src/migrations/Init -d src/data-source.ts
  npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
  ```
- **CORS:** `CLIENT_URL` must match the deployed frontend origin exactly (no trailing slash).
- **Vite proxy** is dev-only. In production deploy the frontend separately and set `VITE_API_URL` to the backend URL.
- **Backend hosting:** the API runs on Vercel as a single serverless function (`api/index.ts`, routed via `vercel.json`). Set `DATABASE_URL`, `CLIENT_URL`, `DB_SYNCHRONIZE=false` and the `SUPABASE_*` / `ADMIN_EMAIL` variables in the Vercel project's environment settings — none of these are read from a committed config file. (`NODE_ENV=production` is set by Vercel itself, which is what enables SSL to Postgres.)
- **The serverless entry (`api/index.js`) is plain JavaScript and loads `dist/`, not `src/`.** Vercel compiles TypeScript with esbuild, which does not implement `emitDecoratorMetadata`; the TypeORM entities infer column types from it (`@Column() title!: string`), so an esbuild-compiled entity throws `ColumnTypeUndefinedError` as soon as the class is defined. `vercel.json` therefore runs `npm run build` (tsc, which does emit the metadata) and the entry requires the compiled output.
- **`outputDirectory: "public"`** is an empty placeholder. Once a build command runs, Vercel expects a static output directory; this API has no static assets, and pointing the setting at the repo root instead would publish the source.


## Frontend Pages

| Route          | Page             | What it does                                                           |
| -------------- | ---------------- | ---------------------------------------------------------------------- |
| `/`            | HomePage         | Landing view with featured hero slider, recent songs, and album highlights.                          |
| `/songs`       | SongsPage        | Browseable, searchable list of songs; create new song; play any track. |
| `/songs/:id`   | SongDetailPage   | Single song view with artist, album, genres and inline playback.       |
| `/artists`     | ArtistsPage      | Grid of artists with search and a create-artist form.                  |
| `/artists/:id` | ArtistDetailPage | Artist profile, bio, their albums and songs.                           |
| `/albums`      | AlbumsPage       | Grid of albums; create new album with cover image.                     |
| `/albums/:id`  | AlbumDetailPage  | Album cover, tracklist and play-all behavior.                          |
| `/genres`      | GenresPage       | List of genres with create-genre form.                                 |
| `/genres/:id`  | GenreDetailPage  | All songs that belong to the selected genre.                           |
| `/login`       | LoginPage        | Admin login using Supabase Auth.                                       |
| `*`            | NotFoundPage     | 404 fallback.                                                          |

## Project Structure

```text
music-app/
├── src/                  # Express + TypeORM backend
│   ├── app.ts            # app bootstrap (db init, routes, error handler)
│   ├── data-source.ts    # TypeORM DataSource
│   ├── controllers/      # route handlers (album, artist, genre, song)
│   ├── routes/           # Express routers mounted under /api
│   ├── services/         # business logic + Supabase Storage helper
│   ├── entities/         # TypeORM entities (Album, Artist, Genre, Song)
│   ├── dto/              # class-validator DTOs for request bodies
│   ├── middlewares/      # error handler, id/request validation, file upload
│   ├── seed/             # demo data + media assets used by `npm run seed`
│   └── utils/            # env helpers, error classes, transforms
├── client/               # React + Vite frontend
│   └── src/
│       ├── app/          # Redux store, hooks, custom hooks
│       ├── components/   # albums, artists, songs, forms, layout, common
│       ├── features/auth/    # Supabase Auth session state
│       ├── features/player/  # global audio player (Redux slice + listener)
│       ├── pages/        # route-level views
│       ├── services/     # RTK Query API slices
│       ├── styles/       # global Sass
│       └── types/        # shared TS types
├── package.json          # backend scripts
└── README.md
```

## Requirements

- Node.js ≥22.12 (Vite 8's minimum; Node 20 is end-of-life and no longer offered as a Vercel runtime)
- PostgreSQL
- A `.env` file for backend configuration
- A `client/.env` file for frontend Supabase Auth configuration
- Three public Supabase Storage buckets (one for songs, one for album covers, one for artist images)
- One Supabase Auth user whose email matches `ADMIN_EMAIL`

## Quick Start From Zero

If you just cloned the repo and want to run the app locally, use this order:

1. Clone the repository and enter the project folder.

```bash
git clone <your-repo-url>
cd music-app
```

2. Install backend dependencies.

```bash
npm install
```

3. Install frontend dependencies.

```bash
npm --prefix client install
```

4. Create a PostgreSQL database named `music_app`.

```sql
CREATE DATABASE music_app;
```

5. Create the root `.env` file with your database and Supabase values.

```env
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=music_app
DB_PORT=5432
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
SUPABASE_SONGS_BUCKET=songs
SUPABASE_ALBUM_COVERS_BUCKET=album-covers
SUPABASE_ARTIST_IMAGES_BUCKET=artist-images
ADMIN_EMAIL=your_admin_email@example.com
PORT=3000
```

6. Create `client/.env` for the React app.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

If you want the local frontend to call a deployed backend (instead of using the Vite `/api` proxy), also set:

```env
VITE_API_URL=https://your-api.vercel.app
```

7. In Supabase Auth, create a user with the same email as `ADMIN_EMAIL`.

8. Start the backend in terminal 1.

```bash
npm run dev
```

9. Start the frontend in terminal 2.

```bash
npm run dev:client
```

10. Open the app in the browser.

```text
http://localhost:5173
```

Optional: seed demo data after the backend is configured.

```bash
npm run seed
```

If only the frontend is running, the page shell will open, but API data will not load because the backend is required.

## Backend Environment Variables

All backend config lives in a single `.env` file at the project root (see step 5 of the Quick Start for a ready-to-copy template). Variables:

| Variable                       | Required | Description                                                     |
| ------------------------------ | -------- | --------------------------------------------------------------- |
| `DB_HOST`                      | yes      | PostgreSQL host, e.g. `localhost`.                              |
| `DB_PORT`                      | yes      | PostgreSQL port, usually `5432`.                                |
| `DB_USERNAME`                  | yes      | PostgreSQL user.                                                |
| `DB_PASSWORD`                  | yes      | PostgreSQL password.                                            |
| `DB_NAME`                      | yes      | Database name (e.g. `music_app`).                               |
| `SUPABASE_URL`                 | yes      | Your Supabase project URL.                                      |
| `SUPABASE_SECRET_KEY`          | yes      | Supabase service-role / secret key (server-side only).          |
| `SUPABASE_SONGS_BUCKET`        | yes      | Name of the public bucket used for audio uploads.               |
| `SUPABASE_ALBUM_COVERS_BUCKET` | yes      | Name of the public bucket used for album cover images.          |
| `SUPABASE_ARTIST_IMAGES_BUCKET`| yes      | Name of the public bucket used for artist profile images.       |
| `ADMIN_EMAIL`                  | yes      | Email allowed to create/delete resources. Must match a Supabase Auth user. |
| `PORT`                         | no       | Backend HTTP port (defaults to `3000`).                         |

Notes:

- All three Supabase buckets must exist and be **public** — the app stores their public URLs in the database.
- Bucket names are up to you; only the env variable names must match exactly.
- The `SUPABASE_SECRET_KEY` is sensitive: never commit it and never expose it to the frontend.
- The backend verifies Supabase Auth JWTs on protected routes and only allows the configured `ADMIN_EMAIL`.

## Frontend Environment Variables

The React app reads Supabase Auth config from `client/.env`:

| Variable                 | Required | Description                                      |
| ------------------------ | -------- | ------------------------------------------------ |
| `VITE_SUPABASE_URL`      | yes      | Your Supabase project URL.                       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes      | Supabase publishable key used by the browser. |
| `VITE_ADMIN_EMAIL`       | yes      | Same admin email used by the backend. Controls UI visibility only. |
| `VITE_API_URL`           | no       | Backend base URL (do not include `/api`). Example: `https://your-api.vercel.app`. Leave unset in local dev to use the Vite `/api` proxy. |

The frontend value is not a security boundary; the backend `ADMIN_EMAIL` check is what protects writes.

## Database Setup

The database itself must exist before the backend starts (Quick Start step 4). On first launch, TypeORM connects to it and automatically creates the schema for all entities.

To populate the database with sample genres, artists, albums, songs and song-genre relationships (and upload the bundled mp3/cover assets to Supabase), run:

```bash
npm run seed
```

## Seeding Supabase (Remote DB)

This project can run on different databases (local Postgres vs Supabase Postgres).

- By default, `npm run seed` seeds your **local** database (the one configured by `DB_HOST`, `DB_NAME`, etc.).
- If you temporarily set `DATABASE_URL`, the seed script will seed **that** database instead (for example: your Supabase database).

⚠️ Warning: the seed script **deletes existing data** (it truncates the tables). Only run it on an empty database or when you intentionally want to reset demo data.

### Seed Supabase from your local machine

1. Get your Supabase Postgres connection string (use the **Pooler** URI from Supabase “Connect”).
2. Run the seed while pointing `DATABASE_URL` at Supabase.

If you are using Git Bash / macOS / Linux (hides the password while typing):

```bash
git pull

printf "Paste DATABASE_URL: "
read -s DATABASE_URL
printf "\n"

export DATABASE_URL
NODE_ENV=production npm run seed

unset DATABASE_URL
```

Why `NODE_ENV=production`? The backend enables SSL when `NODE_ENV=production`, which Supabase Postgres expects.

After this finishes, your deployed app (Vercel/Amplify) will immediately show the seeded data because it reads from the same Supabase database.

Notes:

- Redeploying the backend (Vercel/etc.) does **not** wipe your data. Your rows live in Supabase Postgres.
- The seed script **does** wipe data because it starts with `TRUNCATE ... CASCADE`.
- If you are seeding a brand-new database with no tables yet, create the schema first (migrations are best practice; alternatively, temporarily enable TypeORM `synchronize` once to bootstrap tables).

## Run In Development

The Quick Start already covers the two-terminal flow (`npm run dev` for the backend, `npm run dev:client` for the frontend). A few extras worth knowing:

- You can run the frontend directly from inside `client/` with `npm run dev` instead of using `npm run dev:client` from the root.
- Default URLs: frontend on `http://localhost:5173`, backend on `http://localhost:3000`.
- The frontend talks to `/api/...`; Vite proxies those requests to the backend, so both processes must be running.
- Expected successful startup:
  - Backend terminal shows `Database connected successfully` and `Server running at http://localhost:3000`.
  - Frontend terminal shows Vite ready on `http://localhost:5173`.

## Build And Production

Production commands (see the Useful Scripts table for a one-line summary of each):

```bash
npm run build          # compile backend TypeScript into dist/
npm start              # run the compiled backend
npm run build:client   # build the frontend into client/dist
npm run preview:client # serve the built frontend locally for verification
```

## Useful Scripts

All scripts are defined in the root `package.json` and can be run from the project root:

| Script                  | What it does                                                        |
| ----------------------- | ------------------------------------------------------------------- |
| `npm run dev`           | Start the backend dev server (nodemon + ts-node).                   |
| `npm run dev:client`    | Start the frontend dev server (Vite) without `cd`-ing into client/. |
| `npm run build`         | Compile the backend to `dist/`.                                     |
| `npm start`             | Run the compiled backend (`dist/app.js`).                           |
| `npm run build:client`  | Build the frontend for production into `client/dist/`.              |
| `npm run preview:client`| Preview the production frontend build locally.                      |
| `npm run seed`          | Seed the database with demo data and upload sample media.           |

## Backend API

Base URL:

```text
http://localhost:3000
```

Notes:

- The backend only serves the API under `/api/*`. There is no `GET /` route, so opening `http://localhost:3000/` directly in the browser returns `Cannot GET /` — this is expected. The user-facing home page lives on the frontend at `http://localhost:5173/`.
- Search endpoints use query parameters.
- Genre creation uses raw JSON.
- Artist, album and song creation use `multipart/form-data` because they accept file uploads (profile picture, cover image, audio file).
- Create and delete routes require `Authorization: Bearer <supabase_access_token>` for the configured admin user.
- Every `:id` path parameter must be a valid UUID v4; the `validateId` middleware rejects malformed ids with a 400 error.
- All responses are JSON; errors follow `{ "error": "...", "details": ... }` shape via the central error handler.

### API Route Groups

Songs:

- `POST   /api/songs` — create (multipart, admin only)
- `GET    /api/songs` — list all
- `GET    /api/songs/search` — search by title
- `GET    /api/songs/:id` — get by id
- `DELETE /api/songs/:id` — delete (admin only; also removes audio from Supabase)

Artists:

- `POST   /api/artists` — create (multipart, admin only)
- `GET    /api/artists` — list all
- `GET    /api/artists/search` — search by name
- `GET    /api/artists/:id` — get by id
- `DELETE /api/artists/:id` — delete (admin only)

Albums:

- `POST   /api/albums` — create (multipart, admin only)
- `GET    /api/albums` — list all
- `GET    /api/albums/:id` — get by id
- `DELETE /api/albums/:id` — delete (admin only)

Genres:

- `POST   /api/genres` — create (JSON, admin only)
- `GET    /api/genres` — list all
- `GET    /api/genres/:id` — get by id
- `DELETE /api/genres/:id` — delete (admin only)

## Postman Requests

### General Rules

- For `GET /:id` and `DELETE /:id` routes, the `id` path parameter must be a valid UUID v4.
- `POST` and `DELETE` requests require an admin Supabase access token in the `Authorization` header.
- For song creation, the request must be `multipart/form-data` because `audioFile` is required.
- For artist creation, use `multipart/form-data` and attach `profilePicture` as a file (optional).
- For album creation, use `multipart/form-data` and attach `coverImage` as a file (optional).
- For genre creation, use raw JSON.
- Search routes accept query parameters. Because the validation middleware merges query and body, query parameters are the cleanest option for `GET` requests.

Postman auth setup for create/delete requests:

```text
Authorization: Bearer <supabase_admin_access_token>
```

The browser obtains this token when the admin signs in on `/login`. For direct Postman testing, sign in with the same Supabase Auth admin user and copy its access token.

### Artists

#### Create Artist

- Method: `POST`
- URL: `http://localhost:3000/api/artists`
- Body type: `form-data`

Required fields:

- `name`: string, max 50 characters

Optional fields:

- `bio`: string, max 1000 characters
- `profilePicture`: file (image/\*, max 10 MB) — uploaded to Supabase Storage; the resulting public URL is stored in `profile_picture`.

Postman form-data setup:

- key `name` -> Text
- key `bio` -> Text, optional
- key `profilePicture` -> File, optional

Example form-data values:

```text
name: Frank Sinatra
bio: American singer and actor
profilePicture: [select an image file in Postman]
```

#### Get All Artists

- Method: `GET`
- URL: `http://localhost:3000/api/artists`

#### Get Artist By Id

- Method: `GET`
- URL: `http://localhost:3000/api/artists/:id`

#### Search Artists By Name

- Method: `GET`
- URL: `http://localhost:3000/api/artists/search?name=Frank`

Required query params:

- `name`: string, not empty, max 100 characters

#### Delete Artist

- Method: `DELETE`
- URL: `http://localhost:3000/api/artists/:id`

### Albums

#### Create Album

- Method: `POST`
- URL: `http://localhost:3000/api/albums`
- Body type: `form-data`

Required fields:

- `title`: string, max 100 characters
- `artistId`: UUID

Optional fields:

- `releaseDate`: ISO date string, for example `2024-01-15`
- `coverImage`: file (image/\*, max 10 MB) — uploaded to Supabase Storage; the resulting public URL is stored in `cover_image`.

Postman form-data setup:

- key `title` -> Text
- key `artistId` -> Text
- key `releaseDate` -> Text, optional
- key `coverImage` -> File, optional

Example form-data values:

```text
title: In The Wee Small Hours
artistId: efb7647b-8450-4e27-b6d6-60c12e7f3560
releaseDate: 1955-04-25
coverImage: [select an image file in Postman]
```

#### Get All Albums

- Method: `GET`
- URL: `http://localhost:3000/api/albums`

#### Get Album By Id

- Method: `GET`
- URL: `http://localhost:3000/api/albums/:id`

#### Delete Album

- Method: `DELETE`
- URL: `http://localhost:3000/api/albums/:id`

### Genres

#### Create Genre

- Method: `POST`
- URL: `http://localhost:3000/api/genres`
- Body type: `raw` JSON

Required fields:

- `name`: string, max 50 characters

Example body:

```json
{
  "name": "Jazz"
}
```

#### Get All Genres

- Method: `GET`
- URL: `http://localhost:3000/api/genres`

#### Get Genre By Id

- Method: `GET`
- URL: `http://localhost:3000/api/genres/:id`

#### Delete Genre

- Method: `DELETE`
- URL: `http://localhost:3000/api/genres/:id`

### Songs

#### Create Song

- Method: `POST`
- URL: `http://localhost:3000/api/songs`
- Body type: `form-data`

Required fields:

- `title`: string, max 100 characters
- `artistId`: UUID
- `audioFile`: file

Optional fields:

- `albumId`: UUID
- `genreIds`: array of UUIDs

Postman form-data setup:

- key `title` -> Text
- key `artistId` -> Text
- key `albumId` -> Text, optional
- key `genreIds` -> Text, optional, repeat the same key for multiple genre ids
- key `audioFile` -> File

Example form-data values:

```text
title: My Song
artistId: efb7647b-8450-4e27-b6d6-60c12e7f3560
albumId: eba44568-4b4f-404c-8bf4-56fcc520df84
genreIds: 11111111-1111-1111-1111-111111111111
genreIds: 22222222-2222-2222-2222-222222222222
audioFile: [select a file in Postman]
```

Important:

- `title` is required.
- `artistId` is required.
- `audioFile` is required because the backend extracts the duration from the uploaded file.
- `duration` is not sent by the client. It is calculated from the uploaded audio file.

#### Get All Songs

- Method: `GET`
- URL: `http://localhost:3000/api/songs`

#### Get Song By Id

- Method: `GET`
- URL: `http://localhost:3000/api/songs/:id`

#### Search Songs By Title

- Method: `GET`
- URL: `http://localhost:3000/api/songs/search?title=Moon`

Required query params:

- `title`: string, not empty, max 100 characters

#### Delete Song

- Method: `DELETE`
- URL: `http://localhost:3000/api/songs/:id`

Deleting a song also removes its audio file from Supabase Storage.

## Quick Postman Test Order

1. Create a genre with `POST /api/genres`
2. Create an artist with `POST /api/artists`
3. Create an album with `POST /api/albums`
4. Create a song with `POST /api/songs`
5. Read data with `GET /api/songs`, `GET /api/artists/:id`, `GET /api/albums`, and `GET /api/genres`

## Database Schema

### Entity Relationships

- An **Artist** can have multiple **Albums**
- An **Artist** can have multiple **Songs**
- An **Album** can have multiple **Songs**
- A **Song** can belong to multiple **Genres**

### Tables

#### Artist

| Column          | Type    | Description          |
| --------------- | ------- | -------------------- |
| id              | UUID    | Primary Key          |
| name            | VARCHAR | Artist name          |
| bio             | VARCHAR | Artist biography     |
| profile_picture | VARCHAR | Profile picture path |

#### Album

| Column       | Type    | Description          |
| ------------ | ------- | -------------------- |
| id           | UUID    | Primary Key          |
| title        | VARCHAR | Album title          |
| release_date | DATE    | Release date         |
| cover_image  | VARCHAR | Cover image path     |
| artistId     | UUID    | Foreign Key (Artist) |

#### Song

| Column     | Type    | Description          |
| ---------- | ------- | -------------------- |
| id         | UUID    | Primary Key          |
| title      | VARCHAR | Song title           |
| duration   | INT     | Duration in seconds  |
| audio_file | VARCHAR | Supabase public URL  |
| albumId    | UUID    | Foreign Key (Album)  |
| artistId   | UUID    | Foreign Key (Artist) |

#### Genre

| Column | Type    | Description |
| ------ | ------- | ----------- |
| id     | UUID    | Primary Key |
| name   | VARCHAR | Genre name  |

#### SongGenres

| Column  | Type | Description         |
| ------- | ---- | ------------------- |
| songId  | UUID | Foreign Key (Song)  |
| genreId | UUID | Foreign Key (Genre) |

## About This Project

This is a personal portfolio project demonstrating full-stack development skills: a typed REST API on Express + TypeORM + PostgreSQL with Supabase-backed media storage, paired with a modern React frontend using Redux Toolkit, RTK Query, and a custom global audio player.

## License

Released under the `ISC` license (see `package.json`).
