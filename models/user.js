const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleSchemaValidationErrors } = require("../helpers");

// const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const emailRegexp = /^[\w.]+@[\w]+.[\w]+$/;

const userShema = new Schema({
  name: {
  type: String,
  required: [true, "Set name for user"],
  },
  email: {
    type: String,
    minlength: 6,
    maxLength: 63,
    required: [true, 'Email is required'],
    match: emailRegexp,
    unique: true,
  },   
  password: {
    type: String,
    minlength: 6,  
    required: [true, 'Password is required'],
  },
  token: {
    type: String,
    default: "",
  },
}, { versionKey: false, timestamps: true });

userShema.post("save", handleSchemaValidationErrors);


// ** Joi schemas ***************************************
const singupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).min(6).required(),
  password: Joi.string().min(6).max(6).required(), 
  repeat_password: Joi.string().required().valid(Joi.ref('password')),
})

const loginSchema = Joi.object({
  email: Joi.string().min(6).max(6).pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
})

const schemas = {
  singupSchema,
  loginSchema,
}
// *****************************************************

const User = model("user", userShema);

module.exports = {
    User,
    schemas,
}