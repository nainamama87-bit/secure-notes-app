const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Please log in to continue" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (_error) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Session expired. Please log in again" });
  }
};

module.exports = { protect };