import { Router } from 'express';
import { SongController } from '../controllers/song';
import { validateId } from '../middlewares/idValidator';
import { validateRequest } from '../middlewares/validateRequest';
import { SearchSongDto } from '../dto/song.dto';

const router = Router();
const songController = new SongController();

router.get('/', songController.getAll);
router.get(
  '/search',
  validateRequest(SearchSongDto),
  songController.searchByTitle,
);
router.get('/:id', validateId, songController.getById);

export { router as songRouter };
