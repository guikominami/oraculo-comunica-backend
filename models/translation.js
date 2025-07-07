const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { required, func } = require("joi");
const mongoose = require("mongoose");
const { wordSchema } = require("./word");

const translationSchema = new mongoose.Schema({
  //no esquema pode ser word, pq no banco aparece todos os dados da palavra
  //já na validação do esquema será o wordId, pois esse é o dado de entrada
  word: {
    type: wordSchema,
    required: true,
  },
  translations: [
    {
      type: wordSchema,
      required: true,
    },
  ],
});

const Translation = mongoose.model("Translation", translationSchema);

function validateTranslation(translation) {
  const schema = Joi.object({
    wordId: Joi.objectId().required(),
    translations: Joi.array().required(),
  });

  return schema.validate(translation);
}

exports.translationSchema = translationSchema;
exports.Translation = Translation;
exports.validate = validateTranslation;
