import type { ISong } from './song';

export interface IAlbum {
  id: string;
  title: string;
  releaseDate?: string;
  coverImage?: string;
  artist?: {
    id: string;
    name: string;
  };
  songs?: ISong[];
}
