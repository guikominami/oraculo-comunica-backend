const express = require("express");
const router = express.Router();
const { processData } = require("../utils/loadData");

router.post("/:id", async (req, res) => {
  const response = await processData(req.body, req.params.id);
  res.send(response);
});

module.exports = router;
