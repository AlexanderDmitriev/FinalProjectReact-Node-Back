const { isValidObjectId } = require("mongoose");
const { RequestError } = require("../helpers");

const isValidId = (req, res, next) => {
    const { bookId } = req.params;
    const isCorrectId = isValidObjectId(bookId);
    if (!isCorrectId) {
        const error = RequestError(400, `${bookId} is not correct id format`);
        next(error);
      }
      next();
};

module.exports = isValidId;