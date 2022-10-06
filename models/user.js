const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleSchemaValidationErrors } = require("../helpers");

const emailRegexp =
  /^(([a-z0-9_-]+\.)*[a-z0-9_-]{2,6})+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

const passwordRegexp = /^[^-\.А-Яа-я ][^А-Яа-я ]{4,29}$/;

const nameRegexp =
  /^(([a-zA-Z0-9_' -]{3,100})|([а-яА-ЯЁёІіЇїҐґЄє0-9_' -]{3,100}))$/u;

const userShema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxLength: 100,
      required: [true, "Set name for user"],
    },
    email: {
      type: String,
      minlength: 6,
      maxLength: 63,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      minlength: 5,
      required: [true, "Password is required"],
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userShema.post("save", handleSchemaValidationErrors);

// ** Joi schemas ***************************************
const singupSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).min(3).max(100).required(),
  email: Joi.string().min(6).max(63).required(),
  password: Joi.string().pattern(passwordRegexp).min(5).max(30).required(),
  repeat_password: Joi.string().required().valid(Joi.ref("password")),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).max(63).required(),
  password: Joi.string().pattern(passwordRegexp).min(5).max(30).required(),
});

const schemas = {
  singupSchema,
  loginSchema,
};
// *****************************************************

const User = model("user", userShema);

module.exports = {
  User,
  schemas,
};
