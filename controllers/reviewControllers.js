const {
  selectReviewById,
  selectReviews,
  updateReviewVotesById,
} = require("../models/reviewModels");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({review});
    })
    .catch(next);
};

exports.getReviews = (req, res, next)  => {
  const { category } = req.query;
  selectReviews(category).then((reviews) => {
    res.status(200).send({reviews});
  }).catch(next);
}

exports.patchReviewVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const reviewUpdate = req.body;
  updateReviewVotesById(review_id, reviewUpdate)
    .then((review) => {
      res.status(200).send({review});
    })
    .catch(next);
};
