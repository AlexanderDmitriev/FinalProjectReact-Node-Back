const { Book } = require("../../models/book");
const { Stat } = require("../../models/stat");

const { RequestError } = require("../../helpers");

const addTraining = async (req, res) => {
  const {book, start, end} = req.body;
  const { _id: userId } = req.user;

  if (book.length < 1) {
    throw RequestError(400, "Bad request");
  }

  try {
    book.forEach(async (item) => {
      await Book.findByIdAndUpdate(item.id, { status: "in progress" });
    });
  } catch (err) {
    throw RequestError(500, err);
  }

  const newTraining = {
    active: book,
    start,
    end,
    owner: userId
  };

  const result = Stat.create(newTraining);

  res.status(201).json(result);
};

module.exports = addTraining;
