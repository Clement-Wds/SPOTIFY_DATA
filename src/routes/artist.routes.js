import { Router } from 'express';
import { artistController } from '../controllers/artist.controller.js';

const router = Router();

router.get('/', artistController.getAll);
router.get('/:id', artistController.getById);
router.post('/', artistController.create);
router.put('/:id', artistController.update);
router.delete('/:id', artistController.delete);

export default router;
