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

  public getById = async (
    { params: { id } }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const album: IAlbum = await this.albumService.getById(id);
      res.status(200).json(album);
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
      const albums: IAlbum[] = await this.albumService.getAll();
      res.status(200).json(albums);
    } catch (error) {
      next(error);
    }
  };
}
