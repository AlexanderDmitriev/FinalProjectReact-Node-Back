const { Schema, model } = require('mongoose');
// const Joi = require('joi');

const { hendleSchemaValidationErrors } = require('../helpers/index');

const statShema = new Schema({
  start: {
    type: Date,
    default: null,
  },
  end: {
    type: Date,
    default: null,
  },
  date: {
    type: Date,
    default: null,
  },
  pages: {
    type: String,
    default: null,
  },
    book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  owner: {
  type: Schema.Types.ObjectId,
  ref: "User",
  },
}, { versionKey: false, timestamps: true });

statShema.post("save", hendleSchemaValidationErrors);

// ** Joi schemas ***************************************
// const Schema = Joi.object({
//   енд-поінт початку планування
// })

// const Schema = Joi.object({
//   енд-поінт додавання прочитаних сторінок у планування
// })

const schemas = {

}
// *****************************************************

const Stat = model("book", statShema);

module.exports = {
    Stat,

}


// const statSchema = new mongoose.Schema({
//   training: {
//     active: [
//       {
//         book: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Book",
//         },
//       },
//     ],
//     start: {
//       type: Date,
//       default: null,
//     },
//     end: {
//       type: Date,
//       default: null,
//     },
//   },
//   statistic: [
//     {
//       date: {
//         type: Date,
//         default: null,
//       },
//       pages: {
//         type: String,
//         default: null,
//       },
//     },
//   ],
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// });

// const Stat = mongoose.model("Stat", statSchema);
// module.exports = {
//   User,

// };