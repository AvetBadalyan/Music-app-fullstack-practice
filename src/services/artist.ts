import { ILike } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Artist } from '../entities/Artist';
import { CustomError, DatabaseError, NotFoundError } from '../utils/errors';
import { supabaseStorage } from './supabaseStorage';
import type { IArtist } from '../types/artist';
import type { CreateArtistDto } from '../dto/artist.dto';

export class ArtistService {
  private artistRepository = AppDataSource.getRepository(Artist);

  public async create(
    artistData: CreateArtistDto,
    profilePictureFile?: Express.Multer.File,
  ): Promise<Artist> {
    try {
      let profilePictureUrl: string | undefined;
      if (profilePictureFile) {
        profilePictureUrl = await supabaseStorage.uploadArtistImage({
          fileBuffer: profilePictureFile.buffer,
          entityName: artistData.name,
          originalFileName: profilePictureFile.originalname,
          mimeType: profilePictureFile.mimetype,
        });
      }

      const artist = this.artistRepository.create({
        ...artistData,
        profilePicture: profilePictureUrl,
      });
      return await this.artistRepository.save(artist);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to create artist');
    }
  }

  public async getById(id: string): Promise<IArtist> {
    const artist = await this.artistRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        bio: true,
        profilePicture: true,
        albums: {
          id: true,
          title: true,
          coverImage: true,
          releaseDate: true,
        },
        songs: {
          id: true,
          title: true,
          duration: true,
          audioFile: true,
          album: {
            id: true,
            title: true,
          },
          genres: {
            id: true,
            name: true,
          },
        },
      },
      relations: {
        albums: true,
        songs: {
          album: true,
          genres: true,
        },
      },
    });

    if (!artist) {
      throw new NotFoundError(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  public async searchByName(name: string): Promise<IArtist[]> {
    const artists = await this.artistRepository.find({
      where: { name: ILike(`%${name}%`) },
      relations: ['albums', 'songs'],
      select: {
        id: true,
        name: true,
        bio: true,
        profilePicture: true,
        albums: {
          id: true,
          title: true,
        },
        songs: {
          id: true,
          title: true,
        },
      },
    });

    return artists;
  }

  public async getAll(): Promise<IArtist[]> {
    try {
      const artists = await this.artistRepository.find({
        select: {
          id: true,
          name: true,
          bio: true,
          profilePicture: true,
        },
      });

      return artists as IArtist[];
    } catch (error) {
      throw new DatabaseError('Failed to retrieve artists');
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const artist = await this.artistRepository.findOne({
        where: { id },
        relations: { songs: true, albums: true },
      });

      if (!artist) {
        throw new NotFoundError(`Artist with ID ${id} not found`);
      }

      const storageUrls = [
        ...(artist.songs ?? []).map((song) => song.audioFile),
        ...(artist.albums ?? []).map((album) => album.coverImage),
        artist.profilePicture,
      ].filter((url): url is string => Boolean(url));

      // DB cascade removes albums (Album.artist CASCADE) and all songs
      // (Song.artist CASCADE), plus genre join rows.
      await this.artistRepository.remove(artist);

      const results = await Promise.allSettled(
        storageUrls.map((url) => supabaseStorage.deleteByPublicUrl(url)),
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
      throw new DatabaseError('Failed to delete artist');
    }
  }
}
