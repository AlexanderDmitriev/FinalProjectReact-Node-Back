const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSchemaValidationErrors } = require("../helpers");

const statSchema = new Schema(
  {
    training: {
      active: [
        Schema.Types.ObjectId,        
      ],
      start: {
        type: String,
        default: null,
      },
      end: {
        type: String,
        default: null,
      },
    },
    statistic: [
      {
        date: {
          type: String,
          default: null,
        },
        time: {
          type: String,
          default: null
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
  start: Joi.string().length(10).required(),
  end: Joi.string().length(10).required(),
});

const addDailyStatsSchema = Joi.object({
  date: Joi.string().length(10).required(),
  time: Joi.string().length(8).required(),
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
