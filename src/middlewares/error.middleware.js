const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.status || res.statusCode || 500;

  console.error(error);

  res.status(statusCode).json({
    ok: false,
    message: error.message || 'Error interno del servidor',
  });
};

module.exports = {
  notFound,
  errorHandler,
};
