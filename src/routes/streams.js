import { Router } from "express";
const { proxyRequest } = require("../controllers/proxyController");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.use(authMiddleware);
router.all("*", (req, res) =>
  proxyRequest(req, res, process.env.STREAM_SERVICE_URL)
);

export default router;
