export const errorHandlerMiddlewares = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  return res.status(status).json({
    status,
    message: status === 500 ? 'Something went wrong' : err.message,
  });
};
