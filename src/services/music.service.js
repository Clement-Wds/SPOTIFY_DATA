import fs from 'fs/promises';
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
  },

  async getAllMusics() {
    return musicRepository.findAll();
  },

  async getMusicById(id) {
    const music = await musicRepository.findById(id);
    if (!music) {
      const error = new Error('Musique introuvable.');
      error.statusCode = 404;
      throw error;
    }
    return music;
  },

  async updateMusic(id, data, file) {
    const music = await this.getMusicById(id); //-> sort en 404 automatiquement si aucun enregistrement trouvé en DB

    // on garde l’ancien chemin pour supprimer le vieux fichier si remplacé
    const oldFilePath = music.filePath;

    // artist_id optionnel mais si présent => on vérifie l’artiste
    const artistId = data.artist_id ?? data.artistId ?? music.artistId;
    if (data.artist_id || data.artistId) {
      const artist = await Artist.findByPk(artistId);
      if (!artist) {
        const error = new Error('Artiste introuvable pour cet artist_id.');
        error.statusCode = 404;
        throw error;
      }
    }

    music.title = data.title ?? music.title;
    music.artistId = artistId;
    music.album = data.album ?? music.album;
    music.duration = data.duration ?? music.duration;

    if (file) {
      music.filePath = file.path;
      music.mimeType = file.mimetype;
      music.size = file.size;

      // suppression de l’ancien fichier
      if (oldFilePath && oldFilePath !== file.path) {
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.warn('Impossible de supprimer l’ancien fichier :', err.message);
        }
      }
    }

    await music.save();
    return music;
  },

  async deleteMusic(id) {
    const music = await this.getMusicById(id);
    const filePath = music.filePath;

    await musicRepository.delete(id);

    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn('Impossible de supprimer le fichier :', err.message);
      }
    }

    return { message: 'Musique supprimée avec succès.' };
  },
};
