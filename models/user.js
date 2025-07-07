const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
   },
   email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
   },
   password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
   },
   date: { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function () {
   const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
   return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
   const schema = Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(5).max(255).required(),
   });

   return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
