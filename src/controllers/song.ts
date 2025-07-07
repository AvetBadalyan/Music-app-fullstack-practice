import type { Request, Response, NextFunction } from 'express';
import * as mm from 'music-metadata';
import { SongService } from '../services/song';
import type { ISong } from '../types/song';
import type { SearchSongDto, CreateSongDto } from '../dto/song.dto';

export class SongController {
  private songService: SongService;

  constructor() {
    this.songService = new SongService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const songData = req.validatedData as CreateSongDto;
      const audioFile = req.file;

      if (!audioFile) {
        res.status(400).json({ error: 'Audio file is required' });
        return;
      }

      let durationFromFile: number | undefined;

      try {
        const metadata = await mm.parseBuffer(
          audioFile.buffer,
          audioFile.mimetype,
        );
        const duration = metadata?.format?.duration;

        if (!duration || duration < 1) {
          res.status(400).json({
            error: 'Extracted audio duration is invalid or missing.',
          });
          return;
        }

        durationFromFile = Math.round(duration);
      } catch (parseError) {
        console.error('Failed to parse audio file:', parseError);
        res.status(400).json({
          error:
            'Failed to process audio file. It may be corrupted or unsupported.',
        });
        return;
      }

      const newSong: ISong = await this.songService.create(
        songData,
        audioFile,
        durationFromFile,
      );
      res.status(201).json(newSong);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const song: ISong = await this.songService.getById(req.params.id);
      res.json(song);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const songs: ISong[] = await this.songService.getAll();
      res.status(200).json(songs);
    } catch (error) {
      next(error);
    }
  };

  public searchByTitle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { title } = req.validatedData as SearchSongDto;
      const songs: ISong[] = await this.songService.searchByTitle(title);
      res.json(songs);
    } catch (error) {
      next(error);
    }
  };
}
