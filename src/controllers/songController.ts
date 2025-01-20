import { Request, Response } from 'express';
import { Song } from '../entities/Song';
import { AppDataSource } from '../../data-source';

// Get all songs
export const getSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const songs = await AppDataSource.getRepository(Song).find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};

// Get a single song by ID
export const getSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const song = await AppDataSource.getRepository(Song).findOneBy({ id });

    if (!song) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch song' });
  }
};

// Create a new song
export const createSong = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, artist, album, duration } = req.body;

    const song = new Song();
    song.title = title;
    song.artist = artist;
    song.album = album;
    song.duration = duration;

    const savedSong = await AppDataSource.getRepository(Song).save(song);
    res.status(201).json(savedSong);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create song' });
  }
};

// Update a song
export const updateSong = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, artist, album, duration } = req.body;

    const song = await AppDataSource.getRepository(Song).findOneBy({ id });
    if (!song) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }

    song.title = title;
    song.artist = artist;
    song.album = album;
    song.duration = duration;

    const updatedSong = await AppDataSource.getRepository(Song).save(song);
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update song' });
  }
};

// Delete a song
export const deleteSong = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const song = await AppDataSource.getRepository(Song).findOneBy({ id });
    if (!song) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }

    await AppDataSource.getRepository(Song).remove(song);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
};
