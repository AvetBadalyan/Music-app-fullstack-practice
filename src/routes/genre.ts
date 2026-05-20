import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { validateId } from '../middlewares/idValidator';
import { CreateGenreDto } from '../dto/genre.dto';
import { GenreController } from '../controllers/genre';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();
const genreController = new GenreController();

router.post(
	'/',
	requireAdmin,
	validateRequest(CreateGenreDto),
	genreController.create,
);
router.get('/', genreController.getAll);
router.get('/:id', validateId, genreController.getById);
router.delete('/:id', requireAdmin, validateId, genreController.delete);

export { router as genreRouter };
