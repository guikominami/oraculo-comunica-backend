const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { required, func } = require("joi");
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const { languageSchema } = require("./language");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300,
    normalized: String,
  },
  language: {
    type: languageSchema,
    required: true,
  },
  profileId: { type: mongoose.Types.ObjectId, ref: "Profile" },
});

const Word = mongoose.model("Word", wordSchema);

function validateWord(word) {
  const schema = Joi.object({
    word: Joi.string().min(1).max(100).required(),
    languageId: Joi.objectId().required(),
    profileId: Joi.objectId().required(),
  });

  return schema.validate(word);
}

exports.wordSchema = wordSchema;
exports.Word = Word;
exports.validate = validateWord;
