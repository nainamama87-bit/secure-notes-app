const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: "Email is already registered" });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
  });
};

module.exports = { notFound, errorHandler };