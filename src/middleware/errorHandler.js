const { ValidationError } = require("express-validation");

const getErrorMessages = (error) => {
  const details = error.details;
  const validateError = [];

  if (details.params) {
    details.params.forEach((err) => validateError.push(err.message));
  } else if (details.query) {
    details.query.forEach((err) => validateError.push(err.message));
  } else if (details.body) {
    details.body.forEach((err) => validateError.push(err.message));
  }

  return validateError;
};

module.exports = (err, req, res, next) => {
  console.error("Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ValidationError || err.name === "ValidationError") {
    return res.status(422).json({
      message: "Validation failed",
      data: getErrorMessages(err),
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
    details: err.details || null
  });
};
