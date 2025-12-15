import multer from 'multer';
import { env } from '../config/env.js';

export const uploadMusic = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(env.uploadMaxSize || 50 * 1024 * 1024),
  },
});
