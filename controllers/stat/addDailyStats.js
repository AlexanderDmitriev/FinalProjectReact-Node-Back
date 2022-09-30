const { Book } = require("../../models/book");
const { Stat } = require("../../models/stat");

const { RequestError } = require("../../helpers");

const addStatistics = async (req, res) => {
  const { _id: userId } = req.user;
  const newDailyStats = req.body;

  const oldStatistic = await Stat.findOne({
    owner: userId,
    status: "in progress",
  });

  if(!oldStatistic) {
    throw RequestError(400, "Not found active training");
  }
  const booksId = oldStatistic.training.active;
  const allBooks = await Book.find({ owner: userId }, " -createdAt -updatedAt");
  const activeBooks = allBooks.filter((book) => booksId.includes(book._id));
  const totalPagesReaded =
    oldStatistic.statistic.reduce((acc, { pages }) => {
      if (!pages) {
        return acc;
      }
      return acc + parseInt(pages);
    }, 0) + parseInt(newDailyStats.pages);

  let activePagesCount = 0;

  await (async function () {
    for (let i = 0; i < activeBooks.length; i += 1) {
      activePagesCount += parseInt(activeBooks[i].pages);
      console.log(activePagesCount);

      if (activePagesCount > totalPagesReaded) {
        break;
      }

      if (activeBooks[i].status === "in progress") {
        activeBooks[i].status = "finished";
        await Book.findByIdAndUpdate(activeBooks[i]._id, {
          status: "finished",
        });
      }
    }
  })();

  const finishedBooks = activeBooks.filter(
    (book) => book.status === "finished"
  );

  const isTrainingDone = activeBooks.length === finishedBooks.length;
  oldStatistic.statistic.push(newDailyStats);

  let result = {};

  if (isTrainingDone) {
    result = await Stat.findOneAndUpdate(
      { _id: oldStatistic._id },
      { statistic: oldStatistic.statistic, status: "done" },
      { new: true }
    );
  } else {
    result = await Stat.findOneAndUpdate(
      { _id: oldStatistic._id },
      { statistic: oldStatistic.statistic },
      { new: true }
    );
  }

  res.status(201).json(result);
};

module.exports = addStatistics;
