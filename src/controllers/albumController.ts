import { Request, Response } from 'express';
import { Album } from '../entities/Album';
import { AppDataSource } from '../../data-source';

// Get all albums
export const getAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await AppDataSource.getRepository(Album).find();
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
};

// Get a single album by ID
export const getAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const album = await AppDataSource.getRepository(Album).findOneBy({ id });

    if (!album) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }

    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch album' });
  }
};

// Create a new album
export const createAlbum = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, artist, releaseDate } = req.body;

    const album = new Album();
    album.title = title;
    album.artist = artist;
    album.release_date = releaseDate;

    const savedAlbum = await AppDataSource.getRepository(Album).save(album);
    res.status(201).json(savedAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create album' });
  }
};

// Update an album
export const updateAlbum = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, artist, releaseDate } = req.body;

    const album = await AppDataSource.getRepository(Album).findOneBy({ id });
    if (!album) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }

    album.title = title;
    album.artist = artist;
    album.release_date = releaseDate;

    const updatedAlbum = await AppDataSource.getRepository(Album).save(album);
    res.status(200).json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update album' });
  }
};

// Delete an album
export const deleteAlbum = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const album = await AppDataSource.getRepository(Album).findOneBy({ id });
    if (!album) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }

    await AppDataSource.getRepository(Album).remove(album);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete album' });
  }
};
