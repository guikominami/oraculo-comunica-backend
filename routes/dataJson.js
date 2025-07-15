const express = require("express");
const router = express.Router();
const { processData } = require("../utils/loadData");

router.post("/", async (req, res) => {
  await processData(req.body);
  res.send(req.body);
});

module.exports = router;
