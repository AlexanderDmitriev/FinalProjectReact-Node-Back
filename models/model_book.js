const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { hendleSchemaValidationErrors } = require('../helpers/index');

const statusKind = ["plan", "in progress", "finished"];

// Поле, в которое вводится год, проверяется через регулярное выражение, проверяет, что вводится целое число.
//  /^(0)$|^([1-9][0-9]*)$/
// /^-?\d{4}$/ на случай до н.э. 

const bookShema = new Schema({
  title: {
    type: String,
    required: [true, "Set title for book"],
  },
  author: {
    type: String,
    required: [true, "Set author for book"],
  },
  year: {
    type: String,
    // required: [true, "Set publication year for book"],
  },
  pages: {
    type: String,
    required: [true, "Set amount pages for book"],
  },
  status: {
    type: String,
    enum: statusKind,
    default: "plan",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    // required: true,
  },
}, { versionKey: false, timestamps: true });

bookShema.post("save", hendleSchemaValidationErrors);

// ** Joi schemas ***************************************
const addSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.string(),
  pages: Joi.string().required(),
  status: Joi.string().valueOf(...statusKind),
})

const schemas = {
  addSchema,
  
}
// *****************************************************

const Book = model("book", bookShema);

module.exports = {
  Book,
  schemas,
}

//   resume: {
//     comment: {
//       type: String,
//       default: null,
//     },
//     rating: {
//       type: String,
//       enum: ["1", "2", "3", "4", "5"],
//       default: null,
//     },
//   },