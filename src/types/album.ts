export interface IAlbum {
  id: string;
  title: string;
  release_date?: string;
  cover_image?: string;
  artist?: {
    id: string;
    name: string;
  };
  songs?: {
    id: string;
    title: string;
  }[];
}
