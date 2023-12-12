

const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(err);

  // Set the status code based on the error type
  let statusCode;
  switch (err.name) {
    case 'ValidationError':
      statusCode = 400;
      break;
    case 'NotFoundError':
      statusCode = 404;
      break;
    case 'UnauthorizedError':
      statusCode = 401;
      break;
    default:
      statusCode = 500;
      break;
  }

  // Send the error response
  res.status(statusCode).json({ message: err.message });
};

export default errorHandler;