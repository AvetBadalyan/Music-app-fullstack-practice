# Music App Database

This project is a backend API for a music app using TypeORM with PostgreSQL.

## Requirements

- Node.js 18 or newer
- TypeScript
- PostgreSQL
- TypeORM

## Setup Instructions

### 1. Install required dependencies

```bash
npm install
```

If `npx ts-node src/index.ts` fails with `SyntaxError: Unexpected token '??='`, your Node.js version is too old. This project depends on packages that use modern JavaScript syntax supported in Node.js 18+.

### 2. Create a PostgreSQL database named `music_app`

You can create it using pgAdmin or run:

```sql
CREATE DATABASE music_app;
```

### 3. Configure Environment Variables

Make sure your `.env` file contains the correct database credentials and storage configuration:

```env
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=music_app
DB_PORT=5432
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
SUPABASE_STORAGE_BUCKET=Songs
```

For song uploads, create a public Supabase Storage bucket named `Songs`.

Note: Audio files are currently served from a public Supabase bucket for simplicity. In production, this would use private storage with signed URLs or a backend streaming API to protect content.

### 4. Run the project to create database schema

```bash
npx ts-node src/index.ts
```

This will:

- Establish a connection to PostgreSQL
- Create all required tables
- Print a success message

### 5. Seed the database with initial data

To insert demo data (genres, artists, albums, songs), run:

```bash
npm run seed
```

Or:

```bash
npx ts-node src/seed/seed.ts
```

This will populate the database with:

- 4 Genres
- 4 Artists
- 4 Albums
- Multiple Songs
- Song ↔ Genre relationships

## Database Schema

### Entity Relationships

- An **Artist** can have multiple **Albums**
- An **Artist** can have multiple **Songs**
- An **Album** can have multiple **Songs**
- A **Song** can belong to multiple **Genres** (Many-to-many relationship)

### Tables

#### Artist

| Column          | Type    | Description            |
| --------------- | ------- | ---------------------- |
| id              | UUID    | Primary Key            |
| name            | VARCHAR | Artist Name            |
| bio             | VARCHAR | Artist Biography       |
| profile_picture | VARCHAR | URL to Profile Picture |

#### Album

| Column       | Type    | Description          |
| ------------ | ------- | -------------------- |
| id           | UUID    | Primary Key          |
| title        | VARCHAR | Album Title          |
| release_date | DATE    | Date of Release      |
| cover_image  | VARCHAR | URL to Cover Image   |
| artistId     | UUID    | Foreign Key (Artist) |

#### Song

| Column     | Type    | Description          |
| ---------- | ------- | -------------------- |
| id         | UUID    | Primary Key          |
| title      | VARCHAR | Song Title           |
| duration   | INT     | Duration in seconds  |
| audio_file | VARCHAR | URL to Audio File    |
| albumId    | UUID    | Foreign Key (Album)  |
| artistId   | UUID    | Foreign Key (Artist) |

#### Genre

| Column | Type    | Description |
| ------ | ------- | ----------- |
| id     | UUID    | Primary Key |
| name   | VARCHAR | Genre Name  |

#### SongGenres

| Column  | Type | Description         |
| ------- | ---- | ------------------- |
| songId  | UUID | Foreign Key (Song)  |
| genreId | UUID | Foreign Key (Genre) |

## Database Relationships

- **Artist** to **Album**: One-to-many relationship
- **Artist** to **Song**: One-to-many relationship
- **Album** to **Song**: One-to-many relationship
- **Song** to **Genre**: Many-to-many relationship

## Run the Project

To start the development server:

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default.

Note: `GET /` is not implemented, so opening `http://localhost:3000/` in the browser will show `Cannot GET /`. Use the `/api/...` routes below.

## Postman Requests

Base URL:

```text
http://localhost:3000
```

### General Rules

- For `GET /:id` routes, the `id` path parameter is required.
- For song creation, the request must be `multipart/form-data` because `audioFile` is required.
- For artist, album, and genre creation, use `raw` JSON in Postman.
- Search routes accept query parameters. Because the validation middleware merges query and body, query parameters are the cleanest option for `GET` requests.

### Artists

#### Create artist

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

#### Get artist by id

- Method: `GET`
- URL: `http://localhost:3000/api/artists/:id`
- Required path param: `id`

Example:

```text
http://localhost:3000/api/artists/efb7647b-8450-4e27-b6d6-60c12e7f3560
```

#### Search artists by name

- Method: `GET`
- URL: `http://localhost:3000/api/artists/search?name=Frank`

Required query params:

- `name`: string, not empty, max 100 characters

### Albums

#### Create album

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

#### Get all albums

- Method: `GET`
- URL: `http://localhost:3000/api/albums`

#### Get album by id

- Method: `GET`
- URL: `http://localhost:3000/api/albums/:id`
- Required path param: `id`

### Genres

#### Create genre

- Method: `POST`
- URL: `http://localhost:3000/api/genres`
- Body type: `raw` JSON

Required fields:

- `name`: string, max 50 characters

Optional fields:

- none

Example body:

```json
{
	"name": "Jazz"
}
```

#### Get all genres

- Method: `GET`
- URL: `http://localhost:3000/api/genres`

#### Get genre by id

- Method: `GET`
- URL: `http://localhost:3000/api/genres/:id`
- Required path param: `id`

### Songs

#### Create song

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

- `title` is required, not optional.
- `artistId` is required, not optional.
- `audioFile` is required because the backend extracts the duration from the uploaded file.
- `duration` is not sent by the client. It is calculated from the uploaded audio file.
- uploaded song files are stored in Supabase Storage and the public file URL is saved in the `audioFile` column.

#### Get all songs

- Method: `GET`
- URL: `http://localhost:3000/api/songs`

#### Get song by id

- Method: `GET`
- URL: `http://localhost:3000/api/songs/:id`
- Required path param: `id`

#### Search songs by title

- Method: `GET`
- URL: `http://localhost:3000/api/songs/search?title=Moon`

Required query params:

- `title`: string, not empty, max 100 characters

### Quick Postman Test Order

1. Create a genre with `POST /api/genres`
2. Create an artist with `POST /api/artists`
3. Create an album with `POST /api/albums`
4. Create a song with `POST /api/songs`
5. Read data with `GET /api/songs`, `GET /api/artists`, `GET /api/albums`, and `GET /api/genres`

To build the project:

```bash
npm run build
```

To run production build:

```bash
npm start
```

## License

This project is licensed under the MIT License.
