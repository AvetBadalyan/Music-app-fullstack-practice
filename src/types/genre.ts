import type { ISong } from './song';

export interface IGenre {
  id: string;
  name: string;
  songs?: ISong[];
}
