const { Stat } = require("../../models/stat");
const { RequestError } = require("../../helpers");

const getStatistics = async (req, res) => {
    const { _id } = req.user;

    const result = await Stat.findOne({owner: _id, status: "in progress"})
    if(!result) {
        throw RequestError(400, "Not found active training");
      }

    res.status(201).json(result);
};

module.exports = getStatistics;