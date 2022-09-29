const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSchemaValidationErrors } = require("../helpers");
const { boolean } = require("joi");

const statSchema = new Schema(
  {
    training: {
      active: [
        Schema.Types.ObjectId,        
      ],
      start: {
        type: Date,
        default: null,
      },
      end: {
        type: Date,
        default: null,
      },
    },
    statistic: [
      {
        date: {
          type: Date,
          default: null,
        },
        pages: {
          type: String,
          default: null,
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["in progress", "done"],
      default: "in progress"
    }
  },
  { versionKey: false, timestamps: true }
);

statSchema.post("save", handleSchemaValidationErrors);

const addTrainSchema = Joi.object({
  book: Joi.array().items(Joi.string().length(24)).min(1).required(),
  start: Joi.date().timestamp().required(),
  end: Joi.date().timestamp().required(),
});

const addDailyStatsSchema = Joi.object({
  date: Joi.date().timestamp().required(),
  pages: Joi.string().pattern(/\d/).required(),
});

const schemas = {
  addTrainSchema,
  addDailyStatsSchema,
};

const Stat = model("stat", statSchema);

module.exports = {
  Stat,
  schemas,
};
