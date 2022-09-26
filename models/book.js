const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSchemaValidationErrors } = require("../helpers");

const statusKind = ["plan", "in progress", "finished"];
const ratingKind = ["1", "2", "3", "4", "5", null];

const bookSchema = new Schema ({
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
        required: [true, "Set publication year for book"],
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
      resume: {
        comment: {
          type: String,
          default: null,
        },
        rating: {
          type: String,
          enum: ratingKind,
          default: null,
        },
      },
    //   owner: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //   },
}, { versionKey: false, timestamps: true });

bookSchema.post("save", handleSchemaValidationErrors);

// ** Joi schemas ***************************************

const addSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    year: Joi.string(),
    pages: Joi.string().required(),
    status: Joi.string().valueOf(...statusKind),
  })

  const updateResumeSchema = Joi.object({
    // resume: Joi.object({
      comment: Joi.string().required(),
      rating: Joi.string().valueOf(...ratingKind)
    // })
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