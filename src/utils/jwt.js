import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};
