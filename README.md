# Music App

This repository contains a full-stack music app:

- `src/` contains the Express + TypeORM backend.
- `client/` contains the React + Vite frontend.

In development, the frontend calls `/api/...` and Vite proxies those requests to the backend at `http://localhost:3000`.

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
PORT=3000
```

6. Start the backend in terminal 1.

```bash
npm run dev
```

7. Start the frontend in terminal 2.

```bash
npm run dev:client
```

8. Open the app in the browser.

```text
http://localhost:5173
```

Optional: seed demo data after the backend is configured.

```bash
npm run seed
```

If only the frontend is running, the page shell will open, but API data will not load because the backend is required.

## Stack

- Backend: Express, TypeORM, PostgreSQL, Supabase Storage, Multer, class-validator, music-metadata, TypeScript
- Frontend: React 19, Vite, Redux Toolkit + RTK Query, React Router v7, Sass, react-toastify, lucide-react
- Tooling: TypeScript end-to-end, ESLint, nodemon, ts-node

## Features

Backend:

- REST API for songs, artists, albums, and genres with full CRUD where applicable (create, list, get by id, delete).
- Request validation via class-validator DTOs and a generic `validateRequest` middleware.
- UUID path-parameter validation middleware.
- File uploads via Multer (memory storage):
  - Songs: audio upload up to 500 MB, audio-only MIME filter.
  - Artists / Albums: image upload up to 10 MB, image-only MIME filter.
- Audio duration extracted automatically with `music-metadata` (the client never sends `duration`).
- Media files uploaded to Supabase Storage; public URLs persisted in PostgreSQL.
- Centralized error handler with typed error classes (validation, not-found, database, etc.).
- Search endpoints for songs (by title) and artists (by name).
- Seed script that loads sample genres, artists, albums and real mp3 + cover assets.

Frontend:

- Single-page app with 9 routes and a shared layout.
- Global persistent audio player (Redux Toolkit slice + listener middleware) with play / pause / next / previous / progress.
- RTK Query API slices per resource with automatic caching and tag-based invalidation.
- Forms for creating songs, artists, albums and genres, including file pickers for audio and images.
- Debounced search bar, skeleton loaders, empty states, confirm dialog for destructive actions.
- Dominant-color extraction hook used to theme detail pages.
- Toast notifications via `react-toastify`.
- Sass modules for styling, fully responsive layout.

## Frontend Pages

| Route          | Page             | What it does                                                           |
| -------------- | ---------------- | ---------------------------------------------------------------------- |
| `/`            | HomePage         | Landing view with highlights and quick links.                          |
| `/songs`       | SongsPage        | Browseable, searchable list of songs; create new song; play any track. |
| `/songs/:id`   | SongDetailPage   | Single song view with artist, album, genres and inline playback.       |
| `/artists`     | ArtistsPage      | Grid of artists with search and a create-artist form.                  |
| `/artists/:id` | ArtistDetailPage | Artist profile, bio, their albums and songs.                           |
| `/albums`      | AlbumsPage       | Grid of albums; create new album with cover image.                     |
| `/albums/:id`  | AlbumDetailPage  | Album cover, tracklist and play-all behavior.                          |
| `/genres`      | GenresPage       | List of genres with create-genre form.                                 |
| `/genres/:id`  | GenreDetailPage  | All songs that belong to the selected genre.                           |
| `*`            | NotFoundPage     | 404 fallback.                                                          |

## Requirements

- Node.js 18 or newer
- PostgreSQL
- A `.env` file for backend configuration
- Three public Supabase Storage buckets (one for songs, one for album covers, one for artist images)

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
│       ├── features/player/  # global audio player (Redux slice + listener)
│       ├── pages/        # route-level views
│       ├── services/     # RTK Query API slices
│       ├── styles/       # global Sass
│       └── types/        # shared TS types
├── package.json          # backend scripts
└── README.md
```

## Backend Environment Variables

Create a `.env` file in the project root:

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
PORT=3000
```

Notes:

- All three Supabase buckets must exist in your project and be set to **public** (the app stores their public URLs in the database).
- The bucket names above are examples — use whatever names you created in Supabase Storage, just keep the env variable names exactly as listed.
- Uploaded media (audio, cover images, artist images) is stored in Supabase; the resulting public URL is what gets persisted in PostgreSQL.

## Install

These are the same commands from the quick start, kept here as a reference section.

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix client install
```

## Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE music_app;
```

To create the schema without starting the full backend server, you can run:

```bash
npx ts-node src/index.ts
```

Or you can simply start the backend once with `npm run dev`, which also initializes TypeORM and creates the schema.

To seed demo data:

```bash
npm run seed
```

This inserts sample genres, artists, albums, songs, and song-genre relationships.

## Run In Development

Use two terminals.

Start the backend in one terminal:

```bash
npm run dev
```

Start the frontend in a second terminal:

```bash
npm run dev:client
```

You can also run the frontend directly inside `client/`:

```bash
cd client
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Important: if only the frontend is running, the app shell will open in the browser, but API data will fail to load because the backend is not running.

Expected successful startup:

- Backend terminal shows `Database connected successfully` and `Server running at http://localhost:3000`
- Frontend terminal shows Vite ready on `http://localhost:5173`

## Build And Production

Build the backend:

```bash
npm run build
```

Run the compiled backend:

```bash
npm start
```

Build the frontend:

```bash
npm run build:client
```

Preview the frontend production build locally:

```bash
npm run preview:client
```

The frontend production output is generated in `client/dist`.

## Useful Scripts

Root scripts:

- `npm run dev` - start the backend dev server
- `npm run dev:client` - start the frontend dev server from the project root
- `npm run build` - build the backend TypeScript output into `dist`
- `npm run build:client` - build the frontend for production
- `npm run preview:client` - preview the frontend production build
- `npm run seed` - seed demo data

## What To Run Most Often

For daily development:

```bash
npm run dev
```

and in another terminal:

```bash
npm run dev:client
```

Then open `http://localhost:5173`.

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
- Every `:id` path parameter must be a valid UUID v4; the `validateId` middleware rejects malformed ids with a 400 error.
- All responses are JSON; errors follow `{ "error": "...", "details": ... }` shape via the central error handler.

### API Route Groups

Songs:

- `POST   /api/songs` — create (multipart)
- `GET    /api/songs` — list all
- `GET    /api/songs/search` — search by title
- `GET    /api/songs/:id` — get by id
- `DELETE /api/songs/:id` — delete (also removes audio from Supabase)

Artists:

- `POST   /api/artists` — create (multipart)
- `GET    /api/artists` — list all
- `GET    /api/artists/search` — search by name
- `GET    /api/artists/:id` — get by id
- `DELETE /api/artists/:id` — delete

Albums:

- `POST   /api/albums` — create (multipart)
- `GET    /api/albums` — list all
- `GET    /api/albums/:id` — get by id
- `DELETE /api/albums/:id` — delete

Genres:

- `POST   /api/genres` — create (JSON)
- `GET    /api/genres` — list all
- `GET    /api/genres/:id` — get by id
- `DELETE /api/genres/:id` — delete

## Postman Requests

### General Rules

- For `GET /:id` and `DELETE /:id` routes, the `id` path parameter must be a valid UUID v4.
- For song creation, the request must be `multipart/form-data` because `audioFile` is required.
- For artist creation, use `multipart/form-data` and attach `profilePicture` as a file (optional).
- For album creation, use `multipart/form-data` and attach `coverImage` as a file (optional).
- For genre creation, use raw JSON.
- Search routes accept query parameters. Because the validation middleware merges query and body, query parameters are the cleanest option for `GET` requests.

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
