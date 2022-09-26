const express = require("express");

const ctrl = require("../../controllers/books");

const {ctrlWrapper} = require("../../helpers");

const { validationBody } = require("../../middlewares")

const {schemas} = require("../../models/book");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getAll));

router.post("/", validationBody(schemas.addSchema) , ctrlWrapper(ctrl.add));

module.exports = router;