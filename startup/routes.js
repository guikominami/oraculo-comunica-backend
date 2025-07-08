const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const languages = require("../routes/languages");
const words = require("../routes/words");
const translations = require("../routes/translations");
const error = require("../middleware/error");
const cors = require("../middleware/cors");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors);

  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/languages", languages);
  app.use("/api/words", words);
  app.use("/api/translations", translations);

  //because there is an next if there is error
  app.use(error);
};
