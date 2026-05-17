export type StorageConfig = {
  projectUrl: string;
  secretKey: string;
  buckets: {
    songs: string;
    albumCovers: string;
    artistImages: string;
  };
};

export type UploadFileInput = {
  fileBuffer: Buffer;
  /** Display name of the entity owning the file (song title, album title, artist name). */
  entityName: string;
  originalFileName: string;
  mimeType: string;
};
