import { Router } from 'express';
import { musicController } from '../controllers/music.controller.js';
import { uploadMusic } from '../middlewares/upload.middleware.js';
import { authenticate } from '../middlewares/authProxy.middleware.js';

const router = Router();

router.get('/', musicController.findAll);
router.get('/:id', musicController.findOne);
router.post('/', authenticate, uploadMusic.single('file'), musicController.create);
router.put('/:id', authenticate, uploadMusic.single('file'), musicController.update);
router.delete('/:id', authenticate, musicController.remove);

export default router;
