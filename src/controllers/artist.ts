import type { Request, Response, NextFunction } from 'express';
import { ArtistService } from '../services/artist';
import type { IArtist } from '../types/artist';
import type { CreateArtistDto, SearchArtistDto } from '../dto/artist.dto';

export class ArtistController {
  private artistService: ArtistService;

  constructor() {
    this.artistService = new ArtistService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const artistData = req.validatedData as CreateArtistDto;
      const newArtist: IArtist = await this.artistService.create(artistData);
      res.status(201).json(newArtist);
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
      const artist: IArtist = await this.artistService.getById(req.params.id);
      res.json(artist);
    } catch (error) {
      next(error);
    }
  };

  public searchByName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name } = req.validatedData as SearchArtistDto;
      const artists: IArtist[] = await this.artistService.searchByName(name);
      res.json(artists);
    } catch (error) {
      next(error);
    }
  };
}
