import { Router } from 'express';
import { ArtistController } from '../controllers/artist';
import { validateId } from '../middlewares/idValidator';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateArtistDto, SearchArtistDto } from '../dto/artist.dto';

const router = Router();
const artistController = new ArtistController();

router.post('/', validateRequest(CreateArtistDto), artistController.create);
router.get('/', artistController.getAll);
router.get(
  '/search',
  validateRequest(SearchArtistDto),
  artistController.searchByName,
);
router.get('/:id', validateId, artistController.getById);

export { router as artistRouter };
