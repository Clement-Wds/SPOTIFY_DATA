import { musicRepository } from '../repositories/music.repository.js';
import { Artist } from '../models/artist.model.js';

export const musicService = {
  async createMusic(data, file) {
    if (!file) {
      const error = new Error('Aucun fichier audio fourni.');
      error.statusCode = 400;
      throw error;
    }

    const artistId = data.artist_id ?? data.artistId;

    if (!artistId) {
      const error = new Error('artist_id est obligatoire.');
      error.statusCode = 400;
      throw error;
    }

    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      const error = new Error('Artiste introuvable pour cet artist_id.');
      error.statusCode = 404;
      throw error;
    }

    const music = await musicRepository.create({
      title: data.title,
      artistId,
      album: data.album ?? null,
      duration: data.duration ?? null,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
    });

    return music;
  }
};
