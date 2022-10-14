const {
    getReviewById,
    getReviews,
    getReviewCommentsById,
    postReview,
    postCommentByReviewId,
    patchReviewVotesById,
    deleteReviewById
  } = require("../controllers/reviewControllers");

const reviewRouter = require("express").Router();

reviewRouter
  .route("/")
  .get(getReviews)
  .post(postReview);

reviewRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotesById)
  .delete(deleteReviewById);

reviewRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postCommentByReviewId);

module.exports = reviewRouter;