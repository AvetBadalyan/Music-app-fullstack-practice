import { AppDataSource } from '../data-source';
import { Genre } from '../entities/Genre';
import type { IGenre } from '../types/genre';
import type { CreateGenreDto } from '../dto/genre.dto';
import { NotFoundError } from '../utils/errors';

export class GenreService {
  private genreRepository = AppDataSource.getRepository(Genre);

  public async create(genreData: CreateGenreDto): Promise<IGenre> {
    const genre = this.genreRepository.create(genreData);
    const savedGenre = await this.genreRepository.save(genre);

    return this.getById(savedGenre.id);
  }

  public async getById(id: string): Promise<IGenre> {
    const genre = await this.genreRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        songs: {
          id: true,
          title: true,
          duration: true,
          artist: {
            id: true,
            name: true,
          },
          album: {
            id: true,
            title: true,
          },
        },
      },
      relations: {
        songs: {
          artist: true,
          album: true,
        },
      },
    });

    if (!genre) {
      throw new NotFoundError(`Genre with ID ${id} not found`);
    }

    return genre as IGenre;
  }

  public async getAll(): Promise<IGenre[]> {
    const genres = await this.genreRepository.find({
      select: {
        id: true,
        name: true,
      },
    });

    return genres as IGenre[];
  }

  public async delete(id: string): Promise<void> {
    const genre = await this.genreRepository.findOne({ where: { id } });

    if (!genre) {
      throw new NotFoundError(`Genre with ID ${id} not found`);
    }

    // Many-to-many join rows in genres_songs are removed automatically.
    // Songs themselves are unaffected.
    await this.genreRepository.remove(genre);
  }
}
