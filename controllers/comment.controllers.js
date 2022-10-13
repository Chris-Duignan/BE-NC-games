const { updateCommentVotesById, removeCommentById } = require("../models/comment.models");

exports.patchCommentVotesById = (req, res, next) => {
  const {comment_id} = req.params;
  const request = req.body;

  updateCommentVotesById(comment_id, request).then((comment) => {
    res.status(200).send({comment});
  }).catch(next);
}

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id).then(() => {
    res.status(204).end();
  }).catch(next)
};
