import { Music } from '../models/music.model.js';
import { Artist } from '../models/artist.model.js';

export const musicRepository = {
  async create(data) {
    return Music.create(data);
  },
};
