const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  profileId: { type: mongoose.Types.ObjectId, ref: "Profile" },
});

const Language = mongoose.model("Language", languageSchema);

function validateLanguage(language) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    profileId: Joi.objectId().required(),
  });

  return schema.validate(language);
}

exports.languageSchema = languageSchema;
exports.Language = Language;
exports.validate = validateLanguage;
