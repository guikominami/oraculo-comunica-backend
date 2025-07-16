// const data = require("../data/word.json");
const { Language } = require("../models/language");
const { Word } = require("../models/word");
const { Translation } = require("../models/translation");

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

  let translationData = [];

  for (var i = 0; i < data.length; i++) {
    var wordGroup = data[i];

    let newTranslation = [];

    //grupo de palavras
    for (const key in wordGroup) {
      var word = wordGroup[key];

      const index = languagesData.findIndex(
        (item) => item.languageName === key
      );

      const languageId = languagesData[index].languageId;

      const responseWord = await insertWord(word, languageId);

      statusLoadData.push(responseWord);

      //newTranslation["wordID"] = responseWord.wordId;
      newTranslation.push(responseWord.word);
    }

    translationData.push(newTranslation);
  }

  //console.log(translationData);

  for (var i = 0; i < translationData.length; i++) {
    var wordGroup = translationData[i];

    //console.log("traducao agrupada", wordGroup);

    for (const key in wordGroup) {
      const word = wordGroup[key];

      //procurar se a palavra existe na tabela traducao
      const wordMain = await Translation.findOne({ "word._id": word._id });

      if (!wordMain) {
        const newTranslations = [];
        for (const key in wordGroup) {
          const wordTranslation = wordGroup[key];

          console.log("wordTranslation", wordTranslation);
          console.log("word", word);

          if (wordTranslation._id !== word._id)
            newTranslations.push(wordTranslation);
        }

        translation = new Translation({
          word: word,
          translations: newTranslations,
        });

        translation = await translation.save();
      }
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
        word: word,
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
      word: newWordData,
    };
  } catch (error) {
    throw error;
  }
}

exports.processData = processData;
