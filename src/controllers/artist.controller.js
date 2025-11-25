import Joi from 'joi';
import { artistService } from '../services/artist.service.js';

const artistSchema = Joi.object({
  name: Joi.string().min(2).required(),
  musicStyle: Joi.string().min(2).required(),
});

export const artistController = {
  getAll: async (req, res) => {
    const artists = await artistService.getAll();
    return res.json(artists);
  },

  getById: async (req, res) => {
    try {
      const artist = await artistService.getById(req.params.id);
      return res.json(artist);
    } catch (err) {
      return res.status(404).json({ message: 'Artiste introuvable' });
    }
  },

  create: async (req, res) => {
    const { error, value } = artistSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const newArtist = await artistService.create(value);
    return res.status(201).json(newArtist);
  },

  update: async (req, res) => {
    const { error, value } = artistSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    try {
      const updated = await artistService.update(req.params.id, value);
      return res.json(updated);
    } catch (err) {
      return res.status(404).json({ message: 'Artiste introuvable' });
    }
  },

  delete: async (req, res) => {
    try {
      await artistService.delete(req.params.id);
      return res.json({ message: 'Artiste supprimé' });
    } catch (err) {
      return res.status(404).json({ message: 'Artiste introuvable' });
    }
  }
};
