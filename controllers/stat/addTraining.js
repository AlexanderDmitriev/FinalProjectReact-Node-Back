const { Book } = require("../../models/book");
const { Stat } = require("../../models/stat");

const { RequestError } = require("../../helpers");

const addTraining = async (req, res) => {
  const {book: booksId, start, end} = req.body;
  const { _id: userId } = req.user;

  if (booksId.length < 1) {
    throw RequestError(400, "Bad request");
  }

  try {
    booksId.forEach(async (bookId) => {
      await Book.findByIdAndUpdate(bookId, { status: "in progress" });
    });
  } catch (err) {
    throw RequestError(500, err);
  }

  const newTraining = {
    training: {
      active: booksId,
      start,
      end
    },
    owner: userId
  };

  const result = await Stat.create(newTraining);
  res.status(201).json(result);
};

module.exports = addTraining;
