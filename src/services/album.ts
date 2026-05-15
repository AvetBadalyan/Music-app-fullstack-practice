import { AppDataSource } from '../data-source';
import { Album } from '../entities/Album';
import { Artist } from '../entities/Artist';
import type { IAlbum } from '../types/album';
import type { CreateAlbumDto } from '../dto/album.dto';
import { CustomError, DatabaseError, NotFoundError } from '../utils/errors';
import { SupabaseStorage } from './supabaseStorage';

export class AlbumService {
  private albumRepository = AppDataSource.getRepository(Album);
  private artistRepository = AppDataSource.getRepository(Artist);
  private supabaseStorage = new SupabaseStorage();

  public async create(
    albumData: CreateAlbumDto,
    coverImageFile?: Express.Multer.File,
  ): Promise<IAlbum> {
    try {
      const artist = await this.artistRepository.findOne({
        where: { id: albumData.artistId },
      });

      if (!artist) {
        throw new NotFoundError(
          `Artist with ID ${albumData.artistId} not found`,
        );
      }

      // Only upload the cover image after all validations pass.
      let coverImageUrl: string | undefined;
      if (coverImageFile) {
        coverImageUrl = await this.supabaseStorage.uploadAlbumCover({
          fileBuffer: coverImageFile.buffer,
          entityName: albumData.title,
          originalFileName: coverImageFile.originalname,
          mimeType: coverImageFile.mimetype,
        });
      }

      const album = this.albumRepository.create({
        ...albumData,
        artist,
        coverImage: coverImageUrl,
      });
      const savedAlbum = await this.albumRepository.save(album);

      return this.getById(savedAlbum.id);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to create album');
    }
  }

  public async getById(id: string): Promise<IAlbum> {
    try {
      const album = await this.albumRepository.findOne({
        where: { id },
        select: {
          id: true,
          title: true,
          releaseDate: true,
          coverImage: true,
          artist: {
            id: true,
            name: true,
          },
          songs: {
            id: true,
            title: true,
            duration: true,
            audioFile: true,
            artist: {
              id: true,
              name: true,
            },
            genres: {
              id: true,
              name: true,
            },
          },
        },
        relations: {
          artist: true,
          songs: {
            artist: true,
            genres: true,
          },
        },
      });

      if (!album) {
        throw new NotFoundError(`Album with ID ${id} not found`);
      }

      return album as IAlbum;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError(`Failed to retrieve album with ID ${id}`);
    }
  }

  public async getAll(): Promise<IAlbum[]> {
    try {
      const albums = await this.albumRepository.find({
        select: {
          id: true,
          title: true,
          releaseDate: true,
          coverImage: true,
          artist: {
            id: true,
            name: true,
          },
        },
        relations: {
          artist: true,
        },
      });

      return albums as IAlbum[];
    } catch (error) {
      throw new DatabaseError('Failed to retrieve albums');
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const album = await this.albumRepository.findOne({
        where: { id },
        relations: { songs: true },
      });

      if (!album) {
        throw new NotFoundError(`Album with ID ${id} not found`);
      }

      const storageUrls = [
        ...(album.songs ?? []).map((song) => song.audioFile),
        album.coverImage,
      ].filter((url): url is string => Boolean(url));

      // DB cascade (Song.album onDelete CASCADE) removes the songs rows.
      await this.albumRepository.remove(album);

      const results = await Promise.allSettled(
        storageUrls.map((url) => this.supabaseStorage.deleteByPublicUrl(url)),
      );
      results.forEach((r) => {
        if (r.status === 'rejected') {
          console.error('Failed to delete file from storage:', r.reason);
        }
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete album');
    }
  }
}
