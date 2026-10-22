export const notFoundHandler = (req, res) => {
  res.status(400).json({
    message: 'Not found contact',
    status: 404,
  });
};
