// const data = require("../data/word.json");
const { Language } = require("../models/language");
const { Word } = require("../models/word");

async function processData(data) {
  const languages = Object.keys(data[0]);
  let languagesData = [];
  let statusLoadData = [];

  for (const key in languages) {
    const responseLanguage = await insertLanguage(languages[key]);

    statusLoadData.push(responseLanguage);

    let newLanguage = {};
    const newLanguageId = responseLanguage.languageId;
    //newLanguage[languages[key]] = newLanguageId;
    newLanguage["languageName"] = languages[key];
    newLanguage["languageId"] = newLanguageId;

    languagesData.push(newLanguage);
  }

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];

    for (const key in obj) {
      var word = obj[key];

      const index = languagesData.findIndex(
        (item) => item.languageName === key
      );

      const responseWord = await insertWord(
        word,
        languagesData[index].languageId
      );

      statusLoadData.push(responseWord);
    }
  }

  return statusLoadData;
}

async function insertLanguage(languageName) {
  try {
    const language = await Language.findOne({ name: languageName });

    if (language)
      return {
        message: "Language already registered.",
        languageId: language._id,
        languageName: language.name,
      };

    let newLanguage = new Language({
      name: languageName,
    });

    newLanguage = await newLanguage.save();

    return {
      message: "Language registered successfully.",
      languageId: newLanguage._id,
      languageName: newLanguage.name,
    };
  } catch (error) {
    throw error;
  }
}

async function insertWord(newWord, languageId) {
  try {
    const language = await Language.findById(languageId);
    if (!language)
      return {
        message: "Invalid languageId" + languageId,
      };

    const word = await Word.findOne({
      word: newWord,
      "language._id": language._id,
    });

    if (word)
      return {
        message: "Word already registered.",
        wordId: word._id,
        word: word.word,
      };

    let newWordData = new Word({
      word: newWord,
      language: {
        _id: language._id,
        name: language.name,
      },
    });

    newWordData = await newWordData.save();
    return {
      message: "Word registered successfully.",
      wordId: newWordData._id,
      word: newWordData.word,
    };
  } catch (error) {
    throw error;
  }
}

exports.processData = processData;
