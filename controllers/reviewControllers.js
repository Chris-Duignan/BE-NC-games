const {
  selectReviewById,
  selectReviews,
  selectReviewCommentsById,
  updateReviewVotesById,
} = require("../models/reviewModels");
const { selectCategoryBySlug } = require("../models/categoryModels");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviewCommentsById = (req, res, next) => {
  const { review_id } = req.params;

  const promises = [
    selectReviewById(review_id),
    selectReviewCommentsById(review_id),
  ];

  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ comments: promises[1] });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { category } = req.query;
  const { sort_by } = req.query;
  const { order } = req.query;

  const promises = [selectReviews(category, sort_by, order)];

  if (category) {
    promises.push(selectCategoryBySlug(category));
  }

  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ reviews: promises[0] });
    })
    .catch(next);
};

exports.patchReviewVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const reviewUpdate = req.body;
  updateReviewVotesById(review_id, reviewUpdate)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
