const db = require("../db/connection");

exports.selectReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then(({ rows: [review] }) => {
      if (review === undefined) {
        return Promise.reject({ status: 404, msg: `Id ${id} not Found` });
      } else {
        return review;
      }
    });
};

exports.updateReviewVotesById = (id, update) => {
  if (!update.inc_votes) {
    return Promise.reject({ status: 400, msg: "Please enter inc_votes field" });
  }

  const { inc_votes } = update;
  return db
    .query(
      `UPDATE reviews
      SET 
        votes = votes + $1
      WHERE review_id = $2
      RETURNING *;`,
      [inc_votes, id]
    )
    .then(({ rows: review }) => {
      if (review.length === 0) {
        return Promise.reject({ status: 404, msg: `Id ${id} not found` });
      } else {
        return review[0];
      }
    });
};
