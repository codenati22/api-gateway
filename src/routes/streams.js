const express = require("express");
const { proxyRequest } = require("../controllers/proxyController");

const router = express.Router();

router.all("*", (req, res) =>
  proxyRequest(req, res, process.env.STREAM_SERVICE_URL)
);

module.exports = router;
