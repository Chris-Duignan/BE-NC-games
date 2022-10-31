const express = require("express");
const apiRouter = require("./routes/api-router");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleInternalError,
} = require("./error_handling");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).send({
    msg: "Route not Found",
  });
});

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleInternalError);

module.exports = app;
