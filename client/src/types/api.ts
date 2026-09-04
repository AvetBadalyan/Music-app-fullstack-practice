/**
 * Shapes the API returns - the mirror of `src/types/api.ts` on the server.
 *
 * Relations are optional because each endpoint selects only the ones it needs:
 * `GET /albums` returns an album with its artist, `GET /albums/:id` also
 * returns its songs. Columns that are always selected stay required, and
 * nullable columns are `null` rather than absent.
 */

/** An artist reduced to what a link needs. */
export interface IArtistRef {
  id: string;
  name: string;
}

/** An album reduced to what a link needs. */
export interface IAlbumRef {
  id: string;
  title: string;
}

export interface IGenre {
  id: string;
  name: string;
  songs?: ISong[];
}

export interface ISong {
  id: string;
  title: string;
  duration: number;
  audioFile: string | null;
  artist?: IArtistRef;
  album?: IAlbumRef | null;
  genres?: IGenre[];
}

export interface IAlbum {
  id: string;
  title: string;
  releaseDate: string | null;
  coverImage: string | null;
  artist?: IArtistRef;
  songs?: ISong[];
}

export interface IArtist {
  id: string;
  name: string;
  bio: string | null;
  profilePicture: string | null;
  albums?: IAlbum[];
  songs?: ISong[];
}
