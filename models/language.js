const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
});

const Language = mongoose.model("Language", languageSchema);

function validateLanguage(language) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
  });

  return schema.validate(language);
}

exports.languageSchema = languageSchema;
exports.Language = Language;
exports.validate = validateLanguage;
