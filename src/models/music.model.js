import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Artist } from './artist.model.js';

export const Music = sequelize.define('Music', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fileId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'file_id',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  artistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'artist_id',
  },
  album: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true, // en secondes
  },
  filePath: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'musics',
  timestamps: true,
});

Music.belongsTo(Artist, {
  foreignKey: 'artistId',
  as: 'artist',
});

Artist.hasMany(Music, {
  foreignKey: 'artistId',
  as: 'musics',
});
