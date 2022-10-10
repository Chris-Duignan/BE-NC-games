const express = require("express");
const { getCategories } = require("./controllers/categoryControllers");
const { getReviewById } = require("./controllers/reviewControllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.use((req, res, next) => {
  res.status(404).send({
    msg: "Route not Found",
  });
});

app.use((err, req, res, next) => {
    console.log(err)
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({msg: "Unexpected field type"})
    }
})

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
