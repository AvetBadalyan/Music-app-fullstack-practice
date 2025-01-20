import { Router } from 'express';
import {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from '../controllers/albumController';

const router = Router();

router.get('/', getAlbums); // No "Promise<Response>" issue here
router.get('/:id', getAlbum);
router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
