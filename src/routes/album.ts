import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateAlbumDto } from '../dto/album.dto';
import { AlbumController } from '../controllers/album';

const router = Router();
const albumController = new AlbumController();

router.post('/', validateRequest(CreateAlbumDto), albumController.create);

export { router as albumRouter };
