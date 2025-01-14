# Music App Database

This project is a backend API for a music app using TypeORM with PostgreSQL.

## Requirements

- Node.js
- TypeScript
- PostgreSQL
- TypeORM

## Setup Instructions

1. Install required dependencies:

   ```bash
   npm install
   ```

2. Create a PostgreSQL database named `music_app`:

   ```sql
   CREATE DATABASE music_app;
   ```

3. Add your database credentials in the `data-source.ts` file.

4. Run the migrations to set up the database schema:

   ```bash
   npx ts-node src/index.ts
   ```

5. The following tables are created:

   - **Artist**: Stores information about artists.
   - **Album**: Stores album information.
   - **Song**: Stores song information.
   - **Genre**: Stores genres.
   - **SongGenres**: Many-to-many relationship between songs and genres.

## Database Schema

The following is the relationship between the entities in the database:

- An **Artist** can have multiple **Albums** and **Songs**.
- An **Album** can have multiple **Songs**.
- A **Song** can belong to multiple **Genres** (Many-to-many relationship).

## Available Tables:

### Artist

| Column          | Type    | Description            |
| --------------- | ------- | ---------------------- |
| id              | UUID    | Primary Key            |
| name            | VARCHAR | Artist Name            |
| bio             | VARCHAR | Artist Biography       |
| profile_picture | VARCHAR | URL to Profile Picture |

### Album

| Column       | Type    | Description          |
| ------------ | ------- | -------------------- |
| id           | UUID    | Primary Key          |
| title        | VARCHAR | Album Title          |
| release_date | DATE    | Date of Release      |
| cover_image  | VARCHAR | URL to Cover Image   |
| artistId     | UUID    | Foreign Key (Artist) |

### Song

| Column     | Type    | Description          |
| ---------- | ------- | -------------------- |
| id         | UUID    | Primary Key          |
| title      | VARCHAR | Song Title           |
| duration   | INT     | Duration in seconds  |
| audio_file | VARCHAR | URL to Audio File    |
| albumId    | UUID    | Foreign Key (Album)  |
| artistId   | UUID    | Foreign Key (Artist) |

### Genre

| Column | Type    | Description |
| ------ | ------- | ----------- |
| id     | UUID    | Primary Key |
| name   | VARCHAR | Genre Name  |

### SongGenres

| Column  | Type | Description         |
| ------- | ---- | ------------------- |
| songId  | UUID | Foreign Key (Song)  |
| genreId | UUID | Foreign Key (Genre) |

## Database Relationships

- **Artist** to **Album**: One-to-many relationship.
- **Artist** to **Song**: One-to-many relationship.
- **Album** to **Song**: One-to-many relationship.
- **Song** to **Genre**: Many-to-many relationship.

## Run the Project

Run the project with the following command:

```bash
npx ts-node src/index.ts
```

This will establish a connection to the PostgreSQL database, create the required tables, and print a success message if everything is set up correctly.

## License

This project is licensed under the MIT License.
