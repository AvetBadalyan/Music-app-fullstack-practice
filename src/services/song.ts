import { ILike } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Song } from '../entities/Song';
import { NotFoundError, DatabaseError, CustomError } from '../utils/errors';
import type { ISong } from '../types/song';

export class SongService {
  private songRepository = AppDataSource.getRepository(Song);

  public async getById(id: string): Promise<ISong> {
    const song = await this.songRepository.findOne({
      where: { id },
      relations: ['album', 'artist'],
      select: {
        id: true,
        title: true,
        album: {
          id: true,
          title: true,
        },
        artist: {
          id: true,
          name: true,
        },
      },
    });

    if (!song) {
      throw new NotFoundError(`Song with ID ${id} not found`);
    } else {
      console.log(song, 'song');
    }

    return song;
  }

  public async getAll(): Promise<ISong[]> {
    try {
      const songs = await this.songRepository.find({
        relations: ['album', 'artist', 'genres'],
        select: {
          id: true,
          title: true,
          duration: true,
          audioFile: true,
          album: {
            id: true,
            title: true,
          },
          artist: {
            id: true,
            name: true,
          },
          genres: {
            id: true,
            name: true,
          },
        },
      });

      return songs as ISong[];
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to retrieve songs');
    }
  }

  public async searchByTitle(title: string): Promise<ISong[]> {
    const songs = await this.songRepository.find({
      where: { title: ILike(`%${title}%`) },
      relations: ['album', 'artist', 'genres'],
      select: {
        id: true,
        title: true,
        duration: true,
        audioFile: true,
        album: {
          id: true,
          title: true,
        },
        artist: {
          id: true,
          name: true,
        },
        genres: {
          id: true,
          name: true,
        },
      },
    });

    return songs;
  }
}
