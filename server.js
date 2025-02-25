const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authMiddleware = require("./src/middleware/auth");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use("/auth", (req, res) => {
  const url = `${process.env.AUTH_SERVICE_URL}${req.url}`;
  fetch(url, {
    method: req.method,
    body: req.body ? JSON.stringify(req.body) : undefined,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});

// Protected routes
app.use("/streams", authMiddleware, (req, res) => {
  const url = `${process.env.STREAM_SERVICE_URL}${req.url}`;
  fetch(url, {
    method: req.method,
    body: req.body ? JSON.stringify(req.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers["authorization"], // Pass token
    },
  })
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
