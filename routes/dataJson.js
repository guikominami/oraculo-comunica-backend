const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  console.log(req.body.name);

  res.send(req.body.name);
});

module.exports = router;
