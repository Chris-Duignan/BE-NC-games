const {
  selectReviewById,
  selectReviews,
  selectReviewCommentsById,
  insertCommentByReviewId,
  updateReviewVotesById,
} = require("../models/reviewModels");
const { selectCategoryBySlug } = require("../models/categoryModels");
const { selectUserByUsername } = require("../models/usersModels");

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

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const request = req.body;
  const {username} = request;

  const promises = [
    selectReviewById(review_id),
    selectUserByUsername(username),
    insertCommentByReviewId(review_id, request),
  ];

  Promise.all(promises)
    .then((promises) => {
      res.status(201).send({ comment: promises[2] });
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
