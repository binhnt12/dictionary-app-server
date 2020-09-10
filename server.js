const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

// router
const searchRouter = require("./api/routes/search");
const userRouter = require("./api/routes/user");
const protectedRouter = require("./api/routes/protect");

// middlewares
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(logger("dev"));

app.use("/api/search", searchRouter);
app.use("/api/user", userRouter);
app.use("/api/protect", authMiddleware.requireAuth, protectedRouter);

// if the request passes all the middleware without a response
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// for general error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.response,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});
