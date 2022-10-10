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
    .then(({ rows: [review] }) => {
      return review;
    });
};
