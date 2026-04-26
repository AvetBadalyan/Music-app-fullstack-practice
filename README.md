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
SUPABASE_STORAGE_BUCKET=Songs
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

- Backend: Express, TypeORM, PostgreSQL, Supabase Storage, TypeScript
- Frontend: React, Vite, Redux Toolkit, RTK Query, React Router, Sass

## Requirements

- Node.js 18 or newer
- PostgreSQL
- A `.env` file for backend configuration
- A public Supabase Storage bucket named `Songs` for song uploads

## Project Structure

```text
music-app/
├── src/          # backend
├── client/       # frontend
├── package.json  # backend scripts
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
SUPABASE_STORAGE_BUCKET=Songs
PORT=3000
```

Note: uploaded song audio is stored in Supabase Storage and the public URL is saved in the database.

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

- `GET /` is not implemented, so opening `http://localhost:3000/` in the browser returns `Cannot GET /`.
- Search endpoints use query parameters.
- Artist, album, and genre creation use raw JSON bodies.
- Song creation uses `multipart/form-data` because `audioFile` is required.

### API Route Groups

- `GET/POST /api/songs`
- `GET /api/songs/search`
- `GET /api/songs/:id`
- `POST /api/artists`
- `GET /api/artists/search`
- `GET /api/artists/:id`
- `GET/POST /api/albums`
- `GET /api/albums/:id`
- `GET/POST /api/genres`
- `GET /api/genres/:id`

## Postman Requests

### General Rules

- For `GET /:id` routes, the `id` path parameter is required.
- For song creation, the request must be `multipart/form-data` because `audioFile` is required.
- For artist, album, and genre creation, use raw JSON in Postman.
- Search routes accept query parameters. Because the validation middleware merges query and body, query parameters are the cleanest option for `GET` requests.

### Artists

#### Create Artist

- Method: `POST`
- URL: `http://localhost:3000/api/artists`
- Body type: `raw` JSON

Required fields:

- `name`: string, max 50 characters

Optional fields:

- `bio`: string, max 1000 characters
- `profilePicture`: string, max 50 characters

Example body:

```json
{
  "name": "Frank Sinatra",
  "bio": "American singer and actor",
  "profilePicture": "frank-sinatra.jpg"
}
```

#### Get Artist By Id

- Method: `GET`
- URL: `http://localhost:3000/api/artists/:id`

#### Search Artists By Name

- Method: `GET`
- URL: `http://localhost:3000/api/artists/search?name=Frank`

Required query params:

- `name`: string, not empty, max 100 characters

### Albums

#### Create Album

- Method: `POST`
- URL: `http://localhost:3000/api/albums`
- Body type: `raw` JSON

Required fields:

- `title`: string, max 100 characters
- `artistId`: UUID

Optional fields:

- `releaseDate`: valid date string, for example `2024-01-15`
- `coverImage`: string, max 50 characters

Example body:

```json
{
  "title": "My Album",
  "artistId": "efb7647b-8450-4e27-b6d6-60c12e7f3560",
  "releaseDate": "2024-01-15",
  "coverImage": "cover.jpg"
}
```

#### Get All Albums

- Method: `GET`
- URL: `http://localhost:3000/api/albums`

#### Get Album By Id

- Method: `GET`
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

| Column          | Type    | Description            |
| --------------- | ------- | ---------------------- |
| id              | UUID    | Primary Key            |
| name            | VARCHAR | Artist name            |
| bio             | VARCHAR | Artist biography       |
| profile_picture | VARCHAR | Profile picture path   |

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

## Package License

The package metadata currently declares the license as `ISC`.
