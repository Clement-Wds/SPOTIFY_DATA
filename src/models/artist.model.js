import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Artist = sequelize.define('Artist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  musicStyle: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'artists'
});
