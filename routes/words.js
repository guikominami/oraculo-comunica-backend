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
  const { error } = validate(req.params.id);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const words = await Word.find({ "language._id": req.params.id });
  res.send(words);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const language = await Language.findById(req.body.languageId);
  if (!language) return res.status(404).send("Invalid language");

  const word = await Word.findOne({ word: req.body.word });
  if (word) return res.status(404).send("Word already registered.");

  let newWord = new Word({
    word: req.body.word,
    language: {
      _id: language._id,
      name: language.name,
      acronym: language.acronym,
    },
  });

  newWord = await newWord.save();
  res.send(newWord);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const word = await Word.findByIdAndDelete(req.params.id);

  if (!word)
    return res.status(404).send("The word with the given Id was not found.");

  res.send(word);
});

module.exports = router;
