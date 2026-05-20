import { Router } from 'express';
import { SongController } from '../controllers/song';
import { validateId } from '../middlewares/idValidator';
import { validateRequest } from '../middlewares/validateRequest';
import { SearchSongDto, CreateSongDto } from '../dto/song.dto';
import { validateAudioUpload } from '../middlewares/fileUpload';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();
const songController = new SongController();

router.post(
  '/',
  requireAdmin,
  validateAudioUpload.single('audioFile'),
  validateRequest(CreateSongDto),
  songController.create,
);

router.get('/', songController.getAll);
router.get(
  '/search',
  validateRequest(SearchSongDto),
  songController.searchByTitle,
);
router.get('/:id', validateId, songController.getById);
router.delete('/:id', requireAdmin, validateId, songController.delete);

export { router as songRouter };
