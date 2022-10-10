const db = require("../db/connection");

exports.selectReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then(({ rows: [review] }) => {
      return review;
    });
};
