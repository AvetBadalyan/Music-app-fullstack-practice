import { AppDataSource } from '../data-source';
import { Album, Artist, Genre, Song } from './../entities';
import { albums, artists, genres, songs } from './seedData';

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully.');

    const genreRepo = AppDataSource.getRepository(Genre);
    const artistRepo = AppDataSource.getRepository(Artist);
    const albumRepo = AppDataSource.getRepository(Album);
    const songRepo = AppDataSource.getRepository(Song);

    console.log('Clearing existing data...');
    await AppDataSource.query(
      'TRUNCATE TABLE "song_genres_genre", "song", "album", "artist", "genre" RESTART IDENTITY CASCADE',
    );

    console.log('Seeding Genres...');
    await genreRepo.insert(genres);
    const insertedGenres = await genreRepo.find();

    console.log('Seeding Artists...');
    await artistRepo.insert(artists);
    const insertedArtists = await artistRepo.find();

    console.log('Seeding Albums...');
    const albumsWithArtists = albums.map(album => ({
      ...album,
      artist: insertedArtists.find(a => a.name === album.artist),
    }));
    await albumRepo.insert(albumsWithArtists);
    const insertedAlbums = await albumRepo.find();

    console.log('Seeding Songs...');
    const songsWithRelations = songs.map(song => ({
      ...song,
      artist: insertedArtists.find(a => a.name === song.artist),
      album: insertedAlbums.find(a => a.title === song.album),
      genres: insertedGenres.filter(g => song.genres.includes(g.name)),
    }));
    await songRepo.insert(songsWithRelations);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
