const validateObjectId = require("../middleware/validateObjectId");
const { Language, validate } = require("../models/language");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const languages = await Language.find().sort("name");
  res.send(languages);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const language = await Language.findOne({ name: req.body.name });
  if (language)
    return res.status(400).send({ message: "Language already registered." });

  let newLanguage = new Language({
    name: req.body.name,
    acronym: req.body.acronym,
  });
  newLanguage = await newLanguage.save();

  res.send(newLanguage);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const language = await Language.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    acronym: req.body.acronym,
  });

  if (!language)
    return res
      .status(404)
      .send("The language with the given Id was not found.");

  res.send(language);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const language = await Language.findByIdAndDelete(req.params.id);

  if (!language)
    return res
      .status(404)
      .send("The language with the given Id was not found.");

  res.send(language);
});

module.exports = router;
