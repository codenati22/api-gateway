const fetch = require("node-fetch");

const proxyRequest = async (req, res, baseUrl, stripPrefix = "") => {
  const urlPath = stripPrefix ? req.url.replace(stripPrefix, "") : req.url;
  const url = `${baseUrl}${urlPath}`;
  console.log(`Request URL: ${req.url}`);
  console.log(`Proxying to: ${url}`);
  console.log(`Method: ${req.method}, Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Body: ${JSON.stringify(req.body || {})}`);

  const options = {
    method: req.method,
    headers: {
      "Content-Type": req.headers["content-type"] || "application/json",
      Authorization: req.headers["authorization"] || "",
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    options.body = JSON.stringify(req.body);
    console.log(`Sending body: ${options.body}`);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    console.log(`Response Status: ${response.status}`);
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
  proxyRequest(req, res, process.env.AUTH_SERVICE_URL, "/auth");
const proxyToStreams = (req, res) => {
  const urlPath = req.url === "/streams" ? "/streams" : "/start-stream";
  return proxyRequest(
    req,
    res,
    process.env.STREAM_SERVICE_URL,
    urlPath === "/streams" ? "" : "/streams"
  );
};

module.exports = { proxyRequest, proxyToAuth, proxyToStreams };
