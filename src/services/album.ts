import { AppDataSource } from '../data-source';
import { Album } from '../entities/Album';
import { Artist } from '../entities/Artist';
import type { IAlbum } from '../types/album';
import type { CreateAlbumDto } from '../dto/album.dto';
import { CustomError, DatabaseError, NotFoundError } from '../utils/errors';

export class AlbumService {
  private albumRepository = AppDataSource.getRepository(Album);
  private artistRepository = AppDataSource.getRepository(Artist);

  public async create(albumData: CreateAlbumDto): Promise<IAlbum> {
    try {
      const artist = await this.artistRepository.findOne({
        where: { id: albumData.artistId },
      });

      if (!artist) {
        throw new NotFoundError(
          `Artist with ID ${albumData.artistId} not found`,
        );
      }

      const album = this.albumRepository.create(albumData);
      return await this.albumRepository.save(album);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new DatabaseError('Failed to create album');
    }
  }
}
