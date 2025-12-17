export const createMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  artist_id: Joi.number().integer().positive().required(),
  album: Joi.string().max(255).allow(null, ''),
  duration: Joi.number().integer().positive().allow(null, ''),
});

export const updateMusicSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  artist_id: Joi.number().integer().positive(),
  album: Joi.string().max(255).allow(null, ''),
  duration: Joi.number().integer().positive().allow(null, ''),
}).min(1);