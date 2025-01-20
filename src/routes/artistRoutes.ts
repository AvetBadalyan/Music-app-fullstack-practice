import { Router } from 'express';
import {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
} from '../controllers/artistController';

const router = Router();

router.get('/', getArtists);
router.get('/:id', getArtist);
router.post('/', createArtist);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

export default router; // Default export
