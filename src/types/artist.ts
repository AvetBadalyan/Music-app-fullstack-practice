import { IAlbum } from './album';
import type { ISong } from './song';

export interface IArtist {
  id: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  albums?: IAlbum[];
  songs?: ISong[];
}
