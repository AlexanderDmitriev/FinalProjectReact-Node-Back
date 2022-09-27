const {Book} = require("../../models/book");

// const add = async (req, res) => {
// const result = await Book.create(req.body);
// res.status(201).json(result);
// }

const add = async(req, res) => {
    const {_id: owner} = req.user;
    const result = await Book.create({...req.body, owner});
    res.status(201).json(result);
}


module.exports = add;