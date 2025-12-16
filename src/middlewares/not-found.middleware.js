export const notFound = (req, res) => {
  return res.status(404).json({
    message: 'Resource not found',
    code: "404_NOT_FOUND",
  });
};
