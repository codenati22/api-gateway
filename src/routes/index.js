const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  proxyToAuth,
  proxyToStreams,
} = require("../controllers/proxyController");

const router = express.Router();

router.use("/auth", proxyToAuth);

router.get("/streams", proxyToStreams);

router.post("/streams/start-stream", authMiddleware, proxyToStreams);

module.exports = router;
