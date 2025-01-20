import { Request, Response } from 'express';
import { Genre } from '../entities/Genre';
import { AppDataSource } from '../../data-source';

// Get all genres
export const getGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await AppDataSource.getRepository(Genre).find();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

// Get a single genre by ID
export const getGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const genre = await AppDataSource.getRepository(Genre).findOneBy({ id });

    if (!genre) {
      res.status(404).json({ error: 'Genre not found' });
      return;
    }

    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genre' });
  }
};

// Create a new genre
export const createGenre = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;

    const genre = new Genre();
    genre.name = name;

    const savedGenre = await AppDataSource.getRepository(Genre).save(genre);
    res.status(201).json(savedGenre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create genre' });
  }
};

// Update a genre
export const updateGenre = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const genre = await AppDataSource.getRepository(Genre).findOneBy({ id });
    if (!genre) {
      res.status(404).json({ error: 'Genre not found' });
      return;
    }

    genre.name = name;
    const updatedGenre = await AppDataSource.getRepository(Genre).save(genre);
    res.status(200).json(updatedGenre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update genre' });
  }
};

// Delete a genre
export const deleteGenre = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const genre = await AppDataSource.getRepository(Genre).findOneBy({ id });
    if (!genre) {
      res.status(404).json({ error: 'Genre not found' });
      return;
    }

    await AppDataSource.getRepository(Genre).remove(genre);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete genre' });
  }
};
