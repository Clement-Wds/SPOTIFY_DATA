import { Music } from '../models/music.model.js';
import { Artist } from '../models/artist.model.js';

export const musicRepository = {
  async create(data) {
    return Music.create(data);
  },

  async findById(id) {
    return Music.findByPk(id, {
      include: [
        {
          model: Artist,
          as: 'artist',
        },
      ],
    });
  },

  async findAll() {
    return Music.findAll({
      include: [
        {
          model: Artist,
          as: 'artist',
        },
      ],
    });
  },

  async delete(id) {
    return Music.destroy({ where: { id } });
  },
};
