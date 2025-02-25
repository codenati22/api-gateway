const fetch = require("node-fetch");

// Proxy request to a target service
const proxyToService = async (req, res, serviceUrl) => {
  const url = `${serviceUrl}${req.url}`;
  try {
    const response = await fetch(url, {
      method: req.method,
      body: req.body ? JSON.stringify(req.body) : undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers["authorization"] || "", // Pass auth header if present
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const proxyToAuth = (req, res) =>
  proxyToService(req, res, process.env.AUTH_SERVICE_URL);
const proxyToStreams = (req, res) =>
  proxyToService(req, res, process.env.STREAM_SERVICE_URL);

module.exports = { proxyToAuth, proxyToStreams };
