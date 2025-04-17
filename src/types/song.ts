import { IGenre } from './genre';

export interface ISong {
  id: string;
  title: string;
  duration?: number;
  audio_file?: string;
  album: {
    title: string;
  };
  artist: {
    name: string;
  };
  genres?: IGenre[];
}
