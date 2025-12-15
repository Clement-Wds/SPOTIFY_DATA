import { musicRepository } from '../repositories/music.repository.js';
import { Artist } from '../models/artist.model.js';
import { uploadClient } from '../clients/upload.client.js';

export const musicService = {
  async createMusic(data, file) {
    if (!file || !file.buffer) {
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

    // Upload vers le microservice FILE
    const uploaded = await uploadClient.uploadFile({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: 'musics',
      type: 'audio',
    });

    const payload = {
      title: data.title,
      artistId,
      album: data.album ?? null,
      duration: data.duration ?? null,

      // FILES renvoie maintenant `path` (et pas `filePath`)
      filePath: uploaded.path,
      mimeType: uploaded.mimeType,
      size: uploaded.size,
    };

    // Si ton modèle Music a déjà ces champs, on les remplit (sinon ignorés par Sequelize si non définis)
    if (uploaded.id) payload.fileAssetId = uploaded.id;
    if (uploaded.url) payload.fileUrl = uploaded.url;

    const music = await musicRepository.create(payload);

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
    const music = await this.getMusicById(id);

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

    // Si nouveau fichier : upload vers FILE + suppression ancien fichier via FILE
    if (file && file.buffer) {
      const uploaded = await uploadClient.uploadFile({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
        folder: 'musics',
        type: 'audio',
      });

      music.filePath = uploaded.path;
      music.mimeType = uploaded.mimeType;
      music.size = uploaded.size;

      // Si tu as ces champs côté modèle
      if (uploaded.id) music.fileAssetId = uploaded.id;
      if (uploaded.url) music.fileUrl = uploaded.url;

      if (oldFilePath && oldFilePath !== uploaded.path) {
        try {
          await uploadClient.deleteFile({ filePath: oldFilePath });
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
        await uploadClient.deleteFile({ filePath });
      } catch (err) {
        console.warn('Impossible de supprimer le fichier :', err.message);
      }
    }

    return { message: 'Musique supprimée avec succès.' };
  },
};
