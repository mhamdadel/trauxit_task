/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  const responseBody = {
    error: {
      message: err.message || 'Internal Server Error',
    },
  };
  console.log(err)
  return res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
