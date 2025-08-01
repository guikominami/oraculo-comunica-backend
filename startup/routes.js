const express = require("express");
const languages = require("../routes/languages");
const words = require("../routes/words");
const dataJson = require("../routes/dataJson");
const translations = require("../routes/translations");
const profiles = require("../routes/profiles");
const error = require("../middleware/error");
const cors = require("../middleware/cors");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors);

  app.use("/api/languages", languages);
  app.use("/api/words", words);
  app.use("/api/translations", translations);
  app.use("/api/dataJson", dataJson);
  app.use("/api/profiles", profiles);

  //because there is an next if there is error
  app.use(error);
};
