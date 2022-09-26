const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { hendleSchemaValidationErrors } = require('../helpers/index');

const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
// const emailRegexp = /^[\w.]+@[\w]+.[\w]+$/;

const userShema = new Schema({
  name: {
  type: String,
  required: [true, "Set name for user"],
  },
  email: {
    type: String,
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

userShema.post("save", hendleSchemaValidationErrors);

// ** Joi schemas ***************************************
const singupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(), 
  repeat_password: Joi.string().required().valid(Joi.ref('password')),
})

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
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