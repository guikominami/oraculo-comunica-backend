const validateObjectId = require("../middleware/validateObjectId");
const { Profile, validate } = require("../models/profile");
const { Language } = require("../models/language");
const { Word } = require("../models/word");
const { Translation } = require("../models/translation");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const profiles = await Profile.find().sort("name");
  res.send(profiles);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const profile = await Profile.findOne({ name: req.body.name });
  if (profile)
    return res.status(400).send({
      message: "Profile already registered.",
      profileId: profile._id,
    });

  let newProfile = new Profile({
    name: req.body.name,
  });
  newProfile = await newProfile.save();

  res.send(newProfile);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const profile = await Profile.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });

  if (!profile)
    return res.status(404).send("The profile with the given Id was not found.");

  res.send(profile);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  await Translation.deleteMany({
    profileId: req.params.id,
  });

  await Word.deleteMany({ profileId: req.params.id });
  await Language.deleteMany({ profileId: req.params.id });

  const profile = await Profile.findByIdAndDelete(req.params.id);
  if (!profile) return res.status(404).send({ message: "Profile not found." });
  res.send(profile);
});

module.exports = router;
