import { DataSource } from 'typeorm';
import { Genre, Artist, Album, Song } from '../entities';

export async function createGenres(dataSource: any, names: string[]) {
  const genres = [];
  for (const name of names) {
    const existingGenre = await dataSource.manager.findOne(Genre, {
      where: { name },
    });
    if (!existingGenre) {
      const genre = new Genre();
      genre.name = name;
      genres.push(genre);
    }
  }
  if (genres.length > 0) {
    await dataSource.manager.save(genres);
  }
  return dataSource.manager.find(Genre);
}

export async function createArtists(
  dataSource: any,
  artistsData: { name: string; bio: string; profile_picture: string }[],
) {
  const artists = [];
  for (const data of artistsData) {
    const existingArtist = await dataSource.manager.findOne(Artist, {
      where: { name: data.name },
    });
    if (!existingArtist) {
      const artist = new Artist();
      artist.name = data.name;
      artist.bio = data.bio;
      artist.profile_picture = data.profile_picture;
      artists.push(artist);
    }
  }
  if (artists.length > 0) {
    await dataSource.manager.save(artists);
  }
  return dataSource.manager.find(Artist);
}

export async function createAlbums(
  dataSource: any,
  albumsData: {
    title: string;
    release_date: string;
    cover_image: string;
    artist: Artist;
  }[],
) {
  const albums = [];
  for (const data of albumsData) {
    const existingAlbum = await dataSource.manager.findOne(Album, {
      where: { title: data.title, artist: data.artist },
    });
    if (!existingAlbum) {
      const album = new Album();
      album.title = data.title;
      album.release_date = data.release_date;
      album.cover_image = data.cover_image;
      album.artist = data.artist;
      albums.push(album);
    }
  }
  if (albums.length > 0) {
    await dataSource.manager.save(albums);
  }
  return dataSource.manager.find(Album);
}

export async function createSongs(
  dataSource: any,
  songsData: {
    title: string;
    duration: number;
    audio_file: string;
    album: Album;
    artist: Artist;
    genres: Genre[];
  }[],
) {
  const songs = [];
  for (const data of songsData) {
    const existingSong = await dataSource.manager.findOne(Song, {
      where: { title: data.title, album: data.album, artist: data.artist },
    });
    if (!existingSong) {
      const song = new Song();
      song.title = data.title;
      song.duration = data.duration;
      song.audio_file = data.audio_file;
      song.album = data.album;
      song.artist = data.artist;
      song.genres = data.genres;
      songs.push(song);
    }
  }
  if (songs.length > 0) {
    await dataSource.manager.save(songs);
  }
  return dataSource.manager.find(Song); 
}
