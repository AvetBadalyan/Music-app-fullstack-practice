# Music App Database

This project is a backend API for a music app using TypeORM with PostgreSQL.

## Requirements

- Node.js
- TypeScript
- PostgreSQL
- TypeORM

## Setup Instructions

### 1. Install required dependencies

```bash
npm install
```

### 2. Create a PostgreSQL database named `music_app`

You can create it using pgAdmin or run:

```sql
CREATE DATABASE music_app;
```

### 3. Configure Environment Variables

Make sure your `.env` file (or `data-source.ts`) contains the correct database credentials:

```env
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=music_app
DB_PORT=5432
```

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
