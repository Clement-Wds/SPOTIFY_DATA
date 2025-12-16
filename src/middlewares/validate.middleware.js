export const validate = (schema, { source = 'body' } = {}) => {
  return async (req, res, next) => {
    try {
      const payload = req?.[source] ?? {};

      const value = await schema.validateAsync(payload, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

      req[source] = value;
      return next();
    } catch (err) {
      return next(err);
    }
  };
};
