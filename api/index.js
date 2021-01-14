const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { charCount } = require("../shared/charCount");

const app = express();
app.use(cors());
app.use(bodyParser.text({ limit: "5mb" }));

app.post("/api/charCount", (req, res) => res.json(charCount(req.body)));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Ready to handle requests on port ${PORT}`);
});
