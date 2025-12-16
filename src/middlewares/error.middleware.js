import Joi from 'joi';
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from 'sequelize';

const isProd = process.env.NODE_ENV === 'production';

export const errorHandler = (err, req, res, next) => {
  // Logs
  if (!isProd) {
    console.error(err);
  }

  let status = err?.status || 500;
  let message = err?.message || 'Erreur interne du serveur';
  let details;

  // 1) JSON invalide (express.json)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON payload',
      code: "400_INVALID_JSON",
    });
  }

  // 3) Sequelize validation (notNull, validate, etc.)
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Erreur de validation en DB',
      code: "400_DB_VALIDATION_ERROR",
    });
  }

  // 4) Sequelize unique constraint
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      message: `Attribut ${err.fields} déjà utilisé`,
      code: "409_DUPLICATION",
    });
  }

  // 5) Sequelize foreign key constraint
  if (err instanceof ForeignKeyConstraintError) {
    status = 409;
    message = 'Foreign key constraint';
    details = { table: err.table, fields: err.fields };
  }

  // 6) (optionnel) payload trop gros (selon config body-parser)
  // ex: "request entity too large"
  if (err?.type === 'entity.too.large') {
    status = 413;
    message = 'Payload too large';
  }

  /* ------------------------------
   * 403 – Forbidden
   * ------------------------------ */
  if (status === 403) {
    return res.status(403).json({
      message: 'Accès non autorisé',
      code: "403_UNAUTHORIZED",
    });
  }

  const payload = {
    message,
    ...(details ? { details } : {}),
    ...(!isProd && err?.stack ? { stack: err.stack } : {}),
  };

  return res.status(status).json(payload);
};
