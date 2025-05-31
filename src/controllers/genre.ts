import type { Request, Response, NextFunction } from 'express';
import type { IGenre } from '../types/genre';
import { GenreService } from '../services/genre';
import { CreateGenreDto } from '../dto/genre.dto';

export class GenreController {
  private genreService: GenreService;

  constructor() {
    this.genreService = new GenreService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const genreData = req.validatedData as CreateGenreDto;
      const newGenre: IGenre = await this.genreService.create(genreData);
      res.status(201).json(newGenre);
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
      const genre: IGenre = await this.genreService.getById(id);
      res.status(200).json(genre);
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
      const genres: IGenre[] = await this.genreService.getAll();
      res.status(200).json(genres);
    } catch (error) {
      next(error);
    }
  };
}
