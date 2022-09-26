const { Book } = require("../../models/book");
const { RequestError } = require("../../helpers");

const updateResume = async (req, res) => {
const { bookId } = req.params;

const result = await Book.findByIdAndUpdate(bookId, {resume: req.body}, {new: true});
if(!result) {
    throw RequestError(404, "Not found");
}
res.json(result);
};

module.exports = updateResume;
