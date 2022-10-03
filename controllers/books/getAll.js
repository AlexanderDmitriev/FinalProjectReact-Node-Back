const { Book } = require("../../models/book");

const getAll = async (req, res) => {

    const { _id: owner } = req.user;
    const result = await Book.find({ owner }, " -createdAt -updatedAt"
    );

    res.json(result);
};

module.exports = getAll;