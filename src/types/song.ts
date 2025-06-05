import { IGenre } from './genre';

export interface ISong {
  id: string;
  title: string;
  duration?: number;
  audioFile?: string;
  album?: {
    id: string;
    title: string;
  };
  artist: {
    id: string;
    name: string;
  };
  genres?: IGenre[];
}
