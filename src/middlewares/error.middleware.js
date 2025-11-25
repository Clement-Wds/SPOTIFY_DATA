export const errorHandler = (err, req, res, next) => {
  //ATTENTION CETTE LIGNE EN DEV UNIQUEMENT A NE PAS GARDER !!!!  
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Erreur interne du serveur';

  return res.status(status).json({ message });
};
