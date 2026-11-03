function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  let status = error.statusCode || 500;
  let message = error.message || "Internal server error.";

  if (error.name === "ValidationError") {
    status = 400;
    message = Object.values(error.errors).map((item) => item.message).join(" ");
  } else if (error.name === "CastError") {
    status = 400;
    message = "Invalid resource ID.";
  } else if (error.code === 11000) {
    status = 409;
    message = "This record already exists.";
  }

  if (status >= 500) {
    console.error(error);
    message = process.env.NODE_ENV === "production" ? "Something went wrong." : message;
  }

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
