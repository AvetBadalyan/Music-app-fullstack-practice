import { Router } from 'express';
import {
  getGenres,
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genreController';

const router = Router();

router.get('/', getGenres);
router.get('/:id', getGenre);
router.post('/', createGenre);
router.put('/:id', updateGenre);
router.delete('/:id', deleteGenre);

export default router;
