import { ILike } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Artist } from '../entities/Artist';
import { NotFoundError, ValidationError } from '../utils/errors';
import type { IArtist } from '../types/artist';
import type { CreateArtistDto } from '../dto/artist.dto';

export class ArtistService {
  private artistRepository = AppDataSource.getRepository(Artist);

  public async create(artistData: CreateArtistDto): Promise<IArtist> {
    try {
      const existingArtist = await this.artistRepository.findOne({
        where: { name: artistData.name },
      });

      if (existingArtist) {
        throw new ValidationError(
          `Artist with name ${artistData.name} already exists`,
        );
      }

      const artist = this.artistRepository.create(artistData);
      const savedArtist = await this.artistRepository.save(artist);

      return this.getById(savedArtist.id);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Failed to create artist');
    }
  }

  public async getById(id: string): Promise<IArtist> {
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: ['albums', 'songs'],
      select: {
        id: true,
        name: true,
        bio: true,
        profile_picture: true,
        albums: {
          id: true,
          title: true,
        },
        songs: {
          id: true,
          title: true,
        },
      },
    });

    if (!artist) {
      throw new NotFoundError(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  public async searchByName(name: string): Promise<IArtist[]> {
    const artists = await this.artistRepository.find({
      where: { name: ILike(`%${name}%`) },
      relations: ['albums', 'songs'],
      select: {
        id: true,
        name: true,
        bio: true,
        profile_picture: true,
        albums: {
          id: true,
          title: true,
        },
        songs: {
          id: true,
          title: true,
        },
      },
    });

    return artists;
  }
}
