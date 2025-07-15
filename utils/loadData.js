const data = require("../data/word.json");
const { Language } = require("../models/language");
const { Word } = require("../models/word");

async function processData() {
  const languages = Object.keys(data[0]);
  let languagesData = [];

  console.log("insert languages");

  for (const key in languages) {
    const responseLanguage = await insertLanguage(languages[key]);
    console.log(responseLanguage);

    let newLanguage = {};
    const newLanguageId = responseLanguage.languageId;
    //newLanguage[languages[key]] = newLanguageId;
    newLanguage["languageName"] = languages[key];
    newLanguage["languageId"] = newLanguageId;

    languagesData.push(newLanguage);
  }

  console.log(languagesData);

  console.log("---------------------------");
  console.log("insert words");

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
      console.log(responseWord);
    }
  }
}

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

async function insertWord(newWord, languageId) {
  const language = await Language.findById(languageId);
  if (!language)
    return {
      message: "Invalid languageId" + languageId,
    };

  console.log(newWord);
  console.log(language._id);

  const word = await Word.find({
    word: newWord,
    "language._id": language._id,
  });

  console.log(word);

  if (word.length > 0)
    return { message: "Word already registered.", wordId: word._id };

  let newWordData = new Word({
    word: word,
    languageId: language._id,
  });

  newWordData = await newWordData.save();
  return { message: "Word registered successfully.", wordId: newWordData._id };
}

exports.processData = processData;

//só chamar a função se chamar a API
//loadData();
