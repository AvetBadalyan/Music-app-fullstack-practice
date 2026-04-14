export type StorageConfig = {
  projectUrl: string;
  secretKey: string;
  bucketName: string;
};

export type UploadSongAudioInput = {
  fileBuffer: Buffer;
  songTitle: string;
  originalFileName: string;
  mimeType: string;
};
