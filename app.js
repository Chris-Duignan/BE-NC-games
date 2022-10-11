const express = require("express");
const { getCategories } = require("./controllers/categoryControllers");
<<<<<<< HEAD
const {
  getReviewById,
  patchReviewVotesById,
} = require("./controllers/reviewControllers");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleInternalError,
} = require("./error_handling");
=======
const { getReviewById } = require("./controllers/reviewControllers");
const { getUsers } = require("./controllers/usersControllers");
>>>>>>> main

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewVotesById);

app.get("/api/users", getUsers);

app.use((req, res, next) => {
  res.status(404).send({
    msg: "Route not Found",
  });
});

<<<<<<< HEAD
app.use(handleCustomErrors);
=======
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else {
    next(err);
  }
});
>>>>>>> main

app.use(handlePSQLErrors);

app.use(handleInternalError);

module.exports = app;
