import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateGenreDto } from '../dto/genre.dto';
import { GenreController } from '../controllers/genre';

const router = Router();
const genreController = new GenreController();

router.post('/', validateRequest(CreateGenreDto), genreController.create);
router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);

export { router as genreRouter };
