import { Router } from 'express';
import { artistController } from '../controllers/artist.controller.js';
import { authenticate } from '../middlewares/authProxy.middleware.js';

const router = Router();

router.get('/', artistController.getAll);
router.get('/:id', artistController.getById);
router.post('/', authenticate, artistController.create);
router.put('/:id', authenticate, artistController.update);
router.delete('/:id', authenticate, artistController.delete);

export default router;
