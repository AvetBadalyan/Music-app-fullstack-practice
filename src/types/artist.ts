import { IAlbum } from './album';
import type { ISong } from './song';

export interface IArtist {
  id: string;
  name: string;
  bio?: string;
  profile_picture?: string;
  albums?: IAlbum[];
  songs?: ISong[];
}
