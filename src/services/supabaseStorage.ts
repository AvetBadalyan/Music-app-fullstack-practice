import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { StorageError } from '../utils/errors';
import { buildStoragePath } from '../utils/storagePath';
import type { StorageConfig, UploadFileInput } from '../types/supabase';

class SupabaseStorage {
  private readonly buckets: StorageConfig['buckets'];
  private readonly client: SupabaseClient;

  constructor() {
    const config: StorageConfig = {
      projectUrl: process.env.SUPABASE_URL as string,
      secretKey: process.env.SUPABASE_SECRET_KEY as string,
      buckets: {
        songs: process.env.SUPABASE_SONGS_BUCKET as string,
        albumCovers: process.env.SUPABASE_ALBUM_COVERS_BUCKET as string,
        artistImages: process.env.SUPABASE_ARTIST_IMAGES_BUCKET as string,
      },
    };

    this.buckets = config.buckets;
    this.client = createClient(config.projectUrl, config.secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Upload a file to the given bucket and return its public URL.
   * Generic helper used by all bucket-specific upload methods below.
   */
  private async uploadToBucket(
    bucketName: string,
    { fileBuffer, entityName, originalFileName, mimeType }: UploadFileInput,
  ): Promise<string> {
    const storagePath = buildStoragePath(entityName, originalFileName);
    const bucketStorage = this.client.storage.from(bucketName);

    const { error } = await bucketStorage.upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

    if (error) {
      throw new StorageError(`Failed to upload file: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = bucketStorage.getPublicUrl(storagePath);

    if (!publicUrl) {
      throw new StorageError('Failed to retrieve URL for uploaded file');
    }

    return publicUrl;
  }

  uploadSongAudio(input: UploadFileInput): Promise<string> {
    return this.uploadToBucket(this.buckets.songs, input);
  }

  uploadAlbumCover(input: UploadFileInput): Promise<string> {
    return this.uploadToBucket(this.buckets.albumCovers, input);
  }

  uploadArtistImage(input: UploadFileInput): Promise<string> {
    return this.uploadToBucket(this.buckets.artistImages, input);
  }

  /**
   * Remove an object from storage by its public URL. Checks each known
   * bucket marker so it works for songs, album covers, and artist images.
   * Silently ignores URLs that don't belong to any of our buckets (e.g.
   * external image URLs).
   */
  async deleteByPublicUrl(publicUrl: string): Promise<void> {
    for (const bucketName of Object.values(this.buckets)) {
      const bucketUrlPrefix = `/storage/v1/object/public/${bucketName}/`;
      const prefixIndex = publicUrl.indexOf(bucketUrlPrefix);
      if (prefixIndex === -1) continue;

      const encodedPath = publicUrl.slice(prefixIndex + bucketUrlPrefix.length);
      if (!encodedPath) return;

      let storagePath: string;
      try {
        storagePath = decodeURIComponent(encodedPath);
      } catch {
        storagePath = encodedPath;
      }

      const { error } = await this.client.storage
        .from(bucketName)
        .remove([storagePath]);

      if (error) {
        throw new StorageError(
          `Failed to delete storage object: ${error.message}`,
        );
      }
      return;
    }
    // URL doesn't belong to any of our buckets — no-op.
  }
}

export const supabaseStorage = new SupabaseStorage();
