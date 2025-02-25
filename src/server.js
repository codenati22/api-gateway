const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/index");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.get("/health", (req, res) => res.json({ status: "API Gateway is up" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
