const fetch = require("node-fetch");

const proxyRequest = async (req, res, baseUrl, stripPrefix = "") => {
  const url = `${baseUrl}${req.url.replace(stripPrefix, "")}`;
  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      "content-type": req.headers["content-type"] || "application/json",
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    options.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    console.log(`Response from ${url}:`, text);

    if (
      response.headers.get("content-type")?.includes("application/json") &&
      text
    ) {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } else {
      console.error(`Non-JSON response from ${url}:`, text);
      res
        .status(response.status)
        .send({ error: "Unexpected response", raw: text });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
};

const proxyToAuth = (req, res) =>
  proxyRequest(req, res, process.env.AUTH_SERVICE_URL);
const proxyToStreams = (req, res) =>
  proxyRequest(req, res, process.env.STREAM_SERVICE_URL, "/streams");

module.exports = { proxyRequest, proxyToAuth, proxyToStreams };
