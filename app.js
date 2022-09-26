const express = require ("express");

const logger = require("morgan");
const cors = require("cors");
// const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

require('dotenv').config();

const authRouter = require('./routes/api/auth');
/* const usersRouter = require("./routes/api/users"); */

const booksRouter = require("./routes/api/books");
const statsRouter = require("./routes/api/stats");

// const statsRouter = require("./routes/api/stats");


const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static("public"))

app.use('/api/auth', authRouter);
/* app.use("/api/users", usersRouter); */

app.use("/api/books", booksRouter);
app.use("/api/training", statsRouter);


// app.use("/api/stats", statsRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  });
  
module.exports = app;
