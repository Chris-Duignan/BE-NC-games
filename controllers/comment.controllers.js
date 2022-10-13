const { removeCommentById } = require("../models/comment.models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id).then(() => {
    res.status(204).end();
  }).catch(next)
};
