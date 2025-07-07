const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

const config = require("config");

module.exports = function () {
  //Exceção para log de errors ao iniciar, pois o
  //winston não pegaria esse erro.
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(
    new winston.transports.File({ filename: "logfile.log", level: "error" })
  );

  const db = config.get("db");

  winston.add(new winston.transports.MongoDB({ db: db, level: "error" }));
};
