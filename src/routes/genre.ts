import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { validateId } from '../middlewares/idValidator';
import { CreateGenreDto } from '../dto/genre.dto';
import { GenreController } from '../controllers/genre';

const router = Router();
const genreController = new GenreController();

router.post('/', validateRequest(CreateGenreDto), genreController.create);
router.get('/', genreController.getAll);
router.get('/:id', validateId, genreController.getById);
router.delete('/:id', validateId, genreController.delete);

export { router as genreRouter };
