import { Request, Response } from 'express';
import { Artist } from '../entities/Artist';
import { AppDataSource } from '../../data-source';

// Get all artists
export const getArtists = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const artists = await AppDataSource.getRepository(Artist).find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
};

// Get a single artist by ID
export const getArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const artist = await AppDataSource.getRepository(Artist).findOneBy({ id });

    if (!artist) {
      res.status(404).json({ error: 'Artist not found' });
      return;
    }

    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
};

// Create a new artist
export const createArtist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, bio, profile_picture } = req.body;

    const artist = new Artist();
    artist.name = name;
    artist.bio = bio;
    artist.profile_picture = profile_picture;

    const savedArtist = await AppDataSource.getRepository(Artist).save(artist);
    res.status(201).json(savedArtist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create artist' });
  }
};

// Update an artist
export const updateArtist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, bio, profile_picture } = req.body;

    const artist = await AppDataSource.getRepository(Artist).findOneBy({ id });
    if (!artist) {
      res.status(404).json({ error: 'Artist not found' });
      return;
    }

    artist.name = name;
    artist.bio = bio;
    artist.profile_picture = profile_picture;

    const updatedArtist = await AppDataSource.getRepository(Artist).save(
      artist,
    );
    res.status(200).json(updatedArtist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update artist' });
  }
};

// Delete an artist
export const deleteArtist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const artist = await AppDataSource.getRepository(Artist).findOneBy({ id });
    if (!artist) {
      res.status(404).json({ error: 'Artist not found' });
      return;
    }

    await AppDataSource.getRepository(Artist).remove(artist);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete artist' });
  }
};
