const fetch = require("node-fetch");

const proxyRequest = async (req, res, baseUrl) => {
  const url = `${baseUrl}${req.url}`;
  const options = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization || "",
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    options.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();

    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } else {
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
};

const proxyToAuth = (req, res) =>
  proxyRequest(req, res, process.env.AUTH_SERVICE_URL);
const proxyToStreams = (req, res) =>
  proxyRequest(req, res, process.env.STREAM_SERVICE_URL);

module.exports = { proxyRequest, proxyToAuth, proxyToStreams };
