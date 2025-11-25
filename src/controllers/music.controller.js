import { musicService } from '../services/music.service.js';
import Joi from 'joi';

export const createMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  artist_id: Joi.number().integer().positive().required(),
  album: Joi.string().max(255).allow(null, ''),
  duration: Joi.number().integer().positive().allow(null),
});

export const musicController = {
  create: async (req, res, next) => {
    try {
      //Validation des données
      const { error, value } = createMusicSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: 'Erreur de validation',
          details: error.details.map(d => d.message),
        });
      }

      //Vérifier la présence du fichier
      if (!req.file) {
        return res.status(400).json({
          message: 'Aucun fichier audio fourni.',
        });
      }

      //Appel du service avec les valeurs validées
      const music = await musicService.createMusic(value, req.file);

      return res.status(201).json(music);

    } catch (error) {
      next(error);
    }
  },
};
