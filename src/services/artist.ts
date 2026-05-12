import { ILike } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Artist } from '../entities/Artist';
import { DatabaseError, NotFoundError } from '../utils/errors';
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
      select: {
        id: true,
        name: true,
        bio: true,
        profilePicture: true,
        albums: {
          id: true,
          title: true,
          coverImage: true,
          releaseDate: true,
        },
        songs: {
          id: true,
          title: true,
          duration: true,
          audioFile: true,
          album: {
            id: true,
            title: true,
          },
          genres: {
            id: true,
            name: true,
          },
        },
      },
      relations: {
        albums: true,
        songs: {
          album: true,
          genres: true,
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

  public async getAll(): Promise<IArtist[]> {
    try {
      const artists = await this.artistRepository.find({
        select: {
          id: true,
          name: true,
          bio: true,
          profilePicture: true,
        },
      });

      return artists as IArtist[];
    } catch (error) {
      throw new DatabaseError('Failed to retrieve artists');
    }
  }
}
