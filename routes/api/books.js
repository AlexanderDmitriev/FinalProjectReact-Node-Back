const express = require("express");

const ctrl = require("../../controllers/books");

const { ctrlWrapper } = require("../../helpers");

const { validationBody, isValidId, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/book");

const router = express.Router();

router.get("/", authenticate, ctrlWrapper(ctrl.getAll));

router.post("/", authenticate, validationBody(schemas.addSchema), ctrlWrapper(ctrl.add));

router.patch(
  "/:bookId",
  isValidId,
  authenticate,
  validationBody(schemas.updateResumeSchema),
  ctrlWrapper(ctrl.updateResume)
);

module.exports = router;
