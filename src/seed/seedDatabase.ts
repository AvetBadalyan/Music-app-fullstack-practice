import { AppDataSource } from '../../data-source'; 
import {
  createGenres,
  createArtists,
  createAlbums,
  createSongs,
} from './seedHelpers';
import { genres, artists, albums, songs } from './seedData';
import { Album, Artist, Genre } from '../entities';

async function seedDatabase() {
  try {
    const dataSource = await AppDataSource.initialize();
    console.log('Database connection initialized.');

    console.log('Seeding genres...');
    const genreEntities = await createGenres(dataSource, genres);
    console.log(`Created ${genreEntities.length} genres.`);

    console.log('Seeding artists...');
    const artistEntities = await createArtists(dataSource, artists);
    console.log(`Created ${artistEntities.length} artists.`);

    console.log('Seeding albums...');
    const albumEntities = await createAlbums(
      dataSource,
      albums.map(album => ({
        ...album,
        artist: artistEntities.find(
          (artist:Artist) => artist.name === album.artistName,
        )!,
      })),
    );
    console.log(`Created ${albumEntities.length} albums.`);

    console.log('Seeding songs...');
    const songEntities = await createSongs(
      dataSource,
      songs.map(song => ({
        ...song,
        album: albumEntities.find((album:Album) => album.title === song.albumTitle)!,
        artist: artistEntities.find((artist:Artist) => artist.name === song.artistName)!,
        genres: genreEntities.filter((genre: Genre) =>
          song.genreNames.includes(genre.name),
        ),
      })),
    );
    console.log(`Created ${songEntities.length} songs.`);

    console.log('Database seeded successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
