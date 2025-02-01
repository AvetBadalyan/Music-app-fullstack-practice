import { AppDataSource } from '../data-source';
import { Song } from '../entities/Song';
import { NotFoundError } from '../utils/errors';
import type { ISong } from '../types/song';

export class SongService {
  private songRepository = AppDataSource.getRepository(Song);

  public async getById(id: string): Promise<ISong> {
    const song = await this.songRepository.findOne({
      where: { id },
      relations: ['album', 'artist'],
      select: {
        id: true,
        title: true,
        album: {
          id: true,
          title: true,
        },
        artist: {
          id: true,
          name: true,
        },
      },
    });

    if (!song) {
      throw new NotFoundError(`Song with ID ${id} not found`);
    } else {
      console.log(song, 'song');
    }

    return song;
  }
}
