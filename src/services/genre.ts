import { AppDataSource } from '../data-source';
import { Genre } from '../entities/Genre';
import type { IGenre } from '../types/genre';
import type { CreateGenreDto } from '../dto/genre.dto';
import { CustomError, DatabaseError, NotFoundError } from '../utils/errors';

export class GenreService {
  private genreRepository = AppDataSource.getRepository(Genre);

  public async create(genreData: CreateGenreDto): Promise<IGenre> {
    try {
      const genre = this.genreRepository.create(genreData);
      const savedGenre = await this.genreRepository.save(genre);

      return this.getById(savedGenre.id);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to create genre');
    }
  }

  public async getById(id: string): Promise<IGenre> {
    try {
      const genre = await this.genreRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          songs: {
            id: true,
            title: true,
          },
        },
        relations: {
          songs: true,
        },
      });

      if (!genre) {
        throw new NotFoundError(`Genre with ID ${id} not found`);
      }

      return genre as IGenre;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError(`Failed to retrieve genre with ID ${id}`);
    }
  }

  public async getAll(): Promise<IGenre[]> {
    try {
      const genres = await this.genreRepository.find({
        select: {
          id: true,
          name: true,
        },
      });

      return genres as IGenre[];
    } catch (error) {
      throw new DatabaseError('Failed to retrieve genres');
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const genre = await this.genreRepository.findOne({ where: { id } });

      if (!genre) {
        throw new NotFoundError(`Genre with ID ${id} not found`);
      }

      // Many-to-many join rows in genres_songs are removed automatically.
      // Songs themselves are unaffected.
      await this.genreRepository.remove(genre);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete genre');
    }
  }
}
