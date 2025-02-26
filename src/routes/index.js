const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  proxyToAuth,
  proxyToStreams,
} = require("../controllers/proxyController");

const router = express.Router();

router.post("/auth/signup", proxyToAuth);
router.post("/auth/login", proxyToAuth);
router.post("/auth/verify", proxyToAuth);

router.get("/streams", proxyToStreams);
router.post("/streams/start-stream", authMiddleware, proxyToStreams);

module.exports = router;
