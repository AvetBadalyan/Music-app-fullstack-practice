import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { validateId } from '../middlewares/idValidator';
import { validateImageUpload } from '../middlewares/fileUpload';
import { CreateAlbumDto } from '../dto/album.dto';
import { AlbumController } from '../controllers/album';

const router = Router();
const albumController = new AlbumController();

router.post(
  '/',
  validateImageUpload.single('coverImage'),
  validateRequest(CreateAlbumDto),
  albumController.create,
);
router.get('/', albumController.getAll);
router.get('/:id', validateId, albumController.getById);
router.delete('/:id', validateId, albumController.delete);

export { router as albumRouter };
