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
  selectReviewCommentsById(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { category } = req.query;

  const promises = [selectReviews(category)];

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
