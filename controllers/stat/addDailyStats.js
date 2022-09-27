const { Book } = require("../../models/book");
const { Stat } = require("../../models/stat");

const { RequestError } = require("../../helpers");

const addStatistics = async (req, res) => {
    const { _id: userId } = req.user;
    const newDailyStats = req.body;

    const oldStatistic = await Stat.findOne({owner: userId});
    const booksId = oldStatistic.active;
    const activeBooks = [];

    booksId.forEach(async (item) => {
              const book = await Book.findOne(item);
              activeBooks.push(book)
            });
    
    const totalPagesReaded = oldStatistic.statistic.reduce((acc, {pages}) => {
        if(!pages) {
            return acc;
        }
        return acc + pages;
    },0) + newDailyStats.pages;

    
    const planningPages = 0;

    for(let i = 0; i < activeBooks.length; i += 1) {
        
        if((+activeBooks[i] + planningPages) > totalPagesReaded) {
            break;
        };

        if (activeBooks.status === "in progress") {
            activeBooks.status = "finished";
            await Book.findByIdAndUpdate(activeBooks._id, { status: "finished"});
        }
    }

    const finishedBooks = activeBooks.filter(book => book.status === "finished");

    const isTrainingFinished = activeBooks.length === finishedBooks.length;

    const {statistic} = oldStatistic.statistic.push(newDailyStats);

    const result = await Stat.findOneAndUpdate({_id: oldStatistic._id},{statistic}, {new: true})

    if (isTrainingFinished) {
        result.message = "Training succesffuly end"
    }

    res.status(201).json(result);
};

module.exports = addStatistics;

