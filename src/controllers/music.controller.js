import { musicService } from '../services/music.service.js';
import Joi from 'joi';

export const createMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  // form-data => souvent string, donc on convertit
  artist_id: Joi.number().integer().positive().required(),
  album: Joi.string().max(255).allow(null, ''),
  duration: Joi.number().integer().positive().allow(null),
});

export const updateMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  artist_id: Joi.number().integer().positive(),
  album: Joi.string().max(255).allow(null, ''),
  duration: Joi.number().integer().positive().allow(null),
}).min(1);

const joiOptions = {
  abortEarly: false,
  stripUnknown: true,
  convert: true, // ✅ convertit "1" -> 1
};

export const musicController = {
  create: async (req, res, next) => {
    try {
      const { error, value } = createMusicSchema.validate(req.body, joiOptions);

      if (error) {
        return res.status(400).json({
          message: 'Erreur de validation',
          details: error.details.map((d) => d.message),
        });
      }

      // ✅ en DATA, avec memoryStorage: req.file.buffer doit exister
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          message: 'Aucun fichier audio fourni.',
        });
      }

      const music = await musicService.createMusic(value, req.file);
      return res.status(201).json(music);
    } catch (error) {
      next(error);
    }
  },

  findAll: async (req, res, next) => {
    try {
      const musics = await musicService.getAllMusics();
      return res.status(200).json(musics);
    } catch (error) {
      next(error);
    }
  },

  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const music = await musicService.getMusicById(id);
      return res.status(200).json(music);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      //Cas particuliers :
      // - Si on fait un PUT avec uniquement un fichier (sans champ texte) -> Joi renverra une erreur car req.body est vide.
      // - On autorise donc update si au moins (body non vide) OU (fichier présent)
      const hasFile = !!(req.file && req.file.buffer);
      const hasBody = req.body && Object.keys(req.body).length > 0;

      if (!hasBody && !hasFile) {
        return res.status(400).json({
          message: 'Aucune donnée à mettre à jour (body vide et aucun fichier).',
        });
      }

      let validatedBody = {};
      if (hasBody) {
        const { error, value } = updateMusicSchema.validate(req.body, joiOptions);

        if (error) {
          return res.status(400).json({
            message: 'Erreur de validation',
            details: error.details.map((d) => d.message),
          });
        }

        validatedBody = value;
      }

      const music = await musicService.updateMusic(id, validatedBody, hasFile ? req.file : null);
      return res.status(200).json(music);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await musicService.deleteMusic(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
