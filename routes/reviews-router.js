const {
    getReviewById,
    getReviews,
    getReviewCommentsById,
    postCommentByReviewId,
    patchReviewVotesById,
  } = require("../controllers/reviewControllers");

const reviewRouter = require("express").Router();

reviewRouter
  .route("/")
  .get(getReviews);

reviewRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotesById);

reviewRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postCommentByReviewId);

module.exports = reviewRouter;