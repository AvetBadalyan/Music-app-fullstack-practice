import { ILike } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Song } from '../entities/Song';
import { Artist } from '../entities/Artist';
import { Album } from '../entities/Album';
import { Genre } from '../entities/Genre';
import { NotFoundError, DatabaseError, CustomError } from '../utils/errors';
import { supabaseStorage } from './supabaseStorage';
import type { ISong } from '../types/song';
import type { CreateSongDto } from '../dto/song.dto';
import type { Express } from 'express';

export class SongService {
  private songRepository = AppDataSource.getRepository(Song);
  private artistRepository = AppDataSource.getRepository(Artist);
  private albumRepository = AppDataSource.getRepository(Album);
  private genreRepository = AppDataSource.getRepository(Genre);

  public async create(
    songData: CreateSongDto,
    audioFile: Express.Multer.File,
    duration: number,
  ): Promise<ISong> {
    try {
      const artist = await this.artistRepository.findOne({
        where: { id: songData.artistId },
      });

      if (!artist) {
        throw new NotFoundError(
          `Artist with ID ${songData.artistId} not found`,
        );
      }

      let album: Album | undefined = undefined;
      if (songData.albumId) {
        const foundAlbum = await this.albumRepository.findOne({
          where: { id: songData.albumId },
        });

        if (!foundAlbum) {
          throw new NotFoundError(
            `Album with ID ${songData.albumId} not found`,
          );
        }
        album = foundAlbum;
      }

      let genres: Genre[] = [];
      if (songData.genreIds && songData.genreIds.length > 0) {
        genres = await this.genreRepository.findByIds(songData.genreIds);
        if (genres.length !== songData.genreIds.length) {
          throw new NotFoundError('One or more genres not found');
        }
      }

      // Only upload the file after all validations pass.

      const audioUrl = await supabaseStorage.uploadSongAudio({
        fileBuffer: audioFile.buffer,
        songTitle: songData.title,
        originalFileName: audioFile.originalname,
        mimeType: audioFile.mimetype,
      });

      const songCreateData: Partial<Song> = {
        title: songData.title,
        duration,
        audioFile: audioUrl,
        artist,
        genres,
      };

      if (album) {
        songCreateData.album = album;
      }

      const song = this.songRepository.create(songCreateData);
      const savedSong = (await this.songRepository.save(song)) as Song;

      return this.getById(savedSong.id);
    } catch (error) {
      console.error('SERVICE CREATE FAILED:', error);

      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to create song');
    }
  }

  public async getById(id: string): Promise<ISong> {
    const song = await this.songRepository.findOne({
      where: { id },
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

    if (!song) {
      throw new NotFoundError(`Song with ID ${id} not found`);
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

  public async delete(id: string): Promise<void> {
    try {
      const song = await this.songRepository.findOne({ where: { id } });

      if (!song) {
        throw new NotFoundError(`Song with ID ${id} not found`);
      }

      const { audioFile } = song;
      await this.songRepository.remove(song);

      if (audioFile) {
        try {
          await supabaseStorage.deleteByPublicUrl(audioFile);
        } catch (storageError) {
          // Row is gone; orphaned file is non-fatal. Log and move on.
          console.error(
            'Failed to delete audio file from storage:',
            storageError,
          );
        }
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete song');
    }
  }
}
