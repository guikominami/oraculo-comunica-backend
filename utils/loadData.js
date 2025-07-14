const { random } = require("lodash");
const data = require("../data/word.json");

function loadData() {
  const languages = Object.keys(data[0]);
  let languagesData = [];

  for (key in languages) {
    const newLanguageId = insertLanguage(languages[key]);

    let newLanguage = {};
    //newLanguage[languages[key]] = newLanguageId;
    newLanguage["languageName"] = languages[key];
    newLanguage["languageId"] = newLanguageId;

    languagesData.push(newLanguage);
  }

  console.log(languagesData);

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];

    for (const key in obj) {
      var value = obj[key];
      console.log("language name: " + key);
      console.log("palavra: " + value);

      const index = languagesData.findIndex(
        (item) => item.languageName === key
      );

      console.log(languagesData[index].languageId);
      console.log(languagesData[index].languageName);

      console.log("----------------------");
      // console.log("language: " + key);
      // console.log("languageId: ");
      // console.log("word: " + value);
      // console.log("----------------------");
    }
  }
}

function insertLanguage(languageName) {
  //console.log(languageName);
  return random(10);
}

loadData();
