import { Router } from 'express';
import { artistController } from '../controllers/artist.controller.js';
import { authenticate } from '../middlewares/authProxy.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createArtistSchema, updateArtistSchema } from '../validators/artists.validator.js';

const router = Router();

router.get('/', artistController.getAll);
router.get('/:id', artistController.getById);
router.post('/',validate(createArtistSchema), authenticate, artistController.create);
router.put('/:id', validate(updateArtistSchema), authenticate, artistController.update);
router.delete('/:id', authenticate, artistController.delete);

export default router;
