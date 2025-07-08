const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/db")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/validation");

const server = app.listen(3000, () => console.log("Listening on port 3000"));

module.exports = server;
