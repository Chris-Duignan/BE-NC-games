const { deleteCommentById } = require("../controllers/comment.controllers")
const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteCommentById)

module.exports = commentRouter;