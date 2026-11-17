require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Secure Notes API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const start = async () => {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error("Please set MONGODB_URI and JWT_SECRET in your .env file");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
};

start().catch((error) => {
  console.error("Startup error:", error.message);
  process.exit(1);
});