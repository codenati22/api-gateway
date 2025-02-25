const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const fetchModule = await import("node-fetch");
    const fetch = fetchModule.default;
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const result = await response.json();

    if (!result.valid) {
      return res.status(401).json({ error: result.error });
    }

    req.user = result.user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;
