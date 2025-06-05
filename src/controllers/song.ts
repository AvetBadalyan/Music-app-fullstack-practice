import type { Request, Response, NextFunction } from 'express';
import { SongService } from '../services/song';
import type { ISong } from '../types/song';

export class SongController {
  private songService: SongService;

  constructor() {
    this.songService = new SongService();
  }

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
}
