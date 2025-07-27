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

router.get("/profileId/:id", async (req, res) => {
  const translations = await Translation.find({
    profileId: req.params.id,
  });
  res.send(translations);
});

module.exports = router;
