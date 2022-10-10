const {
  selectReviewById,
  updateReviewVotesById,
} = require("../models/reviewModels");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch(next);
};

exports.patchReviewVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const reviewUpdate = req.body;
  updateReviewVotesById(review_id, reviewUpdate)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch(next);
};
