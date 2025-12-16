import { artistService } from '../services/artist.service.js';

export const artistController = {
  getAll: async (req, res, next) => {
    try {
      const artists = await artistService.getAll();
      return res.json(artists);
    } catch (err) {
      return next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const artist = await artistService.getById(req.params.id);
      return res.json(artist);
    } catch (err) {
      return next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const newArtist = await artistService.create(req.body);
      return res.status(201).json(newArtist);
    } catch (err) {
      return next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await artistService.update(req.params.id, req.body);
      return res.json(updated);
    } catch (err) {
      return next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await artistService.delete(req.params.id);
      return res.json({ message: 'Artiste supprimé' });
    } catch (err) {
      return next(err);
    }
  },
};
