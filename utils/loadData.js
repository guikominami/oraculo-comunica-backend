// const data = require("../data/word.json");
const { Language } = require("../models/language");
const { Word } = require("../models/word");
const { Translation } = require("../models/translation");

async function processData(data) {
  const languages = Object.keys(data[0]);
  let languagesData = [];
  let statusLoadData = [];

  for (var key in languages) {
    const responseLanguage = await insertLanguage(languages[key]);

    statusLoadData.push(responseLanguage);

    let newLanguage = responseLanguage.language;

    languagesData.push(newLanguage);
  }

  let translationWordGroup = [];

  for (var i = 0; i < data.length; i++) {
    const wordGroup = data[i];

    let newTranslation = [];

    //grupo de palavras
    for (var key in wordGroup) {
      var word = wordGroup[key];

      const index = languagesData.findIndex((item) => item.name === key);

      const language = languagesData[index];

      const responseWord = await insertWord(word, language);

      statusLoadData.push(responseWord);

      newTranslation.push(responseWord.word);
    }

    translationWordGroup.push(newTranslation);
  }

  //adicionar as traduções em cada palavra
  for (var i = 0; i < translationWordGroup.length; i++) {
    const wordGroup = translationWordGroup[i];

    for (var key in wordGroup) {
      const word = wordGroup[key];

      const responseTranslation = await insertTranslation(word, wordGroup);

      statusLoadData.push(responseTranslation);
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
        language: language,
      };

    let newLanguage = new Language({
      name: languageName,
    });

    newLanguage = await newLanguage.save();

    return {
      message: "Language registered successfully.",
      language: newLanguage,
    };
  } catch (error) {
    throw error;
  }
}

async function insertWord(newWord, language) {
  try {
    // const language = await Language.findById(languageId);
    // if (!language)
    //   return {
    //     message: "Invalid languageId" + languageId,
    //   };

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
      language: language,
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

async function insertTranslation(word, wordGroup) {
  try {
    //procurar se a palavra existe na tabela traducao
    const wordMain = await Translation.findOne({ "word._id": word._id });

    if (!wordMain) {
      const newTranslations = [];

      //gravar todas as palavras da matriz como tradução filha da palavra
      for (const key in wordGroup) {
        const wordTranslation = wordGroup[key];

        //não gravar a mesma palavra como tradução
        if (wordTranslation._id !== word._id)
          newTranslations.push(wordTranslation);
      }

      let newTranslation = new Translation({
        word: word,
        translations: newTranslations,
      });

      newTranslation = await newTranslation.save();
      return {
        message: "Translation registered successfully.",
        translation: newTranslation,
      };
    } else {
      console.log("palavra já existe");
      //gravar todas as palavras da matriz como tradução filha da palavra
      for (const key in wordGroup) {
        const wordTranslation = wordGroup[key];

        //não gravar a mesma palavra como tradução
        return {
          message: "Translation already registered.",
          translation: wordMain,
        };
      }
    }
  } catch (error) {
    throw error;
  }
}

exports.processData = processData;
