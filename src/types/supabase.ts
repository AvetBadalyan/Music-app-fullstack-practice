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
  /**
   * Overwrite an object already at the same storage path. Off by default so a
   * user upload can never clobber existing media; the seed script turns it on
   * because it is expected to be re-runnable.
   */
  upsert?: boolean;
};
