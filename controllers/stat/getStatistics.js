const { Stat } = require("../../models/stat");
const { RequestError } = require("../../helpers");

const getStatistics = async (req, res) => {
    const { _id } = req.user;

    const result = Stat.findOne({owner: _id})

    if (!result) {
        throw RequestError(500, "Something went wrong");
    }

    res.status(201).json(result);
};

module.exports = addTraining;