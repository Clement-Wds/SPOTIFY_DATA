import Joi from 'joi';
import { musicService } from '../services/music.service.js';

export const createMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  artist_id: Joi.number().integer().positive().required(),
  album: Joi.string().max(255).allow(null, ''),
  duration: Joi.number().integer().positive().allow(null, ''),
});

export const updateMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  artist_id: Joi.number().integer().positive(),
  album: Joi.string().max(255).allow(null, ''),
  duration: Joi.number().integer().positive().allow(null, ''),
}).min(1);

const joiOptions = {
  abortEarly: false,
  stripUnknown: true,
  convert: true,
};

// J'ai ajouté ça car Postman peut parfois faire des siennes avec le champ file
// form-data: parfois "" => on le transforme en null si le champ le permet
const normalizeBody = (body) => {
  const out = { ...body };

  if (Object.prototype.hasOwnProperty.call(out, 'album') && out.album === '') out.album = null;
  if (Object.prototype.hasOwnProperty.call(out, 'duration') && out.duration === '') out.duration = null;

  return out;
};

export const musicController = {
  create: async (req, res, next) => {
    try {
      const normalized = normalizeBody(req.body);

      const { error, value } = createMusicSchema.validate(normalized, joiOptions);
      if (error) {
        return res.status(400).json({
          message: 'Erreur de validation',
          details: error.details.map((d) => d.message),
        });
      }

      if (!req.file?.buffer) {
        return res.status(400).json({ message: 'Aucun fichier audio fourni.' });
      }

      const music = await musicService.createMusic(value, req.file);
      return res.status(201).json(music);
    } catch (err) {
      return next(err);
    }
  },

  findAll: async (req, res, next) => {
    try {
      const musics = await musicService.getAllMusics();
      return res.status(200).json(musics);
    } catch (err) {
      return next(err);
    }
  },

  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const music = await musicService.getMusicById(id);
      return res.status(200).json(music);
    } catch (err) {
      return next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      const hasFile = !!req.file?.buffer;
      const hasBody = req.body && Object.keys(req.body).length > 0;

      if (!hasBody && !hasFile) {
        return res.status(400).json({
          message: 'Aucune donnée à mettre à jour (body vide et aucun fichier).',
        });
      }

      let validatedBody = {};
      if (hasBody) {
        const normalized = normalizeBody(req.body);

        const { error, value } = updateMusicSchema.validate(normalized, joiOptions);
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
    } catch (err) {
      return next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await musicService.deleteMusic(id);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  },
};
