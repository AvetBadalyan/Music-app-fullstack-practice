import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { StorageError } from '../utils/errors';
import { buildStoragePath } from '../utils/storagePath';
import type { StorageConfig, UploadSongAudioInput } from '../types/supabase';

class SupabaseStorage {
  private readonly bucketName: string;
  private readonly client: SupabaseClient;

  constructor() {
    const config: StorageConfig = {
      projectUrl: process.env.SUPABASE_URL as string,
      secretKey: process.env.SUPABASE_SECRET_KEY as string,
      bucketName: process.env.SUPABASE_STORAGE_BUCKET as string,
    };

    this.bucketName = config.bucketName;
    this.client = createClient(config.projectUrl, config.secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async uploadSongAudio({
    fileBuffer,
    songTitle,
    originalFileName,
    mimeType,
  }: UploadSongAudioInput): Promise<string> {
    const storagePath = buildStoragePath(songTitle, originalFileName);
    const bucketStorage = this.client.storage.from(this.bucketName);

    const { error } = await bucketStorage.upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

    if (error) {
      throw new StorageError(`Failed to upload audio file: ${error.message}`);
    }

    const {
      data: { publicUrl: audioUrl },
    } = bucketStorage.getPublicUrl(storagePath);

    if (!audioUrl) {
      throw new StorageError('Failed to retrieve URL for uploaded audio file');
    }

    return audioUrl;
  }

  /**
   * Remove an object from the bucket by its public URL.
   * Silently ignores URLs that don't belong to this bucket (e.g. external
   * image URLs from other buckets) so deleting an entity never fails just
   * because an unrelated URL is stored on it.
   */
  async deleteByPublicUrl(publicUrl: string): Promise<void> {
    const marker = `/storage/v1/object/public/${this.bucketName}/`;
    const markerIndex = publicUrl.indexOf(marker);
    if (markerIndex === -1) return;

    const encodedPath = publicUrl.slice(markerIndex + marker.length);
    if (!encodedPath) return;

    let storagePath: string;
    try {
      storagePath = decodeURIComponent(encodedPath);
    } catch {
      storagePath = encodedPath;
    }

    const { error } = await this.client.storage
      .from(this.bucketName)
      .remove([storagePath]);

    if (error) {
      throw new StorageError(
        `Failed to delete storage object: ${error.message}`,
      );
    }
  }
}

export const supabaseStorage = new SupabaseStorage();
