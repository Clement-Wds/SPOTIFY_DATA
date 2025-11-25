import { musicService } from '../services/music.service.js';
import Joi from 'joi';

export const createMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
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

export const musicController = {
    create: async (req, res, next) => {
    try {
      const { error, value } = createMusicSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: 'Erreur de validation',
          details: error.details.map(d => d.message),
        });
      }

      if (!req.file) {
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

      const { error, value } = updateMusicSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: 'Erreur de validation',
          details: error.details.map(d => d.message),
        });
      }

      const music = await musicService.updateMusic(id, value, req.file);
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
