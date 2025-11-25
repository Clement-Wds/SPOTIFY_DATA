import { createApp } from './app.js';
import { env } from './config/env.js';
import { initDatabase } from './config/database.js';

// import './models/artist.model.js';
// import './models/user.model.js';

const bootstrap = async () => {
  await initDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Auth service running on port ${env.port}`);
  });
};

bootstrap();
