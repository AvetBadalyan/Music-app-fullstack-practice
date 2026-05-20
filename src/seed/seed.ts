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
    const insertedGenres = await genreRepo.save(genres);

    console.log('Seeding Artists...');
    const insertedArtists = await artistRepo.save(artists);

    const findArtistByName = (artistName: string) => {
      const artist = insertedArtists.find(artist => artist.name === artistName);
      if (!artist) throw new Error(`Missing seeded artist: ${artistName}`);
      return artist;
    };

    const findGenresByName = (genreNames: string[]) => {
      const matchedGenres = insertedGenres.filter(genre =>
        genreNames.includes(genre.name),
      );

      if (matchedGenres.length !== genreNames.length) {
        throw new Error(`Missing seeded genres: ${genreNames.join(', ')}`);
      }

      return matchedGenres;
    };

    console.log('Seeding Albums...');
    const albumsWithArtists = albums.map(album => ({
      ...album,
      artist: findArtistByName(album.artist),
    }));
    const insertedAlbums = await albumRepo.save(albumsWithArtists);

    const findAlbumByTitle = (albumTitle: string) => {
      const album = insertedAlbums.find(album => album.title === albumTitle);
      if (!album) throw new Error(`Missing seeded album: ${albumTitle}`);
      return album;
    };

    console.log('Seeding Songs...');
    const songsWithRelations = songs.map(song => ({
      ...song,
      artist: findArtistByName(song.artist),
      album: findAlbumByTitle(song.album),
      genres: findGenresByName(song.genres),
    }));
    await songRepo.save(songsWithRelations);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
