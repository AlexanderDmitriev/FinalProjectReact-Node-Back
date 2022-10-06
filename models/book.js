const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSchemaValidationErrors } = require("../helpers");

const statusKind = ["plan", "in progress", "finished"];
const ratingKind = ["1", "2", "3", "4", "5", null];

titleRegexp = /^[^ -].{1,50}$/;
authorRegexp = /^[^ -]\D{1,50}$/;
yearRegexp = /^[12]\d{3}$/;
pagesRegexp = /^[^0\D]\d{0,3}$/;

const bookSchema = new Schema ({
    title: {
        type: String,
        required: [true, "Set title for book"],
        match: titleRegexp,
      },
      author: {
        type: String,
        required: [true, "Set author for book"],
        match: authorRegexp,
      },
      year: {
        type: String,
        match: yearRegexp,
        default: null
      },
      pages: {
        type: String,
        required: [true, "Set amount pages for book"],
        match: pagesRegexp,
      },
      status: {
        type: String,
        enum: statusKind,
        default: "plan",
      },
      resume: {
        comment: {
          type: String,
          default: null,
          minLength: 1,
          maxLength: 1000
        },
        rating: {
          type: String,
          enum: ratingKind,
          default: null,
        },
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
}, { versionKey: false, timestamps: true });

bookSchema.post("save", handleSchemaValidationErrors);

// ** Joi schemas ***************************************

const addSchema = Joi.object({
    title: Joi.string().pattern(titleRegexp).required(),
    author: Joi.string().pattern(authorRegexp).required(),
    year: Joi.string().empty('').pattern(yearRegexp),
    pages: Joi.string().pattern(pagesRegexp).required(),
    status: Joi.string().valueOf(...statusKind),
  })

  const updateResumeSchema = Joi.object({
    comment: Joi.string().min(1).max(1000).required(),

    rating: Joi.string().valueOf(...ratingKind)
})

  const schemas = {
    addSchema,
    updateResumeSchema
  }

const Book = model("book", bookSchema);

module.exports = {
    Book,
    schemas,
  }