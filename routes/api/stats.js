const express = require("express");

const ctrl = require("../../controllers/stat");

const { ctrlWrapper } = require("../../helpers");

const { validationBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/stat");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validationBody(schemas.addTrainSchema),
  ctrlWrapper(ctrl.addTraining)
);

router.post(
  "/stats",
  authenticate,
  validationBody(schemas.addDailyStatsSchema),
  ctrlWrapper(ctrl.addDailyStats)
);

router.get("/stats", authenticate, ctrlWrapper(ctrl.getStatistics));

module.exports = router;
