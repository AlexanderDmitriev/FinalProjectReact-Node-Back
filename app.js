const express = require("express");

const path = require("path");

const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// require('dotenv').config();
require("dotenv").config({ path: path.join(__dirname, "./.env") });

const authRouter = require('./routes/api/auth');
const booksRouter = require("./routes/api/books");
const statsRouter = require("./routes/api/stats");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static("public"))

app.use('/api/users', authRouter);
app.use('/link', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/link.html"));
});
app.use("/api/books", booksRouter);
app.use("/api/training", statsRouter);
// app.use("/api/stats", statsRouter);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  });
  
module.exports = app;