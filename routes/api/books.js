const express = require("express");

const ctrl = require("../../controllers/books");

const { ctrlWrapper } = require("../../helpers");

const { validationBody, isValidId } = require("../../middlewares");

const { schemas } = require("../../models/book");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getAll));

router.post("/", validationBody(schemas.addSchema), ctrlWrapper(ctrl.add));

router.patch(
  "/:bookId",
  isValidId,
  validationBody(schemas.updateResumeSchema),
  ctrlWrapper(ctrl.updateResume)
);

module.exports = router;
