import { Router } from 'express';
import { musicController } from '../controllers/music.controller.js';
import { uploadMusic } from '../middlewares/upload.middleware.js';
import { authenticate } from '../middlewares/authProxy.middleware.js';

const router = Router();

router.post('/', authenticate, uploadMusic.single('file'), musicController.create);

export default router;
