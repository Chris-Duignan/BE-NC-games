const express = require("express");
const { getCategories } = require("./controllers/categoryControllers");
const {
  getReviewById,
  getReviews,
  getReviewCommentsById,
  postCommentByReviewId,
  patchReviewVotesById,
} = require("./controllers/reviewControllers");
const {getUsers} = require("./controllers/usersControllers");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleInternalError,
} = require("./error_handling");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getReviewCommentsById);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.patch("/api/reviews/:review_id", patchReviewVotesById);


app.get("/api/users", getUsers);

app.use((req, res, next) => {
  res.status(404).send({
    msg: "Route not Found",
  });
});

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleInternalError);

module.exports = app;
