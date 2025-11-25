import express from 'express';
import cors from 'cors';

import artistRoutes from './routes/artist.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const createApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/artists', artistRoutes);

    app.use(errorHandler);

  return app;
}