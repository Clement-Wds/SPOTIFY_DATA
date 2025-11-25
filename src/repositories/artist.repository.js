import { Artist } from '../models/artist.model.js';

export const artistRepository = {
  findAll: async () => {
    return await Artist.findAll();
  },

  findById: async (id) => {
    return await Artist.findByPk(id);
  },

  create: async (data) => {
    return await Artist.create(data);
  },

  update: async (id, data) => {
    const artist = await Artist.findByPk(id);
    if (!artist) return null;

    return await artist.update(data);
  },

  delete: async (id) => {
    const artist = await Artist.findByPk(id);
    if (!artist) return null;

    await artist.destroy();
    return artist;
  }
};
