import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { StorageError } from '../utils/errors'
import { buildStoragePath } from '../utils/storagePath'
import type { StorageConfig, UploadSongAudioInput } from '../types/supabase'

class SupabaseStorage {
    private readonly bucketName: string
    private readonly client: SupabaseClient

    constructor() {
        const config: StorageConfig = {
            projectUrl: process.env.SUPABASE_URL as string,
            secretKey: process.env.SUPABASE_SECRET_KEY as string,
            bucketName: process.env.SUPABASE_STORAGE_BUCKET as string
        }

        this.bucketName = config.bucketName
        this.client = createClient(config.projectUrl, config.secretKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })
    }

    async uploadSongAudio({
        fileBuffer,
        songTitle,
        originalFileName,
        mimeType
    }: UploadSongAudioInput): Promise<string> {
        const storagePath = buildStoragePath(songTitle, originalFileName)
        const bucketStorage = this.client.storage.from(this.bucketName)

        const { error } = await bucketStorage.upload(storagePath, fileBuffer, {
            contentType: mimeType,
            upsert: false
        })

        if (error) {
            throw new StorageError(
                `Failed to upload audio file: ${error.message}`
            )
        }

        const {
            data: { publicUrl: audioUrl }
        } = bucketStorage.getPublicUrl(storagePath)

        if (!audioUrl) {
            throw new StorageError(
                'Failed to retrieve URL for uploaded audio file'
            )
        }

        return audioUrl
    }
}

export const supabaseStorage = new SupabaseStorage()
