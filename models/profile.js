const Joi = require("joi");
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

function validateProfile(profile) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
  });

  return schema.validate(profile);
}

exports.profileSchema = profileSchema;
exports.Profile = Profile;
exports.validate = validateProfile;
