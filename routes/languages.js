const validateObjectId = require("../middleware/validateObjectId");
const { Language, validate } = require("../models/language");
const express = require("express");
const router = express.Router();

router.get("/profileId/:id", async (req, res) => {
  const languages = await Language.find({ profileId: req.params.id }).sort(
    "name"
  );
  res.send(languages);
});

module.exports = router;
