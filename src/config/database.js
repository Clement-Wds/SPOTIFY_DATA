import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    logging: false,
  }
);

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected (MySQL)');

    //await sequelize.sync({ alter: true });
    //console.log('DB synced');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
};
