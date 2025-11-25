import { artistRepository } from '../repositories/artist.repository.js';

export const artistService = {
  getAll: async () => {
    return await artistRepository.findAll();
  },

  getById: async (id) => {
    const artist = await artistRepository.findById(id);
    if (!artist) throw new Error('ARTIST_NOT_FOUND');
    return artist;
  },

  create: async (data) => {
    return await artistRepository.create(data);
  },

  update: async (id, data) => {
    const updated = await artistRepository.update(id, data);
    if (!updated) throw new Error('ARTIST_NOT_FOUND');
    return updated;
  },

  delete: async (id) => {
    const deleted = await artistRepository.delete(id);
    if (!deleted) throw new Error('ARTIST_NOT_FOUND');
    return deleted;
  }
};
