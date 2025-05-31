import { ILike } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Artist } from '../entities/Artist';
import { NotFoundError } from '../utils/errors';
import type { IArtist } from '../types/artist';
import type { CreateArtistDto } from '../dto/artist.dto';

export class ArtistService {
  private artistRepository = AppDataSource.getRepository(Artist);

  public async create(artistData: CreateArtistDto): Promise<Artist> {
    try {
      const artist = this.artistRepository.create(artistData);
      return await this.artistRepository.save(artist);
    } catch (error) {
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
        profilePicture: true,
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
        profilePicture: true,
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
