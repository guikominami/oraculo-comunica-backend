const validateObjectId = require("../middleware/validateObjectId");
const { Word, validate } = require("../models/word");
const { Language } = require("../models/language");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const words = await Word.find().sort("word");
  res.send(words);
});

router.get("/languageid/:id", async (req, res) => {
  const words = await Word.find({ "language._id": req.params.id }).sort("word");
  res.send(words);
});

module.exports = router;
