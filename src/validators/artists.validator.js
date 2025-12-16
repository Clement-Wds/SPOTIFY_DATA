import Joi from 'joi';

export const createArtistSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  musicStyle: Joi.string().min(2).max(255).required(),
});

export const updateArtistSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  musicStyle: Joi.string().min(2).max(255),
}).min(1);
