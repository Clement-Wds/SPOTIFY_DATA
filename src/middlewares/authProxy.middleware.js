import axios from 'axios';
import { env } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou invalide.' });
    }

    // Appel au microservice Auth
    console.log(`URL ENV : ${env.authServiceUrl}`);

    const response = await axios.get(`${env.authServiceUrl}/api/auth/verify`, {
      headers: {
        Authorization: authHeader,
        'x-service-token': env.authServiceToken,
      },
    });

    req.user = response.data.user;

    return next();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }

    console.error('Erreur de communication avec le service Auth :', error.message);
    return res.status(503).json({
      message: 'Service d’authentification indisponible.',
    });
  }
};
