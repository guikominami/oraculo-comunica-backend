const validateObjectId = require("../middleware/validateObjectId");
const { Profile, validate } = require("../models/profile");
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

module.exports = router;
