// errorHandler.js

const errorHandler = async (err, req, res, next) => {
  console.error(err.message);

  if (err.status) {
    // Custom errors with a defined status
    return res.status(err.status).json({ message: err.message });
  }

  // Fallback to 500 Internal Server Error for unexpected issues
  res
    .status(500)
    .json({ message: 'An unexpected error occurred, please try again later.' });
};

module.exports = errorHandler;
