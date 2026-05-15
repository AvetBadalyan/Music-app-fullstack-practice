import { Router } from 'express';
import { ArtistController } from '../controllers/artist';
import { validateId } from '../middlewares/idValidator';
import { validateRequest } from '../middlewares/validateRequest';
import { validateImageUpload } from '../middlewares/fileUpload';
import { CreateArtistDto, SearchArtistDto } from '../dto/artist.dto';

const router = Router();
const artistController = new ArtistController();

router.post(
  '/',
  validateImageUpload.single('profilePicture'),
  validateRequest(CreateArtistDto),
  artistController.create,
);
router.get('/', artistController.getAll);
router.get(
  '/search',
  validateRequest(SearchArtistDto),
  artistController.searchByName,
);
router.get('/:id', validateId, artistController.getById);
router.delete('/:id', validateId, artistController.delete);

export { router as artistRouter };
