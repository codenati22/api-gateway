const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  proxyToAuth,
  proxyToGetStreams,
  proxyToStartStream,
  proxyToStopStream,
} = require("../controllers/proxyController");

const router = express.Router();

router.post("/auth/signup", proxyToAuth);
router.post("/auth/login", proxyToAuth);
router.post("/auth/verify", proxyToAuth);

router.get("/streams", proxyToGetStreams);
router.post("/streams/start-stream", authMiddleware, proxyToStartStream);
router.post("/streams/stop-stream", authMiddleware, proxyToStopStream);

module.exports = router;
// const express = require("express");
// const authMiddleware = require("../middleware/auth");
// const {
//   proxyToAuth,
//   proxyToStreams,
// } = require("../controllers/proxyController");

// const router = express.Router();

// router.post("/auth/signup", proxyToAuth);
// router.post("/auth/login", proxyToAuth);
// router.post("/auth/verify", proxyToAuth);

// router.get("/streams", proxyToStreams);
// router.post("/streams/start-stream", authMiddleware, proxyToStreams);
// router.post("/streams/stop-stream", authMiddleware, proxyToStreams);

// module.exports = router;
