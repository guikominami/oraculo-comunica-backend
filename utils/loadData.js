const { Profile } = require("../models/profile");
const { Language } = require("../models/language");
const { Word } = require("../models/word");
const { Translation } = require("../models/translation");
const { response } = require("express");

async function processData(data, profileId) {
  const languages = Object.keys(data[0]);
  let languagesData = [];
  let statusLoadData = [];

  const profile = await Profile.findById(profileId);

  if (!profile)
    return {
      message: "Profile is not registered.",
      profile: profileId,
    };

  for (var key in languages) {
    const responseLanguage = await insertLanguage(languages[key], profileId);

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
      const word = wordGroup[key]
        .replace("(", "")
        .replace(")", "")
        .replace("¿", "")
        .replace("¡", "")
        .trim();

      const index = languagesData.findIndex((item) => item.name === key);

      const language = languagesData[index];

      const responseWord = await insertWord(word, language, profileId);

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

      const responseTranslation = await insertTranslation(
        word,
        wordGroup,
        profileId
      );

      statusLoadData.push(responseTranslation);
    }
  }

  return statusLoadData;
}

async function insertLanguage(languageName, profileId) {
  try {
    const language = await Language.findOne({
      name: languageName,
      profileId: profileId,
    });

    if (language)
      return {
        message: "Language already registered.",
        language: language,
      };

    let newLanguage = new Language({
      name: languageName,
      profileId: profileId,
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

async function insertWord(newWord, language, profileId) {
  try {
    const word = await Word.findOne({
      word: newWord,
      "language._id": language._id,
      profileId: profileId,
    });

    if (word)
      return {
        message: "Word already registered.",
        word: word,
      };

    let newWordData = new Word({
      word: newWord,
      language: language,
      profileId: profileId,
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

async function insertTranslation(word, wordGroup, profileId) {
  try {
    let statusTranslation = [];

    //procurar se a palavra existe na tabela traducao
    const wordMain = await Translation.findOne({
      "word._id": word._id,
      profileId: profileId,
    });

    //se a palavra não existir como principal na lista de traduções
    if (!wordMain) {
      const newTranslations = [];

      //gravar todas as palavras da matriz como tradução filha da palavra
      for (const key in wordGroup) {
        const wordListTranslation = wordGroup[key];

        //não gravar a mesma palavra como tradução
        if (word._id !== wordListTranslation._id)
          newTranslations.push(wordListTranslation);
      }

      let newTranslation = new Translation({
        word: word,
        translations: newTranslations,
        profileId: profileId,
      });

      newTranslation = await newTranslation.save();

      const response = {
        message: "Translation registered successfully.",
        translation: newTranslation,
      };

      return response;

      //se a palavra existir como principal na lista de traduções
    } else {
      //procurar todas as palavras da matriz como tradução filha da palavra
      for (const key in wordGroup) {
        const word = wordGroup[key];

        if (word._id.toString() !== wordMain.word._id.toString()) {
          const response = await updateTranslation(wordMain, word, profileId);

          statusTranslation.push(response);
        }
      }

      return statusTranslation;
    }
  } catch (error) {
    throw error;
  }
}

async function updateTranslation(wordMain, word, profileId) {
  //procurar na tabela translation se a palavra mãe
  // e a tradução já foram cadastradas

  const wordListTranslation = await Translation.findOne({
    _id: wordMain._id,
    "translations._id": word._id,
  });

  //Atualizar a lista de traduções se a palavra ainda não estiver gravada na lista de traduções. Não gravar a mesma palavra como tradução.
  if (!wordListTranslation) {
    //gravar as traduções que não existem na palavra chave
    let newTranslation = await Translation.findByIdAndUpdate(wordMain._id, {
      $push: {
        translations: word,
      },
    });
    newTranslation = await newTranslation.save();

    return {
      message: "Translation updated successfully.",
      translation: newTranslation,
    };
  } else {
    return {
      message: "Translation already registered.",
      translation: wordListTranslation,
    };
  }
}

exports.processData = processData;
