const { patchCommentVotesById, deleteCommentById } = require("../controllers/comment.controllers")
const commentRouter = require("express").Router();

commentRouter
    .route("/:comment_id")
    .patch(patchCommentVotesById)
    .delete(deleteCommentById)

module.exports = commentRouter;