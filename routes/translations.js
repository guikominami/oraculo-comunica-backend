const { Translation, validate } = require("../models/translation");
const { Word } = require("../models/word");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const translations = await Translation.find().sort("_id");
  res.send(translations);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const wordMain = await Word.findById(req.body.wordId);
  if (!wordMain)
    return res.status(400).send("The main word is not registered.");

  const wordMainId = await Translation.findById(wordMain._id);
  if (wordMainId)
    return res
      .status(400)
      .send("The word is already registered in translation.");

  const translations = await Word.find({
    _id: { $in: req.body.translations },
  });

  if (translations.length === 0)
    return res.status(400).send("Invalid translations.");

  let translation = new Translation({
    word: wordMain,
    translations: translations,
  });

  translation = await translation.save();
  res.send(translation);
});

router.delete("/:id", async (req, res) => {
  const translation = await Translation.findByIdAndDelete(req.params.id);
  if (!translation)
    return res
      .status(400)
      .send("The translation with the given Id was not found.");
  res.send(translation);
});

module.exports = router;
