const express = require("express");
const cors = require("cors");
require("dotenv").config();

const uploadRoute = require("./routes/upload");
const authRoute = require("./routes/auth");
const reportsRoute = require("./routes/reports");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/auth", authRoute);
app.use("/reports", reportsRoute);

app.get("/", (req, res) => {
  res.send("AI Compliance Copilot Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});