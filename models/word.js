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
    maxlength: 100,
  },
  language: {
    type: languageSchema,
    required: true,
  },
});

const Word = mongoose.model("Word", wordSchema);

function validateWord(word) {
  const schema = Joi.object({
    word: Joi.string().min(1).max(100).required(),
    languageId: Joi.objectId().required(),
  });

  return schema.validate(word);
}

exports.wordSchema = wordSchema;
exports.Word = Word;
exports.validate = validateWord;
