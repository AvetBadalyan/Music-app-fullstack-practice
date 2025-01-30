export interface ISong {
  id: string;
  title: string;
  album: {
    title: string;
  };
  artist: {
    name: string;
  };
}
