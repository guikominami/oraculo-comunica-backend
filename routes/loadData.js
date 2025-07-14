const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  res.send(req.body);

  const data = req.body;

  for (item in data) {
    console.log(item);
  }
});

module.exports = router;
