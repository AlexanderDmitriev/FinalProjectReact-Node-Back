const { Book } = require("../../models/book");
const { Stat } = require("../../models/stat");

const { RequestError } = require("../../helpers");

const addStatistics = async (req, res) => {
    const { _id: userId } = req.user;
    const newDailyStats = req.body;

    const oldStatistic = await Stat.findOne({owner: userId, status: "in progress"});
    const booksId = oldStatistic.training.active;
    const activeBooks = [];

    await booksId.forEach(async (item) => {
              const book = await Book.findById(item);
              activeBooks.push(book);
              console.log(book);
              console.log("search done");
            });
    
    const totalPagesReaded = oldStatistic.statistic.reduce((acc, {pages}) => {
        if(!pages) {
            return acc;
        }
        console.log("total pages")
        return acc + parseInt(pages);
    },0) + parseInt(newDailyStats.pages);

    console.log(totalPagesReaded)

    
    const planningPages = 0;

    for(let i = 0; i < activeBooks.length; i += 1) {
        
        if((+activeBooks[i] + planningPages) > totalPagesReaded) {
            break;
        };

        if (activeBooks[i].status === "in progress") {
            activeBooks[i].status = "finished";
            await Book.findByIdAndUpdate(activeBooks[i]._id, { status: "finished"});
        };
    };

    const finishedBooks = activeBooks.filter(book => book.status === "finished");

    console.log(finishedBooks)
    console.log(activeBooks)

    const isTrainingFinished = activeBooks.length === finishedBooks.length;

    oldStatistic.statistic.push(newDailyStats);

    const result = await Stat.findOneAndUpdate({_id: oldStatistic._id},{statistic: oldStatistic.statistic}, {new: true})

    if (isTrainingFinished) {
        result.message = "Training succesffuly end";
        await Stat.findOneAndUpdate({_id: oldStatistic._id},{status: "done"});
        console.log("finish ???")
    }

    res.status(201).json(result);
};

module.exports = addStatistics;

