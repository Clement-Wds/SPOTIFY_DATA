import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import artistRoutes from './routes/artist.routes.js';
import musicRoutes from './routes/music.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    app.use('/api/artists', artistRoutes);
    app.use('/api/musics', musicRoutes);

    app.use(errorHandler);

  return app;
}