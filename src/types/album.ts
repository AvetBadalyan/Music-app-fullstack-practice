export interface IAlbum {
  id: string;
  title: string;
  releaseDate?: string;
  coverImage?: string;
  artist?: {
    id: string;
    name: string;
  };
  songs?: {
    id: string;
    title: string;
  }[];
}
