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

    // Upload vers FILE (création d’un asset)
    const uploaded = await uploadClient.uploadFile({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: 'musics',
      type: 'audio',
    });

    if (!uploaded?.id) {
      const error = new Error("Erreur upload FILE: aucun 'id' retourné.");
      error.statusCode = 502;
      throw error;
    }

    const payload = {
      title: data.title,
      artistId,
      album: data.album ?? null,
      duration: data.duration ?? null,
      //Nouveau champ en DB DATA
      fileId: uploaded.id,
    };

    // Optionnel : si tu gardes ces champs dans Music (sinon supprime)
    if (uploaded.filePath) payload.filePath = uploaded.filePath;
    if (uploaded.mimeType) payload.mimeType = uploaded.mimeType;
    if (uploaded.size) payload.size = uploaded.size;
    if (uploaded.url) payload.fileUrl = uploaded.url;

    return musicRepository.create(payload);
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

    // Maj champs musique
    music.title = data.title ?? music.title;
    music.artistId = artistId;
    music.album = data.album ?? music.album;
    music.duration = data.duration ?? music.duration;

    // ✅ Remplacement du fichier via FILE (même fileId)
    if (file && file.buffer) {
      if (!music.fileId) {
        const error = new Error("Aucun fileId associé à cette musique, impossible de remplacer le fichier.");
        error.statusCode = 400;
        throw error;
      }

      const updatedFile = await uploadClient.updateFile({
        fileId: music.fileId,
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
        folder: 'musics',
        type: 'audio',
      });

      // Optionnel : mise à jour des metadata locales si tu les gardes en DATA
      if (updatedFile?.filePath) music.filePath = updatedFile.filePath;
      if (updatedFile?.mimeType) music.mimeType = updatedFile.mimeType;
      if (updatedFile?.size) music.size = updatedFile.size;
      if (updatedFile?.url) music.fileUrl = updatedFile.url;
    }

    await music.save();
    return music;
  },

  async deleteMusic(id) {
    const music = await this.getMusicById(id);

    const fileId = music.fileId;

    await musicRepository.delete(id);

    // ✅ suppression côté FILE par id (best effort)
    if (fileId) {
      try {
        await uploadClient.deleteFileById(fileId);
      } catch (err) {
        console.warn('Impossible de supprimer le fichier côté FILE :', err.message);
      }
    }

    return { message: 'Musique supprimée avec succès.' };
  },
};
