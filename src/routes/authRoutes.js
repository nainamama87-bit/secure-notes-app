const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { register, login, me, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." }
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, me);
router.post("/logout", protect, logout);

module.exports = router;