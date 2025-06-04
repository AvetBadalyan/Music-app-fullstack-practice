import { Router } from 'express';
import { SongController } from '../controllers/song';
import { validateId } from '../middlewares/idValidator';

const router = Router();
const songController = new SongController();

router.get('/', songController.getAll);

router.get('/:id', validateId, songController.getById);

export { router as songRouter };
