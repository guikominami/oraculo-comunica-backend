const express = require("express");
const router = express.Router();
const { processData } = require("../utils/loadData");

router.post("/", async (req, res) => {
  const response = await processData(req.body);
  res.send(response);
});

module.exports = router;
