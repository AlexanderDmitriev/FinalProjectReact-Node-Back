const {Book} = require("../../models/book");
const { RequestError } = require("../../helpers");

const add = async(req, res) => {
    const {_id: owner} = req.user;
    const {author, title} = req.body;
    const book = await Book.findOne({author, title, owner});
    if (book) {
        throw RequestError(409, "This book already exsist in your library")
    }
    const result = await Book.create({...req.body, owner});
    res.status(201).json(result);
}

module.exports = add;