import { Router } from 'express';
import {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
} from '../controllers/songController';

const router = Router();

router.get('/', getSongs); // Correct usage
router.get('/:id', getSong);
router.post('/', createSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;
