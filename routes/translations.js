const { Translation, validate } = require("../models/translation");
const { Word } = require("../models/word");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const translations = await Translation.find().sort("_id");
  res.send(translations);
});

router.get("/wordId/:id", async (req, res) => {
  const translations = await Translation.find({
    "word._id": req.params.id,
  });
  res.send(translations);
});

router.post("/", async (req, res) => {
  let translation;

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  //checar se a palavra chave da tradução existe na base de dados
  const wordMain = await Word.findById(req.body.wordId);

  if (!wordMain)
    return res.status(400).send("The main word is not registered.");

  //checar se as palavras que serão traduzidas existem na base de dados
  const newTranslations = await Word.find({
    _id: { $in: req.body.translations },
  });

  if (newTranslations.length === 0)
    return res.status(400).send("Invalid translations.");

  const wordMainId = await Translation.find({ "word._id": wordMain._id });

  //checar se a nova tradução já existe na lista de traduções do id da tradução (não incluir a mesma tradução)
  const wordTranslationId = await Translation.findOne({
    _id: wordMainId,
    "translations._id": { $in: req.body.translations },
  });

  if (wordTranslationId) {
    translation = await Translation.findByIdAndUpdate(wordMainId, {
      $push: {
        translations: newTranslations,
      },
    });
    res.send(translation);
  } else {
    translation = new Translation({
      word: wordMain,
      translations: newTranslations,
      profileId: req.body.profileId,
    });

    translation = await translation.save();
    res.send(translation);
  }
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
