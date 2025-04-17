import type { Request, Response, NextFunction } from 'express';
import { AlbumService } from '../services/album';
import type { IAlbum } from '../types/album';
import { CreateAlbumDto } from '../dto/album.dto';

export class AlbumController {
  private albumService: AlbumService;

  constructor() {
    this.albumService = new AlbumService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const albumData = req.validatedData as CreateAlbumDto;
      const newAlbum: IAlbum = await this.albumService.create(albumData);
      res.status(201).json(newAlbum);
    } catch (error) {
      next(error);
    }
  };
}
