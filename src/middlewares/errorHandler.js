const config = require('../config');

const errorHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: statusCode === 500 ? 'Internal server error' : err.message,
  };

  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
