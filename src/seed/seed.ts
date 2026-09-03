import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';
import { SupabaseStorage } from '../services/supabaseStorage';
import { Album, Artist, Genre, Song } from './../entities';
import { albums, artists, genres, songs } from './seedData';

const assetDirectories = {
  audio: path.join(__dirname, 'mp3'),
  albumCovers: path.join(__dirname, 'album covers'),
  artistImages: path.join(__dirname, 'artists images'),
};

const mimeTypesByExtension: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

/**
 * Load a bundled fixture file into the shape the storage service expects.
 * `upsert` is on because seeding is re-runnable: uploading the same fixture
 * twice should overwrite one object, not fail or leave a second copy behind.
 */
const readAsset = (directory: string, fileName: string) => {
  const extension = path.extname(fileName).toLowerCase();
  const mimeType = mimeTypesByExtension[extension];

  if (!mimeType) {
    throw new Error(`Unsupported seed asset type: ${fileName}`);
  }

  return {
    fileBuffer: fs.readFileSync(path.join(directory, fileName)),
    originalFileName: fileName,
    mimeType,
    upsert: true,
  };
};

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully.');

    const genreRepo = AppDataSource.getRepository(Genre);
    const artistRepo = AppDataSource.getRepository(Artist);
    const albumRepo = AppDataSource.getRepository(Album);
    const songRepo = AppDataSource.getRepository(Song);
    const storage = new SupabaseStorage();

    // Upload before touching the database: a missing file or a storage outage
    // then fails while the existing rows are still intact, instead of leaving
    // the tables truncated and empty.
    console.log('Uploading artist images...');
    const artistUrls = await Promise.all(
      artists.map(artist =>
        storage.uploadArtistImage({
          ...readAsset(assetDirectories.artistImages, artist.profileImageFile),
          entityName: artist.name,
        }),
      ),
    );

    console.log('Uploading album covers...');
    const albumUrls = await Promise.all(
      albums.map(album =>
        storage.uploadAlbumCover({
          ...readAsset(assetDirectories.albumCovers, album.coverImageFile),
          entityName: album.title,
        }),
      ),
    );

    console.log('Uploading song audio...');
    const songUrls = await Promise.all(
      songs.map(song =>
        storage.uploadSongAudio({
          ...readAsset(assetDirectories.audio, song.audioFileName),
          // Matches SongService: audio is grouped by artist, not by song title.
          entityName: song.artist,
        }),
      ),
    );

    console.log('Clearing existing data...');
    await AppDataSource.query(
      'TRUNCATE TABLE "song_genres_genre", "song", "album", "artist", "genre" RESTART IDENTITY CASCADE',
    );

    console.log('Seeding Genres...');
    const insertedGenres = await genreRepo.save(genres);

    console.log('Seeding Artists...');
    const insertedArtists = await artistRepo.save(
      artists.map((artist, index) => ({
        name: artist.name,
        bio: artist.bio,
        profilePicture: artistUrls[index],
      })),
    );

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
    const albumsWithArtists = albums.map((album, index) => ({
      title: album.title,
      releaseDate: album.releaseDate,
      coverImage: albumUrls[index],
      artist: findArtistByName(album.artist),
    }));
    const insertedAlbums = await albumRepo.save(albumsWithArtists);

    const findAlbumByTitle = (albumTitle: string) => {
      const album = insertedAlbums.find(album => album.title === albumTitle);
      if (!album) throw new Error(`Missing seeded album: ${albumTitle}`);
      return album;
    };

    console.log('Seeding Songs...');
    const songsWithRelations = songs.map((song, index) => ({
      title: song.title,
      duration: song.duration,
      audioFile: songUrls[index],
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
