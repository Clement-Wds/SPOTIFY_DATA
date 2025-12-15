import express from 'express';
import cors from 'cors';

import artistRoutes from './routes/artist.routes.js';
import musicRoutes from './routes/music.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const createApp = () => {
  const app = express();

  app.use(cors());

  // JSON (auth, CRUD classiques)
  app.use(express.json());

  // Form-data (utile avec Multer)
  app.use(express.urlencoded({ extended: true }));

  // Routes API
  app.use('/api/artists', artistRoutes);
  app.use('/api/musics', musicRoutes);

  // Middleware d’erreur global (à placer toujours en dernier)
  app.use(errorHandler);

  return app;
};
