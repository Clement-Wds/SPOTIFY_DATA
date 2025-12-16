import axios from 'axios';
import FormData from 'form-data';
import { env } from '../config/env.js';

export const uploadClient = {
  async uploadFile({ buffer, originalName, mimeType, folder, type = 'music' }) {
    if (!env.uploadServiceUrl) throw new Error('uploadServiceUrl manquant');
    if (!env.uploadServiceToken) throw new Error('uploadServiceToken manquant');

    const form = new FormData();

    // IMPORTANT: champs texte AVANT le fichier
    if (folder) form.append('folder', folder);

    // “spécifier music”
    form.append('type', type);

    form.append('file', buffer, {
      filename: originalName,
      contentType: mimeType,
    });

    const { data } = await axios.post(`${env.uploadServiceUrl}/api/files`, form, {
      headers: {
        ...form.getHeaders(),
        'x-service-token': env.uploadServiceToken,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return data;
  },

    async updateFile({ fileId, buffer, originalName, mimeType, folder, type }) {
    const form = new FormData();
    form.append('file', buffer, { filename: originalName, contentType: mimeType });
    if (folder) form.append('folder', folder);
    if (type) form.append('type', type);

    const { data } = await axios.put(`${env.uploadServiceUrl}/api/files/${fileId}`, form, {
      headers: { ...form.getHeaders(), 'x-service-token': env.uploadServiceToken },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return data;
  },

  async deleteFile({ filePath }) {
    if (!env.uploadServiceUrl) throw new Error('uploadServiceUrl manquant');
    if (!env.uploadServiceToken) throw new Error('uploadServiceToken manquant');

    const { data } = await axios.delete(`${env.uploadServiceUrl}/api/files`, {
      headers: { 'x-service-token': env.uploadServiceToken },
      data: { filePath },
    });

    return data;
  },
};
