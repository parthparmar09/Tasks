const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/tasks", require("./routes/taskRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

// Serve static files
app.use(
  "/api/v1/documents",
  express.static(path.join(__dirname, "../documents"))
);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
