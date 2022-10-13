const { removeCommentById, selectCommentById } = require("../models/comment.models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  const promises = [selectCommentById(comment_id), removeCommentById(comment_id)]

  Promise.all(promises).then((promises) => {
    res.status(204).end();
  }).catch(next)
};
