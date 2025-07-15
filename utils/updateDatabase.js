const { Language } = require("../models/language");
const { Word } = require("../models/word");

async function insertLanguage(languageName) {
  try {
    const language = await Language.findOne({ name: languageName }).exec();

    if (language)
      return {
        message: "Language already registered.",
        languageId: language._id,
        languageName: language.name,
      };

    let newLanguage = new Language({
      name: languageName,
    });

    newLanguage = newLanguage.save();
    return {
      message: "Language registered successfully.",
      languageId: newLanguage._id,
    };
  } catch (error) {
    console.log(error);
  }
}

async function insertWord(word, languageId) {
  const language = await Language.findById(languageId);
  if (!language)
    return {
      message: "Invalid languageId" + languageId,
    };

  const word = await Word.find({
    word: req.body.word,
    "language._id": language._id,
  });

  if (word.length > 0)
    return { message: "Word already registered.", wordId: word._id };

  let newWord = new Word({
    word: req.body.word,
    language: {
      _id: language._id,
      name: language.name,
      acronym: language.acronym,
    },
  });

  newWord = await newWord.save();
  return { message: "Word registered successfully.", wordId: word._id };
}

exports.insertLanguage = insertLanguage;
exports.insertWord = insertWord;
