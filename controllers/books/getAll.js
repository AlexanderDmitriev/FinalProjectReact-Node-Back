const { Book } = require("../../models/book");

const getAll = async (req, res) => {
    // const result = await Book.find({}, "-createdAt -updatedAt");
    // res.json(result);

    const { _id: owner } = req.user;
    const result = await Book.find({ owner }, " -createdAt -updatedAt"
    // ).populate("owner", "email");
    );

    res.json(result);
};

module.exports = getAll;